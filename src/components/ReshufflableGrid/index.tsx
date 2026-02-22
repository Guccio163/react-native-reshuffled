import { Cell, getNewGrid } from '../../algorithm'
import { DraggableRectangle } from '../DraggableRectangle'
import React, { useCallback, useEffect, useState } from 'react'
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSharedValue } from 'react-native-reanimated'
import { GridPropsContextProvider } from '../GridPropsContextProvider'
import { getOccupiedSlots } from './utils'

export interface RenderItemInfo<ItemT> {
  item: ItemT
  index: number
}

interface ReshufflableGridProps<ItemT extends Cell> {
  data: ItemT[]
  renderItem: (info: RenderItemInfo<ItemT>) => React.ReactElement | null
  renderShadow?: (info: RenderItemInfo<ItemT>) => React.ReactElement | null
  rows: number
  columns: number
  style: StyleProp<ViewStyle>
  gapVertical?: number
  gapHorizontal?: number
  // IMPORTANT NOTE: Changing movePenalty slows down the whole algorithm the more the bigger its value is
  // Experimental prop for now
  movePenalty?: number
}

export default function ReshufflableGrid<T extends Cell>({
  data,
  renderItem,
  renderShadow = (_info: RenderItemInfo<T>) => null,
  rows,
  columns,
  gapVertical = 0,
  gapHorizontal = 0,
  movePenalty = 0,
  style,
}: ReshufflableGridProps<T>) {
  const [items, setItems] = useState(data)
  const [itemsBeforeDrag, setItemsBeforeDrag] = useState(data)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

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
      const cellWidth = dimensions.width / columns
      const cellHeight = dimensions.height / rows
      const draggedItem = itemsBeforeDrag.filter(
        (item) => item.id === draggedItemId
      )[0]
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
        const new_i = itemsWithoutDragged.filter((item) => item.id === i.id)[0]
        return { ...i, ...new_i }
      })
      // safe fallback if dragged item was dropped before calculating the grid
      // if it was dropped on free place, it will just update with updateItemsBeforeDrag
      // if it was dropped on (in that time) taken place, it will go back to its place
      if (!isDragged.value) {
        return
      }
      setItems(itemsToSet)
    },
    [
      columns,
      dimensions.height,
      dimensions.width,
      isDragged.value,
      items,
      itemsBeforeDrag,
      movePenalty,
      rows,
    ]
  )

  const updateItemsBeforeDrag = useCallback(
    (id: string, updatedColumn: number, updatedRow: number) => {
      let draggedItem = items.filter((item) => item.id === id)[0]
      if (
        draggedItem &&
        draggedItem.startColumn === updatedColumn &&
        draggedItem.startRow === updatedRow
      ) {
        setItems(itemsBeforeDrag)
      }
      const restItems = items.filter((item) => item.id !== id)
      if (draggedItem) {
        draggedItem = {
          ...draggedItem,
          startColumn: updatedColumn,
          startRow: updatedRow,
        }
        restItems.push(draggedItem)
      }
      setItems(restItems)
      setItemsBeforeDrag(restItems)
    },
    [items, itemsBeforeDrag]
  )

  // If dimensions are not set yet, we cannot calculate cell sizes, so we render nothing until we have them. This prevents DraggableRectangles from rendering with incorrect dimensions and then jumping to the correct ones once dimensions are set.
  const dimensionsDefaulted = dimensions.width === 0 || dimensions.height === 0

  return (
    <GestureHandlerRootView
      style={[style, styles.gridContainer]}
      onLayout={onLayout}
    >
      {!dimensionsDefaulted && (
        <GridPropsContextProvider
          gridWidth={dimensions.width}
          gridHeight={dimensions.height}
          rows={rows}
          columns={columns}
          gapVertical={gapVertical}
          gapHorizontal={gapHorizontal}
          movePenalty={movePenalty}
        >
          <View>
            {items.map((item, index) => (
              <DraggableRectangle
                key={item.id}
                item={item}
                index={index}
                renderItem={renderItem}
                renderShadow={renderShadow}
                onDragUpdate={handleDragUpdate}
                updateItemsBeforeDrag={updateItemsBeforeDrag}
                occupiedSlots={occupiedSlots}
                isDragged={isDragged}
              />
            ))}
          </View>
        </GridPropsContextProvider>
      )}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    // position: 'relative' jest domyślne, co pozwala na
    // absolutne pozycjonowanie dzieci (prostokątów) wewnątrz
  },
})
