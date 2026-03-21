import type { Cell } from '../../algorithm'
import { DraggableRectangle } from '../DraggableRectangle'
import React from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GridPropsContextProvider } from '../GridPropsContextProvider'
import type { ReshufflableGridProps, RenderItemInfo } from './types'
import {
  type ReshufflableGridGetNewGrid,
  useReshufflableGrid,
} from './useReshufflableGrid'

export type ReshufflableGridCoreProps<T extends Cell> = ReshufflableGridProps<T> & {
  getNewGrid: ReshufflableGridGetNewGrid
}

export function ReshufflableGridCore<T extends Cell>(
  props: ReshufflableGridCoreProps<T>
) {
  const { getNewGrid, ...gridProps } = props
  const {
    renderItem,
    renderShadow = (_info: RenderItemInfo<T>) => null,
    style,
  } = gridProps

  const {
    items,
    dimensionsDefaulted,
    onLayout,
    gridProps: contextGridProps,
    handleDragUpdate,
    updateItemsBeforeDrag,
    occupiedSlots,
    isDragged,
  } = useReshufflableGrid(gridProps, getNewGrid)

  return (
    <GestureHandlerRootView style={style} onLayout={onLayout}>
      {!dimensionsDefaulted && (
        <GridPropsContextProvider {...contextGridProps}>
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
