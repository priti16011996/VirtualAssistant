import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utility/dbConfig.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", async (req, res) => {
  return res.send("Home Page");
});
app.use("/v1/api/auth", authRouter);
app.use("/v1/api/user", userRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on the port: ${PORT}`);
});
