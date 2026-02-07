import User from "../models/user.model";
import { IUser } from "../utils/types/user.type";

export class UserRepository {
  // create user
  static async createUser(data: Partial<IUser>) {
    return User.create(data);
  }

  // find by email
  static async findByEmail(email: string) {
    return User.findOne({ email }).select("+password");
  }

  // find by phone
  static async findByPhone(phone: string) {
    return User.findOne({ phone }).select("+password");
  }

  // find by google id
  static async findByGoogleId(googleId: string) {
    return User.findOne({ googleId });
  }

  // find by id
  static async findById(id: string) {
    return User.findById(id);
  }
}
