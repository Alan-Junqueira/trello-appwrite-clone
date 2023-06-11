'use client'

import { useBoardStore } from "@/store/BoardStore"
import { getUrl } from "@/utils/getUrl"
import { XCircleIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useEffect, useState } from "react"
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd"

interface ITodoCard {
  todo: Todo
  index: number
  id: TypedColumn
  innerRef: (element: HTMLElement | null) => void
  draggableProps: DraggableProvidedDraggableProps
  dragHandleProps?: DraggableProvidedDragHandleProps | null
}

export const TodoCard = ({ draggableProps, id, index, innerRef, todo, dragHandleProps }: ITodoCard) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  console.log("imageUrl ==>>", imageUrl)

  const { actions: { deleteTask } } = useBoardStore()

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!)

        if (url) {
          setImageUrl(url.toString())
        }
      }

      fetchImage()
    }
  }, [todo])

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button className="text-red-500 hover:text-red-600" onClick={() => deleteTask(index, todo, id)}>
          <XCircleIcon
            className="ml-5 h-8 w-8"
          />
        </button>
      </div>

      {imageUrl && (
        <div className="relative h-full -w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  )
}
