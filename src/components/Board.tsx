'use client'

import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export const Board = () => {
  const getBoard = useBoardStore(state => state.actions.getBoard)

  useEffect(() => {
    getBoard()
  }, [getBoard])

  return (
    <DragDropContext>
      <Droppable droppableId='board' direction='horizontal' type="column">
        {(provided) => (
          <div>
            {/* rendering all the columns */}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
