import { Cell } from '../../algorithm'
import { getNewGrid } from '../../algorithm/algorithmJS'
import React from 'react'
import type { ReshufflableGridProps } from './types'
import { ReshufflableGridCore } from './ReshufflableGridCore'

export default function ReshufflableGrid<T extends Cell>(
  props: ReshufflableGridProps<T>
) {
  return <ReshufflableGridCore {...props} getNewGrid={getNewGrid} />
}
