import { useEffect, useState } from "react";
import SpaceCard from "./SpaceCard";
import { IBooking } from "../interfaces/booking";
import { useAuth } from "../providers/AuthProvider";
import { getBookingsByUserId } from "../services/BookingService";

function BookingsDetails() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);

  useEffect(() => {
    if (user) {
      getBookingsByUserId(Number(user.id)).then((bookings) => {
        // El backend ya filtra solo reservas futuras y devuelve el objeto Space
        setBookings(bookings);
      });
    }
  }, [user]);

  // Handlers para los botones (puedes personalizar la lógica)
  const handleEdit = (booking: IBooking) => {
    alert(`Editar reserva ${booking.id}`);
  };
  const handleCancel = (booking: IBooking) => {
    alert(`Cancelar reserva ${booking.id}`);
  };

  return (
    <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {bookings.map((booking) => (
        <SpaceCard
          key={booking.id}
          space={booking.Space ?? booking.spaceId} // Usa Space si existe, si no usa spaceId
          booking={{ dateStart: booking.dateStart, dateEnd: booking.dateEnd }}
          showButtons={true}
          onEdit={() => handleEdit(booking)}
          onCancel={() => handleCancel(booking)}
        />
      ))}
    </div>
  );
}

export default BookingsDetails;
