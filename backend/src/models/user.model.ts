import bcrypt from "bcryptjs";
import mongoose, { Schema, Model } from "mongoose";
import { AuthProvider, IUser, UserRole } from "../utils/types/user.type";

const userSchema = new Schema<IUser>(
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
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("validate", async function (next: any) {
  try {
    const provider = this.provider;
    if (!provider) {
      return next(new Error("Auth provider is required"));
    }

    if (provider === AuthProvider.EMAIL) {
      if (!this.email || !this.password) {
        return next(new Error("Email and password are required."));
      }
    }

    if (provider === AuthProvider.PHONE) {
      if (!this.phone || !this.password) {
        return next(new Error("Phone number and password is required."));
      }
    }

    if (provider === AuthProvider.GOOGLE) {
      if (!this.googleId) {
        return next(new Error("Google ID is required."));
      }
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

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

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
