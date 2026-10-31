import User from "../models/user.model";
import bcrypt from "bcryptjs";

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
    return res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log(`Failed to add User due to error :${error}`);
    return res
      .status(500)
      .json({ message: "Failed to add user.Please try again." });
  }
};
