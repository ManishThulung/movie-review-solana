import { FoodList } from "@/components/food-list";
import Form from "@/components/form";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Form />
      <FoodList />
    </>
  );
}
