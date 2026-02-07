import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

import authRoutes from "./routes/auth.route";

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;
