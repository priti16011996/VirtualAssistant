import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const geminiResponse = async (finalPrompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Gemini API attempt: ${attempt}`);

      const response = await axios.post(
        url,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: finalPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            responseMimeType: "application/json",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      );

      const result = response.data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("");

      if (!result) {
        throw new Error("Gemini returned an empty response");
      }

      console.log("Gemini response generated successfully");

      return result;
    } catch (error) {
      const status = error.response?.status;

      console.error(
        `Gemini attempt ${attempt} failed:`,
        error.response?.data || error.message,
      );

      const temporaryError =
        !status || [429, 500, 502, 503, 504].includes(status);

      if (!temporaryError || attempt === 3) {
        throw error;
      }

      await delay(1000 * Math.pow(2, attempt - 1));
    }
  }
};
