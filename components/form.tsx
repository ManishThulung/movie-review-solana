"use client";
import { Food } from "@/models/Food";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { FC, useState } from "react";

const FOOD_REVIEW_PROGRAM_ID = "GnSufddBLUPm63wcbdsifPPoyKges73VYtbgh1s4eJAY";

const Form: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const transaction = new web3.Transaction();

  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onClick = () => {
    const food = new Food(title, rating, description);
    handleTransactionSubmit(food);
  };

  const handleTransactionSubmit = async (food: Food) => {
    if (!connection || !publicKey) {
      return;
    }

    const buffer = food.serialize();

    // generating a key to store the data
    const [pda] = await web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer(), new TextEncoder().encode(food.title)],
      new web3.PublicKey(FOOD_REVIEW_PROGRAM_ID)
    );

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(FOOD_REVIEW_PROGRAM_ID),
    });

    transaction.add(instruction);

    try {
      const txid = await sendTransaction(transaction, connection);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (error) {
      console.log("fund transfer failed");
      alert(JSON.stringify(error));
    } finally {
      setTitle("");
      setDescription("");
      setRating(0);
    }
  };

  return (
    <div className="flex justify-center flex-col mt-4 w-[500px] m-auto gap-8">
      <div>
        <div className="flex justify-center gap-1 flex-col mb-4">
          <label htmlFor="title">Food name:</label>
          <input
            className="border outline-none border-slate-500 rounded"
            placeholder="Pizza"
            name="title"
            value={title}
            onChange={(e) => setTitle(e?.target?.value)}
          />
        </div>

        <div className="flex justify-center gap-1 flex-col mb-4">
          <label htmlFor="rating">Rating:</label>
          <input
            className="border outline-none border-slate-500 rounded"
            placeholder="HfM9kBAJB7YYbT6WTbRVJYGYHp4TxknXTkG5Diq5rH9B"
            name="rating"
            value={rating}
            onChange={(e) => setRating(Number(e?.target?.value))}
          />
        </div>

        <div className="flex justify-center gap-1 flex-col">
          <label htmlFor="description">description:</label>
          <textarea
            className="border outline-none border-slate-500 rounded"
            placeholder="It is a good movie"
            rows={6}
            name="description"
            value={description}
            onChange={(e) => setDescription(e?.target?.value)}
          />
        </div>
      </div>
      <button
        className="bg-slate-600 text-white hover:bg-slate-700 cursor-pointer py-2 px-6 rounded"
        onClick={onClick}
      >
        Submit
      </button>
    </div>
  );
};

export default Form;
