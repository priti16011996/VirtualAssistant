import jwt from "jsonwebtoken";
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const validateToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!validateToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = validateToken;
  next();
};
