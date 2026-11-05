import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTemporaryError = (error) => {
  const status = error.response?.status;

  if (status) {
    return [429, 500, 502, 503, 504].includes(status);
  }

  return [
    "ECONNABORTED",
    "ETIMEDOUT",
    "ECONNRESET",
    "ENOTFOUND",
    "EAI_AGAIN",
  ].includes(error.code);
};

export const groqResponse = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Groq API key is missing");
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Groq API attempt: ${attempt}`);

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: "You are a helpful virtual assistant.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_completion_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      );

      const result = response.data.choices?.[0]?.message?.content;

      if (!result) {
        throw new Error("Groq returned an empty response");
      }

      return result;
    } catch (error) {
      console.error(
        `Groq attempt ${attempt} failed:`,
        error.response?.data || error.message,
      );

      if (!isTemporaryError(error) || attempt === 3) {
        throw error;
      }

      // Exponential backoff: 1s, then 2s
      await delay(1000 * Math.pow(2, attempt - 1));
    }
  }
};
