"use client";
import { FC, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

const Transfer: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const transaction = new web3.Transaction();

  const [balance, setBalance] = useState<number>(0);
  const [transferAmount, setTransferAmount] = useState<string>();
  const [transferAddress, setTransferAddress] = useState<string>();

  const onClick = () => {
    if (!connection || !publicKey) {
      return;
    }
    const receiverPubKey = new web3.PublicKey(transferAddress as string);
    const balanceInLaports = Number(transferAmount) * web3.LAMPORTS_PER_SOL;

    const sendSol = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: receiverPubKey,
      lamports: balanceInLaports,
    });

    transaction.add(sendSol);

    sendTransaction(transaction, connection)
      .then((sig) => {
        console.log("fund transfer successful");
        console.log(`Signature: ${sig}`);
        setTransferAddress("");
        setTransferAmount("");
      })
      .catch((err) => console.log("fund transfer failed"));
  };

  useEffect(() => {
    const getBalance = async () => {
      const pubKey = publicKey && new web3.PublicKey(publicKey?.toBase58());
      const balance = pubKey && (await connection.getBalance(pubKey));
      balance && setBalance(balance);
    };

    getBalance();
  }, [connection, publicKey, sendTransaction]);
  return (
    <div className="flex justify-center flex-col mt-4 w-[500px] m-auto gap-8">
      {publicKey && (
        <h4 className="font-bold text-2xl">
          Your balance: {balance / web3.LAMPORTS_PER_SOL} SOL
        </h4>
      )}
      <div>
        <div className="flex justify-center gap-1 flex-col mb-4">
          <label htmlFor="transferAmount">Enter amount in SOL:</label>
          <input
            className="border outline-none border-slate-500 rounded"
            placeholder="0.0001"
            name="transferAmount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e?.target?.value)}
          />
        </div>

        <div className="flex justify-center gap-1 flex-col">
          <label htmlFor="transferAddress">Enter the address:</label>
          <input
            className="border outline-none border-slate-500 rounded"
            placeholder="HfM9kBAJB7YYbT6WTbRVJYGYHp4TxknXTkG5Diq5rH9B"
            name="transferAddress"
            value={transferAddress}
            onChange={(e) => setTransferAddress(e?.target?.value)}
          />
        </div>
      </div>
      <button
        className="bg-slate-600 text-white hover:bg-slate-700 cursor-pointer py-2 px-6 rounded"
        onClick={onClick}
      >
        Transfer
      </button>
    </div>
  );
};

export default Transfer;
