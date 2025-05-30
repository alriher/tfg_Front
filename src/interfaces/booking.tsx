import { ISpace } from "./space";
import { IUser } from "./user";

export interface IBooking {
  id: number;
  userId: IUser;
  spaceId: ISpace;
  Space?: ISpace; // Permite compatibilidad con la respuesta del backend
  dateStart: string;
  dateEnd: string;
  assistants: number;
  createdAt: string;
  updatedAt: string;
}
