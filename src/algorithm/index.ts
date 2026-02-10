import { Platform } from 'react-native'
import { getNewGrid as getNewGridJS } from './algorithmJS'
import { NitroModules } from 'react-native-nitro-modules'
import type { Reshuffle } from '../specs/Reshuffle.nitro'

type Cell = {
  id: string
  color: string
  height: number
  width: number
  startRow: number
  startColumn: number
}

type Grid = { cellsSet: Cell[]; cellsToBeSet: Cell[] }

type Position = { startRow: number; startColumn: number }

export interface GetNewGridProps {
  oldGrid: Grid
  pickedCellIndex: number
  targetRow: number
  targetCol: number
  rows: number
  columns: number
  movePenalty: number
}
const HybridReshuffleObject =
  NitroModules.createHybridObject<Reshuffle>('Reshuffle')

function getNewGrid({
  oldGrid,
  pickedCellIndex,
  targetRow,
  targetCol,
  rows,
  columns,
  movePenalty,
}: GetNewGridProps): Cell[] {
  if (Platform.OS === 'web' || !HybridReshuffleObject) {
    return getNewGridJS({
      oldGrid: oldGrid,
      pickedCellIndex: pickedCellIndex,
      targetRow: targetRow,
      targetCol: targetCol,
      rows: rows,
      columns: columns,
      movePenalty: movePenalty,
    })
  }
  const result = HybridReshuffleObject.getNewGrid(
    oldGrid.cellsToBeSet,
    pickedCellIndex,
    targetRow,
    targetCol,
    rows,
    columns,
    movePenalty
  )
  return result
}

export { getNewGrid }
export type { Cell, Grid, Position }
