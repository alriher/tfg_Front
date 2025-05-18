import api from "./JwtService";

export const createBooking = async (
  userId: number,
  spaceId: number,
  dateStart: string,
  dateEnd: string
) => {
  const response = await api.post("/bookings/", {
    userId,
    spaceId,
    dateStart,
    dateEnd,
  });
  return response.data;
};

export const getBookingsBySpaceId = async (spaceId: number) => {
  const response = await api.get(`/bookings/${spaceId}`); // SpaceId o id?
  return response.data;
};

export const getBookingsBySpaceIdAndDate = async (spaceId: number, date: string) => {
  // Supón que tu backend espera la fecha como query param: /bookings/:spaceId?date=YYYY-MM-DD
  const response = await api.get(`/bookings/${spaceId}`, {
    params: { date }
  });
  return response.data;
};