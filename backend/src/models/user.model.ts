import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { IUser, AuthProvider, UserRole } from "../utils/types/user.type";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 5,
      maxLength: 100,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      minLength: 10,
      maxLength: 15,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.authProvider === "local";
      },
      select: false,
    },

    googleId: {
      type: String,
      required: function (this: IUser) {
        return this.authProvider === "google";
      },
    },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
      default: AuthProvider.LOCAL,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

userSchema.pre("save", async function (next: any) {
  try {
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = model<IUser>("User", userSchema);
