import { databases } from '@/services/appwrite'
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn'
import { create } from 'zustand'

interface IBoardState {
  board: Board
}

interface IBoardActions {
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void
}

interface IUseBoardStore {
  state: IBoardState
  actions: IBoardActions
}

export const useBoardStore = create<IUseBoardStore>((set) => ({
  state: {
    board: {
      columns: new Map<TypedColumn, Column>()
    }
  },
  actions: {
    getBoard: async () => {
      const board = await getTodosGroupedByColumn()
      set(prev => {
        return {
          ...prev,
          state: {
            ...prev.state,
            board
          }
        }
      })
    },
    setBoardState: async (board) => {
      set((prev) => {
        return {
          ...prev,
          state: {
            ...prev.state,
            board
          }
        }
      })
    },
    updateTodoInDb: async (todo, columnId) => {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
        todo.$id,
        {
          title: todo.title,
          status: columnId
        }
      )
    }
  }
}))