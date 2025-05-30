import { useEffect, useState } from "react";
import SpaceCard from "./SpaceCard";
import { ISpace } from "../interfaces/space";
import { getSpaces } from "../services/CommunitiesService";

function CommunitiesComponent() {
  const [spaces, setSpaces] = useState<ISpace[]>([]);

  useEffect(() => {
    getSpaces().then((spaces) => setSpaces(spaces));
  }, []);

  return (
    <>
      <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </>
  );
}

export default CommunitiesComponent;
