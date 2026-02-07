import { Document } from "mongoose";

export enum AuthProvider {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  GOOGLE = "GOOGLE",
}

export enum UserRole {
  USER = "USER",
  BUSINESS_ADMIN = "BUSINESS_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IUser extends Document {
  fullName: string;
  email?: string;
  phone?: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  provider: AuthProvider;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export type IUserDocument = Document & IUser & IUserMethods;
