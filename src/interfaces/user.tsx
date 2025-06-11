export interface IUser {
  id: string;
  username: string;
  email: string;
  birthdate?: string;
  address?: string;
  phone?: string;
  name?: string;
  lastName?: string;
  password?: string;
  isAdmin?: boolean;
  isSpaceAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}