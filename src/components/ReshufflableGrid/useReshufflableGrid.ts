import type { Cell, GetNewGridProps } from '../../algorithm'
import { useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import type { ReshufflableGridProps } from './types'
import { getOccupiedSlots } from './utils'

export type ReshufflableGridGetNewGrid = (props: GetNewGridProps) => Cell[]

export function useReshufflableGrid<T extends Cell>(
  props: ReshufflableGridProps<T>,
  getNewGrid: ReshufflableGridGetNewGrid
) {
  const {
    data,
    rows,
    columns,
    gapVertical = 0,
    gapHorizontal = 0,
    movePenalty = 0,
    onDragEnd,
    allowCollisions = false,
  } = props

  const notifyDragEnd = useCallback(
    (nextItems: T[]) => {
      onDragEnd?.(nextItems)
    },
    [onDragEnd]
  )

  const [items, setItems] = useState(data)
  const [itemsBeforeDrag, setItemsBeforeDrag] = useState(data)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [zIndexTrigger, setZIndexTrigger] = useState(true)
  const triggerZIndexReevaluation = useCallback(() =>{
    setZIndexTrigger((c: boolean) => !c)
  }, [])
  const isDragged = useSharedValue<boolean>(false)
  const occupiedSlots = useSharedValue<Record<string, string>>({})

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setDimensions({ width, height })
  }

  useEffect(() => {
    occupiedSlots.value = getOccupiedSlots(items)
  }, [items, occupiedSlots])

  const handleDragUpdate = useCallback(
    (draggedItemId: string, finalX: number, finalY: number) => {
      // If the gesture ends before we compute a layout, skip (drop handler will commit).
      // Free target: updateItemsBeforeDrag applies the snapped cell.
      // Occupied target with collisions off: DraggableRectangle reverts to the start position.
      if (!isDragged.value) {
        return
      }

      if (allowCollisions) {
        return
      }

      const cellWidth = dimensions.width / columns
      const cellHeight = dimensions.height / rows
      const draggedItem = itemsBeforeDrag.find(
        (item) => item.id === draggedItemId
      )
      if (!draggedItem) {
        return
      }
      const bestNewGrid = getNewGrid({
        oldGrid: {
          cellsSet: [],
          cellsToBeSet: itemsBeforeDrag,
        },
        pickedCellIndex: itemsBeforeDrag.indexOf(draggedItem),
        targetRow: Math.round(finalY / cellHeight),
        targetCol: Math.round(finalX / cellWidth),
        rows: rows,
        columns: columns,
        movePenalty: movePenalty,
      })
      const itemsWithoutDragged = bestNewGrid.filter(
        (item) => item.id !== draggedItemId
      )
      const itemsToSet = items.map((i) => {
        const new_i = itemsWithoutDragged.find((item) => item.id === i.id)
        return { ...i, ...new_i }
      })
      setItems(itemsToSet)
    },
    [
      allowCollisions,
      columns,
      dimensions.height,
      dimensions.width,
      getNewGrid,
      isDragged.value,
      items,
      itemsBeforeDrag,
      movePenalty,
      rows,
    ]
  )

  const updateItemsBeforeDrag = useCallback(
    (id: string, targetColumn: number, targetRow: number) => {
      const draggedItem = items.find((item) => item.id === id)
      if (!draggedItem) {
        return
      }

      const withoutDragged = items.filter((item) => item.id !== id)
      const draggedItemUpdated = {
        ...draggedItem,
        startColumn: targetColumn,
        startRow: targetRow,
      }
      const nextItems = [...withoutDragged, draggedItemUpdated]

      setItems(nextItems)
      setItemsBeforeDrag(nextItems)
      notifyDragEnd(nextItems)
      triggerZIndexReevaluation()
    },
    [items, notifyDragEnd]
  )

  const dimensionsDefaulted = dimensions.width === 0 || dimensions.height === 0

  const gridProps = {
    gridWidth: dimensions.width,
    gridHeight: dimensions.height,
    rows,
    columns,
    gapVertical,
    gapHorizontal,
    movePenalty,
  }

  return {
    items,
    zIndexTrigger,
    dimensionsDefaulted,
    onLayout,
    gridProps,
    handleDragUpdate,
    updateItemsBeforeDrag,
    occupiedSlots,
    isDragged,
    allowCollisions,
  }
}
