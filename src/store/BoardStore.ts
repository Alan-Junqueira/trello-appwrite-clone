import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn'
import { create } from 'zustand'

interface IBoardState {
  board: Board
}

interface IBoardActions {
  getBoard: () => void
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
    }
  }
}))