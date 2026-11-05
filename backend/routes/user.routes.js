import express from "express";
import { getCurrentUser, updateUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/CurrentUser", isAuthenticated, getCurrentUser);
userRouter.put(
  "/customize",
  isAuthenticated,
  upload.single("profileImage"),
  updateUser,
);

export default userRouter;
