import { FC } from "react";
import { Food } from "@/models/Food";

export interface CardProps {
  food: Food;
}

export const Card: FC<CardProps> = ({ food }) => {
  return (
    <div className="m-auto mb-6 mt-8 block max-w-[280px] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white inline">
        {food?.title}
      </h5>
      <span className="mb-2 tracking-tight text-gray-900 dark:text-white">
        ({food?.rating} star)
      </span>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {food?.description}
      </p>
    </div>
  );
};
