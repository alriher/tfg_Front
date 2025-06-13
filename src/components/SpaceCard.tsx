import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { ISpace } from "../interfaces/space";
import { useNavigate } from "react-router-dom";

export default function SpaceCard({ space, showButtons, onEdit, onCancel, onShowBookings, showBookingsButton, booking }: {
  space: ISpace,
  showButtons?: boolean,
  onEdit?: () => void,
  onCancel?: () => void,
  onShowBookings?: () => void,
  showBookingsButton?: boolean,
  booking?: { dateStart: string, dateEnd: string, assistants?: number }
}) {
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
          src={space.img}
        />
        {showButtons && (
          <>
            <div className="flex gap-2 mt-2">
              <Button color="default" className="w-full" size="sm" onClick={onEdit}>
                Editar
              </Button>
              <Button className="bg-[#db4664] text-white w-full" size="sm" onClick={onCancel}>
                Eliminar
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              {showBookingsButton && (
                <Button color="primary" className="w-full" size="sm" onClick={onShowBookings}>
                  Ver reservas
                </Button>
              )}
            </div>
          </>
        )}
      </CardBody>
      <CardFooter className="text-small px-0 flex-col items-start">
        <b>{space.name}</b>
        <p className="text-default-500 text-sm">{space.address}</p>
        {showButtons && booking && (
          <>
            <p className="text-xs text-default-600 mt-1">
              {(() => {
                const start = new Date(booking.dateStart);
                const end = new Date(booking.dateEnd);
                const day = start.getDate();
                const month = start.getMonth() + 1;
                const year = start.getFullYear();
                const startHour = start.getHours().toString().padStart(2, '0');
                const startMin = start.getMinutes().toString().padStart(2, '0');
                const endHour = end.getHours().toString().padStart(2, '0');
                const endMin = end.getMinutes().toString().padStart(2, '0');
                return `${day}/${month}/${year}, ${startHour}:${startMin}-${endHour}:${endMin}`;
              })()}
            </p>
            <p className="text-xs text-default-600 mt-1">
              {space.isSlotBased ? 'Asistentes' : 'Espacios'} reservados: {booking.assistants}
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
