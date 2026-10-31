import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utility/dbConfig.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  return res.send("Home Page");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on the port: ${PORT}`);
});
