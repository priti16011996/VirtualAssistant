import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/CurrentUser", isAuthenticated, getCurrentUser);

export default userRouter;
