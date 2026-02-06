import { z } from "zod";
import { AuthProvider, UserRole } from "../types/user.type";

const fullNameSchema = z
  .string()
  .min(3, "Full name must be at least 3 characters")
  .max(50, "Full name cannot exceed 50 characters")
  .trim()
  .transform((val) =>
    val
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  );

const emailSchema = z
  .email()
  .min(3)
  .max(50)
  .transform((val) => val.toLowerCase().trim());

const phoneSchema = z
  .string()
  .min(10)
  .max(15)
  .regex(/^[0-9+]+$/, "Invalid phone number")
  .transform((val) => val.trim());

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100)
  .transform((val) => val.trim());

const providerValidation = (data: any, ctx: z.RefinementCtx) => {
  switch (data.provider) {
    case AuthProvider.EMAIL:
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required for EMAIL provider",
          path: ["email"],
        });
      }

      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required for EMAIL provider",
          path: ["password"],
        });
      }
      break;

    case AuthProvider.PHONE:
      if (!data.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone is required for PHONE provider",
          path: ["phone"],
        });
      }

      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required for PHONE provider",
          path: ["password"],
        });
      }
      break;

    case AuthProvider.GOOGLE:
      if (!data.googleId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Google ID is required",
          path: ["googleId"],
        });
      }
      break;
  }
};

export const registerValidationSchema = z
  .object({
    fullName: fullNameSchema,

    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    password: passwordSchema.optional(),

    googleId: z.string().optional(),
    avatar: z.url().optional(),

    provider: z.enum(AuthProvider),
    role: z.enum(UserRole),
  })
  .superRefine(providerValidation)
  .transform((data) => ({
    ...data,
    role: data.role ?? "USER",
  }));

export const loginValidationSchema = z
  .object({
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    password: passwordSchema.optional(),

    googleId: z.string().optional(),
    provider: z.enum(AuthProvider),
  })
  .superRefine(providerValidation)
  .transform((data) => ({
    ...data,
    email: data.email?.toLowerCase(),
  }));

export type RegisterInput = z.infer<typeof registerValidationSchema>;
export type LoginInput = z.infer<typeof loginValidationSchema>;
