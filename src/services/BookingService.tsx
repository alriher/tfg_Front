import api from "./JwtService";

export const createBooking = async (
  userId: number,
  spaceId: number,
  dateStart: string,
  dateEnd: string,
  assistants: number
) => {
  const response = await api.post("/bookings/", {
    userId,
    spaceId,
    dateStart,
    dateEnd,
    assistants,
  });
  return response.data;
};

export const getBookingsBySpaceIdAndDate = async (spaceId: number, date: string) => {
  // Supón que tu backend espera la fecha como query param: /bookings/:spaceId?date=YYYY-MM-DD
  const response = await api.get(`/bookings/${spaceId}`, {
    params: { date }
  });
  return response.data;
};

export const getBookingsByUserId = async (userId: number) => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};

export const getBookingsByUserIdPaginated = async (userId: number, page: number, pageSize: number) => {
  const response = await api.get(`/bookings/user/${userId}`, {
    params: { page, pageSize }
  });
  return response.data;
};

export const cancelBooking = async (bookingId: number) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};

export const updateBooking = async (
  bookingId: number,
  dateStart: string,
  dateEnd: string,
  assistants: number
) => {
  const response = await api.put(`/bookings/${bookingId}`, {
    dateStart,
    dateEnd,
    assistants,
  });
  return response.data;
};