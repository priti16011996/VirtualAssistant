import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.params;
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .json({ message: "User Already Exist with this email" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be greater than 6 character" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCreated = await User.create({
      name,
      password: hashedPassword,
      email,
    });
    const token = await generateToken(userCreated._id);
    if (!token) {
      console.log("failed to generate token");
      return res.status(400).json({ message: "failed to generate token" });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log(`Failed to add User due to error :${error}`);
    return res
      .status(500)
      .json({ message: "Failed to add user.Please try again." });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.params;
    let existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "User not exist" });
    }
    const matchPassword = await bcrypt.compare(password, existUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = await generateToken(existUser._id);
    if (!token) {
      console.log("failed to generate token");
      return res.status(400).json({ message: "failed to generate token" });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res
      .status(201)
      .json({ message: "Loggedin Successfully", data: existUser });
  } catch (error) {
    console.log(`Failed to login User due to error :${error}`);
    return res
      .status(500)
      .json({ message: "Failed to loggedin user.Please try again!" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`Failed to logout User due to error :${error}`);
    return res
      .status(500)
      .json({ message: "Failed to logout user.Please try again!" });
  }
};
