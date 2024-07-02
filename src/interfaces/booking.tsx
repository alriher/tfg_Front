import { ISpace } from "./space";
import { IUser } from "./user";

export interface IBooking {
  id: number;
  userId: IUser;
  spaceId: ISpace;
  dateStart: string;
  dateEnd: string;
  assistants: number;
  createdAt: string;
  updatedAt: string;
}
