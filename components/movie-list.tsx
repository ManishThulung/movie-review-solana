"use client";

import { Movie } from "@/models/Movie";
import { FC, useEffect, useState } from "react";
import { Card } from "./card";
import { useConnection } from "@solana/wallet-adapter-react";
import { MovieCoordinator } from "@/models/MovieCoordinator";

export const MovieList: FC = () => {
  const { connection } = useConnection();
  const [movies, setMovies] = useState<Movie[] | null>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    MovieCoordinator.fetchPage(connection, page, 5, search, search !== "").then(
      setMovies
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
        {movies?.map((movie, i) => (
          <Card key={i} movie={movie} />
        ))}
      </div>

      <div className="flex w-[200px] mt-1 mb-2 mx-4 bg-slate-500">
        {page > 1 && (
          <button className="pr-4" onClick={() => setPage(page - 1)}>
            Previous
          </button>
        )}
        {MovieCoordinator.accounts.length > page * 5 && (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};
