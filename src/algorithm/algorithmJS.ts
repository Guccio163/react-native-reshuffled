import type { Cell, GetNewGridProps, Grid, Position } from '.'

function getTrueArray2D(rows: number, columns: number): boolean[][] {
  return Array.from({ length: rows }, () => Array(columns).fill(true))
}

function isEnoughSpaceAvailable(
  grid: boolean[][],
  cellHeight: number,
  cellWidth: number,
  startRow: number,
  startColumn: number
): boolean {
  for (let r = 0; r < cellHeight; r++) {
    for (let c = 0; c < cellWidth; c++) {
      if (!grid[startRow + r]?.[startColumn + c]) return false
    }
  }
  return true
}

function markTakenCells(
  grid: boolean[][],
  cell: Cell,
  targetRow: number,
  targetColumn: number
): boolean[][] {
  const copy = grid.map((row) => [...row])
  for (let r = 0; r < cell.height; r++) {
    for (let c = 0; c < cell.width; c++) {
      copy[targetRow + r]![targetColumn + c] = false
    }
  }
  return copy
}

function getPositions(cells: Cell[]): Map<string, Position> {
  const positions = new Map<string, Position>()
  for (const cell of cells) {
    positions.set(cell.id, {
      startRow: cell.startRow,
      startColumn: cell.startColumn,
    })
  }
  return positions
}

function getGridWeight(
  oldGrid: Cell[],
  newGrid: Cell[],
  movePenalty: number
): number {
  const oldPositions = getPositions(oldGrid)
  return newGrid.reduce((weight, cell) => {
    const oldPos = oldPositions.get(cell.id)!
    return (
      weight +
      Math.abs(cell.startRow - oldPos.startRow) +
      Math.abs(cell.startColumn - oldPos.startColumn) +
      movePenalty
    )
  }, 0)
}

function getPossibleGrids(
  oldGrid: Grid,
  freeGrid: boolean[][],
  rows: number,
  columns: number
): Cell[][] {
  const [currentCell, ...remainingCells] = oldGrid.cellsToBeSet
  if (!currentCell) return [oldGrid.cellsSet]

  const possibleGrids: Cell[][] = []
  const maxRow = rows - currentCell.height + 1
  const maxCol = columns - currentCell.width + 1

  for (let r = 0; r < maxRow; r++) {
    for (let c = 0; c < maxCol; c++) {
      if (
        !isEnoughSpaceAvailable(
          freeGrid,
          currentCell.height,
          currentCell.width,
          r,
          c
        )
      )
        continue

      const newCellsSet = [
        ...oldGrid.cellsSet,
        { ...currentCell, startRow: r, startColumn: c },
      ]
      const newFreeGrid = markTakenCells(freeGrid, currentCell, r, c)

      possibleGrids.push(
        ...getPossibleGrids(
          { cellsSet: newCellsSet, cellsToBeSet: remainingCells },
          newFreeGrid,
          rows,
          columns
        )
      )
    }
  }
  return possibleGrids
}

function getNewGrid({
  oldGrid,
  pickedCellIndex,
  targetRow,
  targetCol,
  rows,
  columns,
  movePenalty,
}: GetNewGridProps): Cell[] {
  const freeGrid = getTrueArray2D(rows, columns)
  const originalPickedCell = oldGrid.cellsToBeSet[pickedCellIndex]
  if (!originalPickedCell) return oldGrid.cellsToBeSet

  const pickedCell = {
    ...originalPickedCell,
    startRow: targetRow,
    startColumn: targetCol,
  }
  const updatedFreeGrid = markTakenCells(
    freeGrid,
    pickedCell,
    targetRow,
    targetCol
  )

  const remainingCells = oldGrid.cellsToBeSet
    .filter((_, idx) => idx !== pickedCellIndex)
    .map((cell) => ({ ...cell }))
  const possibleGrids = getPossibleGrids(
    { cellsSet: [pickedCell], cellsToBeSet: remainingCells },
    updatedFreeGrid,
    rows,
    columns
  )

  if (!possibleGrids.length) return oldGrid.cellsToBeSet

  let bestGrid = possibleGrids[0]!
  let bestWeight = getGridWeight(oldGrid.cellsToBeSet, bestGrid, movePenalty)

  for (const grid of possibleGrids) {
    const weight = getGridWeight(oldGrid.cellsToBeSet, grid, movePenalty)
    if (weight < bestWeight) {
      bestWeight = weight
      bestGrid = grid
    }
  }

  return bestGrid
}

export { getNewGrid }
