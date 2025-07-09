import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { ISpace } from "../interfaces/space";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import 'moment/locale/es'; // Asegúrate de importar el locale español

export default function SpaceCard({ space, showButtons, onEdit, onCancel, onShowBookings, showBookingsButton, booking, adminView }: {
  space: ISpace,
  showButtons?: boolean,
  onEdit?: () => void,
  onCancel?: () => void,
  onShowBookings?: () => void,
  showBookingsButton?: boolean,
  booking?: { dateStart: string, dateEnd: string, assistants?: number, username?: string },
  adminView?: boolean
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
        <p className="text-default-500 text-sm">{space.localidad}, {space.provincia}</p>
        {/* Mostrar el creador si viene la prop adminView y space.user existe */}
        {adminView && space.user && (
          <p className="text-xs text-default-600 mt-1">
            Creado por: <b>{typeof space.user === 'string' ? space.user : space.user.username}</b>
          </p>
        )}
        {showButtons && booking && (
          <>
            <p className="text-xs text-default-600 mt-1">
              {(() => {
                const start = moment(booking.dateStart);
                const end = moment(booking.dateEnd);
                const day = start.day();
                const month = start.month() + 1; // Los meses en moment.js son 0-indexed
                const year = start.year();
                const startHour = start.hours().toString().padStart(2, '0');
                const startMin = start.minutes().toString().padStart(2, '0');
                const endHour = end.hours().toString().padStart(2, '0');
                const endMin = end.minutes().toString().padStart(2, '0');
                return `${day}/${month}/${year}, ${startHour}:${startMin}-${endHour}:${endMin}`;
              })()}
            </p>
            <p className="text-xs text-default-600 mt-1">
              {space.isSlotBased ? 'Asistentes' : 'Espacios'} reservados: {booking.assistants}
            </p>
            {booking.username && (
              <p className="text-xs text-default-600 mt-1">
                Reservado por: <b>{booking.username}</b>
              </p>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
