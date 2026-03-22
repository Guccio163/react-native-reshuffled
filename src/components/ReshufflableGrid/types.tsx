import { Cell } from '../../algorithm'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

interface RenderItemInfo<ItemT> {
  item: ItemT
  index: number
}

interface ReshufflableGridProps<ItemT extends Cell> {
  data: ItemT[]
  renderItem: (info: RenderItemInfo<ItemT>) => React.ReactElement | null
  renderShadow?: (info: RenderItemInfo<ItemT>) => React.ReactElement | null
  onDragEnd?: (items: ItemT[]) => void
  rows: number
  columns: number
  style: StyleProp<ViewStyle>
  gapVertical?: number
  gapHorizontal?: number
  /** When true, dropping a cell only moves that item; others are not reshuffled. Overlaps are allowed. */
  allowCollisions?: boolean
  // IMPORTANT NOTE: Changing movePenalty slows down the whole algorithm the more the bigger its value is
  // Experimental prop for now
  movePenalty?: number
}

export type { ReshufflableGridProps, RenderItemInfo }
