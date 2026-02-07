import { Request, Response } from "express";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../utils/validations/auth.validation";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export class AuthController {
  static Register = asyncHandler(async (req: Request, res: Response) => {
    const body = registerValidationSchema.parse(req.body);

    const { token, user } = await AuthService.register(body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  });

  static Login = asyncHandler(async (req: Request, res: Response) => {
    const data = loginValidationSchema.parse(req.body);

    const { token, user } = await AuthService.login(data);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User logged in successfully"));
  });
}
