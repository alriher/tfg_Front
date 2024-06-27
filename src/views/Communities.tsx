import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import SpaceCard from "../components/SpaceCard";
import { ISpace } from "../interfaces/space";

const BACKEND_URL = import.meta.env.VITE_BACK_URL;

function Communities() {
  const [spaces, setSpaces] = useState<ISpace[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/spaces`)
      .then(response => response.json())
      .then(data => setSpaces(data))
      .catch(error => console.error("Error fetching spaces:", error));
  }, []);

  return (
    <>
      <SearchBar />
      <div className="px-6 max-w-[1350px] m-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </>
  );
}

export default Communities;
