import { Types } from "mongoose";

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

export enum UserRole {
  USER = "user",
  BUSINESS_ADMIN = "business_admin",
  SUPER_ADMIN = "super_admin",
}

export interface IUser {
  _id: Types.ObjectId;

  name: string;
  email: string;
  phone?: string;

  password?: string;
  googleId?: string;

  authProvider: AuthProvider;
  role: UserRole;

  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}
