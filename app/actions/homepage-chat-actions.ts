"use server"

import { chatbotPrompt } from "@/lib/chatbot-context"

type Message = {
  role: "user" | "assistant"
  content: string
}

export async function getChatResponse(messages: Message[]): Promise<string> {
  try {
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined")
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "system", content: chatbotPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API request failed: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error in getChatResponse:", error)
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later or contact a human representative for assistance."
  }
}
