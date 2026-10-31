import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
  try {
    const token = await jwt.sign(userId, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(`failed to generate token due to error:${error}`);
    return res.status(500).json({ message: "Failed to generate token" });
  }
};
