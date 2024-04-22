import { MovieList } from "@/components/movie-list";
import Form from "@/components/form";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Form />
      <MovieList />
    </>
  );
}
