import Header from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import { ISpace } from "../interfaces/space";

function Home() {
  return (
    <>
      <SearchBar  />
      <Header />
    </>
  );
}

export default Home;