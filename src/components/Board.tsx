'use client'

import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { Column } from './Column';

export const Board = () => {
  const {
    actions: { getBoard, setBoardState },
    state: { board }
  } = useBoardStore()

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    // ? Check if user dragged card outside of board
    if (!destination) return;

    // ? Handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)

      const rearrangedColumns = new Map(entries)
      setBoardState({ columns: rearrangedColumns })
    }

    // * This step is needed as the indexes are stored as numbers 0, 1, 2, etc. Instead of id's with DND' library.
    const columns = Array.from(board.columns);
    const startColumnIndex = columns[Number(source.droppableId)]
    const finishColumnIndex = columns[Number(destination.droppableId)]

    const startColumn = {
      id: startColumnIndex[0],
      todos: startColumnIndex[1].todos
    }

    const finishColumn = {
      id: finishColumnIndex[0],
      todos: finishColumnIndex[1].todos
    }

    if (!startColumn || !finishColumn) return

    if (source.index === destination.index && startColumn === finishColumn) return

    const newTodos = startColumn.todos
    const [todoMoved] = newTodos.splice(source.index, 1)

    if (startColumn.id === finishColumn.id) {
      // ? Same columns task drag
      newTodos.splice(destination.index, 0, todoMoved)
      const newColumn = {
        id: startColumn.id,
        todos: newTodos
      }

      const newColumns = new Map(board.columns)
      newColumns.set(startColumn.id, newColumn)

      setBoardState({ columns: newColumns })
    } else {
      // ? Dragging to another column
    }
  }

  useEffect(() => {
    getBoard()
  }, [getBoard])

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type="column">
        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column
                  key={id}
                  id={id}
                  todos={column.todos}
                  index={index}
                />
              ))
            }
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
