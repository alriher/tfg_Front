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
      <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
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
