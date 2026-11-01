import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utility/token.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existEmail) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userCreated = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Generate JWT
    const token = await generateToken(userCreated._id);

    if (!token) {
      return res.status(500).json({
        message: "Failed to generate token",
      });
    }

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    console.log("User created successfully:", userCreated);
    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong during signup",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const existUser = await User.findOne({
      email: normalizedEmail,
    });

    if (!existUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // Compare password
    const matchPassword = await bcrypt.compare(password, existUser.password);

    if (!matchPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = await generateToken(existUser._id);

    if (!token) {
      return res.status(500).json({
        message: "Failed to generate token",
      });
    }

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: existUser._id,
        name: existUser.name,
        email: existUser.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Failed to login. Please try again!",
    });
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
