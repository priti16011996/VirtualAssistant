import express from "express";
import { signUp, signIn, signOut } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.get("/signout", signOut);

export default userRouter;
