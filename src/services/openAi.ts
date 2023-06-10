import { Configuration, OpenAIApi } from 'openai'

const openAiSettings = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openAi = new OpenAIApi(openAiSettings)

export { openAi }