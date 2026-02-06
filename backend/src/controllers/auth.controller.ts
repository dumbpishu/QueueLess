import { Request, Response } from "express";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../utils/validations/auth.validation";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async Register(req: Request, res: Response) {
    try {
      const body = registerValidationSchema.parse(req.body);

      const { token, user } = await AuthService.register(body);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully!",
        data: {
          fullName: user.fullName,
          email: user?.email,
          phone: user?.phone,
          role: user?.role,
          provider: user?.provider,
        },
      });
    } catch (error) {
      console.log("Error in register");
    }
  }
}
