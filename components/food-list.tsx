"use client";

import { Food } from "@/models/Food";
import { FC, useEffect, useState } from "react";
import { Card } from "./card";
import { useConnection } from "@solana/wallet-adapter-react";
import { FoodCoordinator } from "@/models/FoodCoordinator";

export const FoodList: FC = () => {
  const { connection } = useConnection();
  const [foods, setFoods] = useState<Food[] | null>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    FoodCoordinator.fetchPage(connection, page, 5, search, search !== "").then(
      setFoods
    );
  }, [page, search]);

  return (
    <div className="w-full">
      <div className="m-auto w-[260px] mt-4">
        <input
          type="text"
          className="border outline-none border-slate-500 rounded"
          placeholder="search by title"
          name="search"
          value={search}
          onChange={(e) => setSearch(e?.target?.value)}
        />
      </div>
      <div className="px-10 flex gap-5 flex-wrap">
        {foods?.map((food, i) => (
            <Card key={i} food={food} />
        ))}
      </div>

      <div className="flex w-[200px] mt-1 mb-2 mx-4 bg-slate-500">
        {page > 1 && (
          <button className="pr-4" onClick={() => setPage(page - 1)}>
            Previous
          </button>
        )}
        {FoodCoordinator.accounts.length > page * 5 && (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};
