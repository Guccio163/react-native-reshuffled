import { Cell } from '../../algorithm'
import { clamp, round } from './utils'
import React, { useEffect } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { useGridProps } from '../GridPropsContextProvider'
import { RenderItemInfo } from '../ReshufflableGrid'

type DraggableRectangleProps<ItemT extends Cell> = {
  item: ItemT
  index: number
  renderItem: (info: RenderItemInfo<ItemT>) => React.ReactElement | null
  renderShadow: (info: RenderItemInfo<ItemT>) => React.ReactElement | null
  onDragUpdate: (draggedItemId: string, finalX: number, finalY: number) => void
  updateItemsBeforeDrag: (
    id: string,
    updatedColumn: number,
    updatedRow: number
  ) => void
  occupiedSlots: SharedValue<Record<string, string>>
  isDragged: SharedValue<boolean>
}

export function DraggableRectangle<T extends Cell>({
  item,
  index,
  renderItem,
  renderShadow,
  onDragUpdate,
  updateItemsBeforeDrag,
  occupiedSlots,
  isDragged,
}: DraggableRectangleProps<T>) {
  const {
    CELL_HEIGHT,
    CELL_WIDTH,
    OLD_TRANSLATE_X_Y_DEFAULT,
    CONTAINER_WIDTH,
    CONTAINER_HEIGHT,
    gapVertical,
    gapHorizontal,
  } = useGridProps()

  const x = item.startColumn * (CELL_WIDTH + gapHorizontal)
  const y = item.startRow * (CELL_HEIGHT + gapVertical)
  const oldTranslateX = useSharedValue(OLD_TRANSLATE_X_Y_DEFAULT)
  const oldTranslateY = useSharedValue(OLD_TRANSLATE_X_Y_DEFAULT)
  const translateX = useSharedValue(x)
  const translateY = useSharedValue(y)
  const translateXrounded = useSharedValue(x)
  const translateYrounded = useSharedValue(y)

  const zIndex = useSharedValue(1)

  const isShadowVisible = useSharedValue(false)

  useEffect(() => {
    translateX.value = withTiming(x, { duration: 300 })
    translateY.value = withTiming(y, { duration: 300 })
  }, [translateX, translateY, x, y])

  // Hook reacting to cell's translateX/Yrounded changes
  useAnimatedReaction(
    () => {
      return {
        x: translateXrounded.value,
        y: translateYrounded.value,
      }
    },
    (currentValue, previousValue) => {
      if (previousValue === null) {
        return
      }

      if (
        currentValue.x !== previousValue.x ||
        currentValue.y !== previousValue.y
      ) {
        scheduleOnRN(
          onDragUpdate,
          item.id,
          translateXrounded.value,
          translateYrounded.value
        )
      }
    },
    [item.id, onDragUpdate]
  )

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // save starting position
      oldTranslateX.value = translateX.value
      oldTranslateY.value = translateY.value
      zIndex.value = 100
      isShadowVisible.value = true
      isDragged.value = true
    })
    .onUpdate((event) => {
      // update dragged item's position
      const newTranslateX = clamp(
        oldTranslateX.value + event.translationX,
        item.width * CELL_WIDTH,
        CONTAINER_WIDTH
      )
      const newTranslateY = clamp(
        oldTranslateY.value + event.translationY,
        item.height * CELL_HEIGHT,
        CONTAINER_HEIGHT
      )
      translateX.value = newTranslateX
      translateY.value = newTranslateY

      // update dragged item's shadow's position (if required)
      const newTranslateXrounded = round(
        newTranslateX,
        CELL_WIDTH + gapHorizontal
      )
      const newTranslateYrounded = round(
        newTranslateY,
        CELL_HEIGHT + gapVertical
      )
      if (newTranslateXrounded !== translateXrounded.value) {
        translateXrounded.value = newTranslateXrounded
      }
      if (newTranslateYrounded !== translateYrounded.value) {
        translateYrounded.value = newTranslateYrounded
      }
    })
    .onEnd(() => {
      isDragged.value = false
      const targetCol = Math.round(
        translateXrounded.value / (CELL_WIDTH + gapHorizontal)
      )
      const targetRow = Math.round(
        translateYrounded.value / (CELL_HEIGHT + gapVertical)
      )

      let isOverlapping = false
      for (let r = 0; r < item.height; r++) {
        for (let c = 0; c < item.width; c++) {
          const checkRow = targetRow + r
          const checkCol = targetCol + c

          const key = `${checkRow},${checkCol}`
          const occupierId = occupiedSlots.value[key]

          // If the cell is occupied by something else -> Collision
          if (occupierId && occupierId !== item.id) {
            isOverlapping = true
            break
          }
        }
        if (isOverlapping) break
      }
      if (isOverlapping) {
        isShadowVisible.value = false

        translateX.value = withTiming(oldTranslateX.value, { duration: 200 })
        translateY.value = withTiming(oldTranslateY.value, { duration: 200 })

        // updateItemsBeforeDrag is necessary, to bring back itemsBeforeDrag to items
        // if they were overwritten when dragging and dropped too early
        scheduleOnRN(
          updateItemsBeforeDrag,
          item.id,
          oldTranslateX.value / (CELL_WIDTH + gapHorizontal),
          oldTranslateY.value / (CELL_HEIGHT + gapVertical)
        )
      } else {
        translateX.value = translateXrounded.value
        translateY.value = translateYrounded.value

        isShadowVisible.value = false
        scheduleOnRN(
          updateItemsBeforeDrag,
          item.id,
          translateXrounded.value / (CELL_WIDTH + gapHorizontal),
          translateYrounded.value / (CELL_HEIGHT + gapVertical)
        )
      }
      zIndex.value = 0
    })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: item.width * (CELL_WIDTH + gapHorizontal) - gapHorizontal,
      height: item.height * (CELL_HEIGHT + gapVertical) - gapVertical,
      position: 'absolute',
      zIndex: zIndex.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }
  })
  const shadowAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: item.width * (CELL_WIDTH + gapHorizontal) - gapHorizontal,
      height: item.height * (CELL_HEIGHT + gapVertical) - gapVertical,
      opacity: isShadowVisible.value ? 1 : 0,
      position: 'absolute',
      zIndex: 0,
      transform: [
        { translateX: translateXrounded.value },
        { translateY: translateYrounded.value },
      ],
    }
  })

  if (CELL_WIDTH === 0 || CELL_HEIGHT === 0) {
    // Grid dimensions are not set yet, render nothing
    return null
  }

  return (
    <>
      <Animated.View style={shadowAnimatedStyle}>
        {renderShadow({ item, index })}
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          {renderItem({ item, index })}
        </Animated.View>
      </GestureDetector>
    </>
  )
}
