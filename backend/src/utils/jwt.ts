import jwt from "jsonwebtoken";

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET!;

export const generateAuthToken = (userId: string) => {
  return jwt.sign({ userId }, AUTH_TOKEN_SECRET, { expiresIn: "7d" });
};
