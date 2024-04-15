import * as web3 from "@solana/web3.js";
import { Food } from "./Food";

const FOOD_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export class FoodCoordinator {
  static accounts: web3.PublicKey[] = [];

  static async prefetchAccounts(connection: web3.Connection) {
    const accounts: any = await connection.getProgramAccounts(
      new web3.PublicKey(FOOD_REVIEW_PROGRAM_ID),
      {
        dataSlice: { offset: 2, length: 18 },
      }
    );

    accounts?.sort((a: any, b: any) => {
      const lengthA = a.account.data.readUInt32LE(0);
      const lengthB = b.account.data.readUInt32LE(0);
      const dataA = a.account.data.slice(4, 4 + lengthA);
      const dataB = b.account.data.slice(4, 4 + lengthB);
      return dataA.compare(dataB);
    });

    this.accounts = accounts.map((account: any) => account.pubkey);
  }

  static async fetchPage(
    connection: web3.Connection,
    page: number,
    perPage: number
  ): Promise<Food[] | null> {
    if (this.accounts.length === 0) {
      await this.prefetchAccounts(connection);
    }

    const paginatedPublicKeys = this.accounts.slice(
      (page - 1) * perPage,
      page * perPage
    );

    if (paginatedPublicKeys.length === 0) {
      return [];
    }

    const accounts = await connection.getMultipleAccountsInfo(
      paginatedPublicKeys
    );

    // const foods = accounts.reduce((accum: Food[], account) => {
    //   const food = Food.deserialize(account?.data);
    //   if (!food) {
    //     return accum;
    //   }
    //   return [...accum, food];
    // }, []);

    const foods = accounts.map((account) => {
      const food = Food.deserialize(account?.data);
      return food;
    });

    return foods;
  }
}
