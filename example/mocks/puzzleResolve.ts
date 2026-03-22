import type { Cell, GetNewGridProps } from 'react-native-reshuffled'

function cellKeysFor(
  item: Cell,
  startRow: number,
  startColumn: number
): Set<string> {
  const keys = new Set<string>()
  for (let r = 0; r < item.height; r++) {
    for (let c = 0; c < item.width; c++) {
      keys.add(`${startRow + r},${startColumn + c}`)
    }
  }
  return keys
}

function isPlacementValid(
  item: Cell,
  targetRow: number,
  targetColumn: number,
  rows: number,
  columns: number
): boolean {
  return (
    targetRow >= 0 &&
    targetColumn >= 0 &&
    targetRow + item.height <= rows &&
    targetColumn + item.width <= columns
  )
}

/** Distinct ids of other items whose cells intersect the dragged footprint at (tr, tc). */
function overlappingOtherIds(
  dragged: Cell,
  tr: number,
  tc: number,
  all: Cell[]
): string[] {
  const draggedCells = cellKeysFor(dragged, tr, tc)
  const ids = new Set<string>()
  for (const o of all) {
    if (o.id === dragged.id) continue
    const otherCells = cellKeysFor(o, o.startRow, o.startColumn)
    for (const key of draggedCells) {
      if (otherCells.has(key)) {
        ids.add(o.id)
        break
      }
    }
  }
  return [...ids]
}

function applyPuzzlePlacement(
  list: Cell[],
  picked: Cell,
  targetRow: number,
  targetColumn: number,
  rows: number,
  columns: number
): Cell[] {
  if (!isPlacementValid(picked, targetRow, targetColumn, rows, columns)) {
    return [...list]
  }

  const overlap = overlappingOtherIds(picked, targetRow, targetColumn, list)
  if (overlap.length > 1) {
    return [...list]
  }
  if (overlap.length === 1) {
    const otherId = overlap[0]!
    const other = list.find((i) => i.id === otherId)
    if (!other) return [...list]
    return list.map((item) => {
      if (item.id === picked.id) {
        return { ...item, startRow: targetRow, startColumn: targetColumn }
      }
      if (item.id === other.id) {
        return {
          ...item,
          startRow: picked.startRow,
          startColumn: picked.startColumn,
        }
      }
      return item
    })
  }
  return list.map((item) =>
    item.id === picked.id
      ? { ...item, startRow: targetRow, startColumn: targetColumn }
      : item
  )
}

/** Swap with exactly one overlapping piece; revert if zero overlap is a move, >1 overlap, or out of bounds. */
export function puzzleResolveNewGrid(props: GetNewGridProps): Cell[] {
  const list = props.oldGrid.cellsToBeSet
  const picked = list[props.pickedCellIndex]
  if (!picked) return [...list]
  return applyPuzzlePlacement(
    list,
    picked,
    props.targetRow,
    props.targetCol,
    props.rows,
    props.columns
  )
}
