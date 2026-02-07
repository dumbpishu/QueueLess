import { UserRepository } from "../repositories/user.repository";
import { generateAuthToken } from "../utils/jwt";
import { AuthProvider } from "../utils/types/user.type";
import { RegisterInput } from "../utils/validations/auth.validation";
import { serializeUser } from "../utils/serializers/user.serializer";
import { ApiError } from "../utils/ApiError";

export class AuthService {
  static async register(data: RegisterInput) {
    const { provider } = data;

    if (provider === AuthProvider.EMAIL) {
      const existingUser = await UserRepository.findByEmail(data.email!);

      if (existingUser) {
        throw new ApiError(409, "Email is already registered");
      }
    }

    if (provider === AuthProvider.PHONE) {
      const existingUser = await UserRepository.findByPhone(data.phone!);

      if (existingUser) {
        throw new ApiError(409, "Phone number is already registered");
      }
    }

    if (provider === AuthProvider.GOOGLE) {
      const existingUser = await UserRepository.findByGoogleId(data.googleId!);

      // if googleId already exists login user
      if (existingUser) {
        return {
          token: generateAuthToken(existingUser?._id.toString()),
          user: serializeUser(existingUser),
        };
      }
    }

    const user = await UserRepository.createUser(data);

    const token = generateAuthToken(user?._id.toString());

    return { token, user: serializeUser(user) };
  }
}
