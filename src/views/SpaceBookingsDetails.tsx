import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookingsBySpaceIdPaginated, deleteSpace } from "../services/SpaceAdminServices";
import { useAuth } from "../providers/AuthProvider";
import { Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { IBooking } from "../interfaces/booking";
import { ISpace } from "../interfaces/space";
import { getBookingsBySpaceIdAndDate } from "../services/BookingService";
// Puedes importar y usar el estilo de BookingsDetails para la UI

export default function SpaceBookingsDetails() {
  const { spaceId } = useParams();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  // Aquí puedes añadir estados para editar/cancelar reservas, igual que en BookingsDetails

  // Determina el rol
  const isAdmin = user?.isAdmin;
  const isSpaceAdmin = user?.isSpaceAdmin;

  useEffect(() => {
    if (spaceId) {
      setLoading(true);
      getBookingsBySpaceIdPaginated(Number(spaceId), page, pageSize).then((res) => {
        setBookings(res.bookings || res);
        setTotal(res.total || (res.bookings ? res.bookings.length : 0));
        setLoading(false);
      });
    }
  }, [spaceId, page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  // Aquí puedes añadir lógica condicional según el rol para mostrar/permitir acciones

  if (loading) return <div className="mt-4">Cargando reservas...</div>;

  return (
    <div className="mt-4">
      <h1 className="flex justify-center text-2xl font-bold mb-4">Reservas del espacio</h1>
      {bookings.length === 0 ? (
        <p>No hay reservas para este espacio.</p>
      ) : (
        <>
          <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {/* Aquí puedes mapear las reservas y mostrar los detalles, botones de editar/cancelar según el rol */}
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded p-2">
                <div><b>Usuario:</b> {booking.userId.username}</div>
                <div><b>Fecha inicio:</b> {booking.dateStart}</div>
                <div><b>Fecha fin:</b> {booking.dateEnd}</div>
                <div><b>Asistentes:</b> {booking.assistants}</div>
                {/* Botones de editar/cancelar según permisos */}
                {(isAdmin || isSpaceAdmin) && (
                  <div className="flex gap-2 mt-2">
                    <Button color="primary" size="sm">Editar</Button>
                    <Button color="danger" size="sm">Cancelar</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Pagination
              disableCursorAnimation
              showControls
              className="gap-2"
              initialPage={1}
              radius="full"
              total={totalPages}
              variant="light"
              page={page}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
