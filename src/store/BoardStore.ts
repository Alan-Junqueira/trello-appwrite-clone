import { databases, storage } from '@/services/appwrite'
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn'
import { create } from 'zustand'

interface IBoardState {
  board: Board
  searchString: string
  newTaskInput: string
  newTaskType: TypedColumn
}

interface IBoardActions {
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void

  setSearchString: (searchString: string) => void

  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void

  setNewTaskInput: (input: string) => void
  setNewTaskType: (columnId: TypedColumn) => void
}

interface IUseBoardStore {
  state: IBoardState
  actions: IBoardActions
}

export const useBoardStore = create<IUseBoardStore>((set, get) => ({
  state: {
    board: {
      columns: new Map<TypedColumn, Column>()
    },
    searchString: '',
    newTaskInput: '',
    newTaskType: 'todo'
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
    },
    setSearchString: (searchString) => {
      set(prev => {
        return {
          ...prev,
          state: {
            ...prev.state,
            searchString
          }
        }
      })
    },
    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
      const newColumns = new Map(get().state.board.columns)

      // ? Delete todoId from newColumns
      newColumns.get(id)?.todos.splice(taskIndex, 1)

      set(prev => {
        return {
          ...prev,
          state: {
            ...prev.state,
            board: {
              ...prev.state.board,
              columns: newColumns
            }
          }
        }
      })

      if (todo.image) {
        await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
      }

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
        todo.$id
      )
    },
    setNewTaskInput: (input: string) => {
      set(prev => ({
        ...prev,
        state: {
          ...prev.state,
          newTaskInput: input
        }
      }))
    },
    setNewTaskType: (columnId: TypedColumn) => {
      set(prev => ({
        ...prev,
        state: {
          ...prev.state,
          newTaskType: columnId
        }
      }))
    }
  }
}))