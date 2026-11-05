import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import { createAssistantPrompt } from "../assistantPrompt.js";
import { geminiResponse } from "../gemini.js";
import { groqResponse } from "../groq.js";
import moment from "moment/moment.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("Error fetching current user:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { virtualAssistantName } = req.body;
    let { virtualAssistantProfile } = req.body;

    console.log(req.body);

    // If user uploads a custom image
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      virtualAssistantProfile = uploadedImage;
    }

    console.log("Updating user with:", {
      virtualAssistantName,
      virtualAssistantProfile,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        virtualAssistantName,
        virtualAssistantProfile,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating user:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const askToAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user details from authenticated request
    const userName = user.name;
    const virtualAssistantName = user.virtualAssistantName;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (!virtualAssistantName || !userName) {
      return res.status(400).json({
        success: false,
        message: "Assistant or user information missing",
      });
    }

    // STEP 1: Generate one common prompt
    const finalPrompt = createAssistantPrompt(
      virtualAssistantName,
      userName,
      prompt,
    );

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
    const jsonMatch = response.match(/{[/s/S/]*}/);
    if (!jsonMatch) {
      return res.status(400).json({
        success: false,
        message: "Sorry, I can't understand",
      });
      const assistantResult = JSON.parse(jsonMatch[0]);
      const type = assistantResult.type;
      switch (type) {
        case "get_date":
          return res.json({
            type,
            input: assistantResult.input,
            response: `Current date is ${moment().format("YYYY-MM-DD")}`,
          });
        case "get_time":
          return res.json({
            type,
            input: assistantResult.input,
            response: `Current time is ${moment().format("hh:mm A")}`,
          });
        case "get_day":
          return res.json({
            type,
            input: assistantResult.input,
            response: `Current day is ${moment().format("dddd")}`,
          });
        case "get_month":
          return res.json({
            type,
            input: assistantResult.input,
            response: `Current month is ${moment().format("MMMM")}`,
          });
        case "google_search":
        case "youtube_search":
        case "youtube_play":
        case "calculator_open":
        case "instagram_open":
        case "facebook_open":
        case "weather_show":
          return res.json({
            type,
            input: assistantResult.input,
            response: assistantResult.response,
          });
      }
    }
    // STEP 4: Return response
    return res.status(200).json({
      success: true,
      provider,
      assistantResult,
    });
  } catch (error) {
    console.error("Assistant route error:", error);

    return res.status(502).json({
      success: false,
      message: "AI providers failed to generate response",
    });
  }
};
