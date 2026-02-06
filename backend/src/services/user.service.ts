import { IUser } from "../utils/types/user.type";

export const RegisterUserService = async (payload: Partial<IUser>) => {
  const { fullName, email, phone, password, role } = payload;
};
