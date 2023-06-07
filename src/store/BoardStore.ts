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

const useBoardStore = create((set) => ({
  state: {
    board: null
  },
  actions: {
    getBoard: () => {

    }
  }
}))