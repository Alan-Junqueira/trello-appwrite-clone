import { openAi } from "@/services/openAi";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // * todos in the body of of POST req 
  const { todos } = await request.json()

  // Communicate with openAI GPT
  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: "When responding, welcome the user always as Mr.Alan and say welcome to Todo App! Limit the response to 200 characters."
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! He's the data ${JSON.stringify(todos)}`
      }
    ]
  })

  const { data } = response

  return NextResponse.json(data.choices[0].message)
}