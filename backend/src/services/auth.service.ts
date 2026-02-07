import { UserRepository } from "../repositories/user.repository";
import { generateAuthToken } from "../utils/jwt";
import { AuthProvider } from "../utils/types/user.type";
import {
  RegisterInput,
  LoginInput,
} from "../utils/validations/auth.validation";
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

  static async login(data: LoginInput) {
    const { email, phone, password, googleId, provider } = data;

    let user;

    if (provider === AuthProvider.EMAIL) {
      user = await UserRepository.findByEmail(email!);

      if (!user) {
        throw new ApiError(401, "User not found with this email");
      }

      if (!password) {
        throw new ApiError(400, "Password is required");
      }

      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password");
      }
    }

    if (provider === AuthProvider.PHONE) {
      user = await UserRepository.findByPhone(phone!);

      if (!user) {
        throw new ApiError(401, "User not found with this phone number");
      }

      if (!password || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid password");
      }
    }

    if (provider === AuthProvider.GOOGLE) {
      user = await UserRepository.findByGoogleId(googleId!);

      if (!user) {
        throw new ApiError(401, "User not found with this Google account");
      }
    }

    if (!user) {
      throw new ApiError(400, "Invalid login data");
    }

    const token = generateAuthToken(user._id.toString());

    return { token, user: serializeUser(user) };
  }
}
