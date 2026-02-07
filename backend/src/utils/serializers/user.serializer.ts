import { IUser } from "../types/user.type";

export const serializeUser = (user: IUser) => {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    provider: user.provider,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};
