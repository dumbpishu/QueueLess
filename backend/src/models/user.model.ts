import bcrypt from "bcryptjs";
import mongoose, { Schema, Model } from "mongoose";
import {
  AuthProvider,
  IUser,
  UserRole,
  IUserDocument,
  IUserMethods,
} from "../utils/types/user.type";

const userSchema = new Schema<IUserDocument, IUserMethods>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 50,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
      minLength: 10,
      maxLength: 15,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      minLength: 6,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function (next: any) {
  try {
    if (!this.password || !this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  if (!this.password) return false;

  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
