import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import SpaceCard from "../components/SpaceCard";
import { ISpace } from "../interfaces/space";
import { getSpaces } from "../services/CommunitiesService";

function Communities() {
  const [spaces, setSpaces] = useState<ISpace[]>([]);

  useEffect(() => {
    getSpaces().then((spaces) => setSpaces(spaces));
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
