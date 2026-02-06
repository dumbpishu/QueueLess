import { Request, Response, NextFunction } from "express";

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
  } catch (error) {
    console.log("Error in register controller!");
  }
};
