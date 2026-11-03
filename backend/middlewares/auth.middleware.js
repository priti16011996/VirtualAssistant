import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.clearCookie("token");
    console.error("Error verifying token:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
