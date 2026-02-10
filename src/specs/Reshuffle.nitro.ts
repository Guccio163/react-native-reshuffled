import type { HybridObject } from 'react-native-nitro-modules'

interface Cell {
  id: string
  color: string
  height: number
  width: number
  startRow: number
  startColumn: number
}

export interface Reshuffle extends HybridObject<{
  ios: 'c++'
  android: 'c++'
}> {
  getNewGrid(
    currentCells: Cell[],
    pickedCellIndex: number,
    targetRow: number,
    targetCol: number,
    rows: number,
    columns: number,
    penalty: number
  ): Cell[]
}
