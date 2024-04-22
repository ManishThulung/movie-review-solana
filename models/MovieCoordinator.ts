import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { Movie } from "./Movie";

const MOVIE_REVIEW_PROGRAM_ID = "Bq4we4RcyXUxEFkqwXp2UKqCggHcDXBfBU6gdwNxuow8";

export class MovieCoordinator {
  static accounts: web3.PublicKey[] = [];

  static async prefetchAccounts(connection: web3.Connection, search: string) {
    const accounts: any = await connection.getProgramAccounts(
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        // 1 -> to sort data by title, initialized takes 1 byte and title comes second
        // 18 -> the length of title is dynamic so assuming 18 bytes is enough for title
        dataSlice: { offset: 2, length: 18 },
        filters:
          search === ""
            ? []
            : [
                {
                  memcmp: {
                    //  The offset to the title fields is 1, but the first 4 bytes are the length of the title so the actual offset to the string itself is 5
                    offset: 6,
                    bytes: bs58.encode(Buffer.from(search)),
                  },
                },
              ],
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
    perPage: number,
    search: string,
    reload: boolean = false
  ): Promise<Movie[] | null> {
    if (this.accounts.length === 0 || reload) {
      await this.prefetchAccounts(connection, search);
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

    console.log(accounts, "getMultipleAccounts");

    const movies = accounts.reduce((accum: Movie[], account) => {
      const movie = Movie.deserialize(account?.data);
      if (!movie) {
        return accum;
      }
      return [...accum, movie];
    }, []);

    // const movies = accounts.map((account) => {
    //   const movie = movie.deserialize(account?.data);
    //   return movie;
    // });

    return movies;
  }
}
