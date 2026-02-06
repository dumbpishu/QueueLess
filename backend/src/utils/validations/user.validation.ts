import { z } from "zod";
import { AuthProvider, UserRole } from "../types/user.type";

const baseSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be 3 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
  avatar: z.url().optional(),
  role: z.enum(UserRole).optional(),
  provider: z.enum(AuthProvider),
});

const emailRegisterSchema = baseSchema.extend({
  provider: z.literal(AuthProvider.EMAIL),
  email: z.email().min(3).max(50).trim().toLowerCase(),
  password: z.string().min(6),
});

const phoneRegisterSchema = baseSchema.extend({
  provider: z.literal(AuthProvider.PHONE),
  phone: z.string().trim().min(10).max(15),
  password: z.string().min(6),
});
