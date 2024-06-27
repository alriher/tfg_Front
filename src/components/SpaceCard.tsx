import {
  Card,
  CardBody,
  Image,
  CardFooter,
} from "@nextui-org/react";
import { ISpace } from "../interfaces/space";

export default function SpaceCard({ space }: { space: ISpace }) {
  return (
    <Card shadow="sm" isPressable>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={space.name}
          className="w-full object-cover h-[140px]"
          src={space.img} // Usa la imagen del espacio o un placeholder
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b>{space.name}</b>
        <p className="text-default-500">Capacity: {space.capacity}</p>
        <p className="text-default-500">Address: {space.address}</p>
      </CardFooter>
    </Card>
  );
}
