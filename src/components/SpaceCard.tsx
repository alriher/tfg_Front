import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { ISpace } from "../interfaces/space";
import { useNavigate } from "react-router-dom";

export default function SpaceCard({ space, showButtons, onEdit, onCancel, booking }: { space: ISpace, showButtons?: boolean, onEdit?: () => void, onCancel?: () => void, booking?: { dateStart: string, dateEnd: string } }) {
  const navigate = useNavigate();
  console.log("BUTTONS?", showButtons);
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
        {showButtons && (
          <div className="flex gap-2 mt-2">
            <Button color="default" className="w-full" size="sm" onClick={onEdit}>
              Editar
            </Button>
            <Button className="bg-[#db4664] text-white w-full" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        )}
      </CardBody>
      <CardFooter className="text-small px-0 flex-col items-start">
        <b>{space.name}</b>
        <p className="text-default-500 text-sm">{space.address}</p>
        {showButtons && booking && (
          <p className="text-xs text-default-600 mt-1">
            {new Date(booking.dateStart).toLocaleString()} - {new Date(booking.dateEnd).toLocaleString()}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
