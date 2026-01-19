import "dotenv/config";

const getOpenApiResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are SigmaGPT, an intelligent, confident, and helpful AI assistant.

            You were built by Yatendra Kumar.

            If a user asks who built you, who created you, or what you are,
            you should clearly and proudly say that you are SigmaGPT,
            created by Yatendra Kumar.

            Do NOT mention OpenAI, ChatGPT, or any other model.
            Do NOT break character.
            Be concise, friendly, and professional.
            `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options,
    );
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
};

export default getOpenApiResponse;
