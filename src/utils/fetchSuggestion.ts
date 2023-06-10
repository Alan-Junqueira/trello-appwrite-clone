import { formatTodosForAi } from "./formatTodosForAi"

export const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAi(board)

  const res = await fetch("/api/generateSummary", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ todos })
  })

  if (!res.ok) {
    return "Erro ao obter sugestão"
  }

  const GPTData = await res.json()

  if (!GPTData) {
    return "Sem dados para exibir"
  }

  const { content } = GPTData

  return content
}