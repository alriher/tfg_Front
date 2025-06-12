import { IBooking } from "./booking";

export interface ISpace {
  id: number;
  name: string;
  address: string;
  capacity: number;
  provincia: string;
  localidad: string;
  description?: string;
  lat: number;
  lon: number;
  img: string;
  bookings?: IBooking[];
  createdAt: string;
  updatedAt: string;
  isSlotBased: boolean;
}
