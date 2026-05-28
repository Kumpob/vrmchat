"use client";
import { chatMessage } from "@/components/interfaces";

export const aiResponse = async (
  chatHistory: chatMessage[],
  apiEndpoint: string,
  apiKey: string,
  apiModel: string,
  apiPrompt: string,
) => {
  const endpoint = apiEndpoint;
  if (!endpoint) {
    throw new Error("API_ENDPOINT is not defined");
  }

  const apiResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: apiModel,
      messages: [{ role: "system", content: apiPrompt }, ...chatHistory],
      reasoning: { enabled: false },
    }),
  });

  const result = await apiResponse.json();
  const message = result.choices[0].message;

  return String(message.content);
};
