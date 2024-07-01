import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { ISpace } from "../interfaces/space";
import { useNavigate } from "react-router-dom";

export default function SpaceCard({ space }: { space: ISpace }) {
  const navigate = useNavigate();
  return (
    <Card
      isPressable
      onPress={() => {
        navigate(`/spaces/${space.id}`);
      }}
      shadow="none"
    >
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="none"
          radius="lg"
          width="100%"
          fallbackSrc="https://via.placeholder.com/300x300"
          alt={space.name}
          className="w-full aspect-square object-cover"
          classNames={{
            wrapper: "bg-center bg-no-repeat bg-cover",
          }}
          src={space.img} // Usa la imagen del espacio o un placeholder
        />
      </CardBody>
      <CardFooter className="text-small px-0 flex-col items-start">
        <b>{space.name}</b>
        <p className="text-default-500 text-sm">{space.address}</p>
      </CardFooter>
    </Card>
  );
}
