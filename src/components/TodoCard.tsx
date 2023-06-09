'use client'

import { XCircleIcon } from "@heroicons/react/24/solid"
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
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button className="text-red-500 hover:text-red-600">
          <XCircleIcon
            className="ml-5 h-8 w-8"
          />
        </button>
      </div>

      {/* {imageUrl && (

      )} */}
    </div>
  )
}
