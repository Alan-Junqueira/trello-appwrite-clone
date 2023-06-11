import { ID, databases, storage } from '@/services/appwrite'
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn'
import { uploadImage } from '@/utils/uploadImage'
import { create } from 'zustand'

interface IBoardState {
  board: Board
  searchString: string
  newTaskInput: string
  newTaskType: TypedColumn
  image: File | null
}

interface IBoardActions {
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void

  setSearchString: (searchString: string) => void

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void

  setNewTaskInput: (input: string) => void
  setNewTaskType: (columnId: TypedColumn) => void

  setImage: (image: File | null) => void
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
    newTaskType: 'todo',
    image: null
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
    },
    setImage: function (image: File | null): void {
      set(prev => ({
        ...prev,
        state: {
          ...prev.state,
          image
        }
      }))
    },
    addTask: async (todo: string, columnId: TypedColumn, image?: File | null | undefined) => {
      let file: Image | undefined

      if (image) {
        const fileUploaded = await uploadImage(image);
        if (fileUploaded) {
          file = {
            bucketId: fileUploaded.bucketId,
            fileId: fileUploaded.$id
          }
        }
      }

      const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID!,
        ID.unique(),
        {
          title: todo,
          status: columnId,
          // Include image if exists
          ...(file && { image: JSON.stringify(file) })
        }
      )

      set(prev => {
        const newColumns = new Map(prev.state.board.columns)

        const newTodo = {
          $id,
          $createdAt: new Date().toISOString(),
          title: todo,
          status: columnId,
          // include image if exists
          ...(file && { image: file })
        }

        const column = newColumns.get(columnId)

        if (!column) {
          newColumns.set(columnId, {
            id: columnId,
            todos: [newTodo]
          })
        } else {
          newColumns.get(columnId)?.todos.push(newTodo)
        }

        return ({
          ...prev,
          state: {
            ...prev.state,
            newTaskInput: "",
            board: {
              ...prev.state.board,
              columns: newColumns
            }
          }
        })
      }
      )
    }
  }
}))