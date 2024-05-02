// user.model.ts
export class User {
  _id!: string;
  fullname!: string;
  username!: string;
  email!: string;
  password?: string;
  address?: string;
  phone?: string;
  role!: string;
  profile!: string;
  verification!: boolean;
  status!: boolean;
  height?: string;
  weight?: number;
  age?: number;
  nationality?: string;
}
