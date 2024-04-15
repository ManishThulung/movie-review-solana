"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import React, { FC } from "react";

const Navbar: FC = () => {
  return (
    <div className="bg-slate-800 flex justify-around items-center py-4">
      <Image
        alt="solana-logo"
        src="/solanaLogo.png"
        height={30}
        width={200}
        className="text-white"
      />
      <h3 className="text-white">Food - Review</h3>
      <WalletMultiButton />
    </div>
  );
};

export default Navbar;
