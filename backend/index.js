import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utility/dbConfig.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { geminiResponse } from "./gemini.js";
import { groqResponse } from "./groq.js";
import { createAssistantPrompt } from "./assistantPrompt.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", async (req, res) => {
  return res.send("Home Page");
});
app.use("/v1/api/auth", authRouter);
app.use("/v1/api/user", userRouter);

const isTemporaryGeminiError = (error) => {
  const status = error.response?.status;

  return !status || [429, 500, 502, 503, 504].includes(status);
};

// 1. Direct Gemini testing route
app.post("/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await geminiResponse(prompt);

    return res.status(200).json({
      success: true,
      provider: "Gemini",
      response,
    });
  } catch (error) {
    console.error("Gemini route error:", error.message);

    return res.status(502).json({
      success: false,
      provider: "Gemini",
      message: "Gemini API failed",
    });
  }
});

// 2. Direct Groq testing route
app.post("/groq", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await groqResponse(prompt);

    return res.status(200).json({
      success: true,
      provider: "Groq",
      response,
    });
  } catch (error) {
    console.error("Groq route error:", error.message);

    return res.status(502).json({
      success: false,
      provider: "Groq",
      message: "Groq API failed",
    });
  }
});

// 3. Automatic AI provider fallback route
app.post("/assistant", async (req, res) => {
  try {
    const { prompt, assistantName } = req.body;

    // Get user details from authenticated request
    const userName = req.user?.name;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (!assistantName || !userName) {
      return res.status(400).json({
        success: false,
        message: "Assistant or user information missing",
      });
    }

    // STEP 1: Generate one common prompt
    const finalPrompt = createAssistantPrompt(assistantName, userName, prompt);

    let response;
    let provider;

    // STEP 2: Try Gemini first
    try {
      console.log("Trying Gemini...");

      response = await geminiResponse(finalPrompt);

      provider = "Gemini";
    } catch (geminiError) {
      console.log("Gemini failed:", geminiError.message);

      if (!isTemporaryGeminiError(geminiError)) {
        throw geminiError;
      }

      // STEP 3: Fallback to Groq
      console.log("Switching to Groq...");

      response = await groqResponse(finalPrompt);

      provider = "Groq";
    }

    // STEP 4: Return response
    return res.status(200).json({
      success: true,
      provider,
      response,
    });
  } catch (error) {
    console.error("Assistant route error:", error);

    return res.status(502).json({
      success: false,
      message: "AI providers failed to generate response",
    });
  }
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
