import { Cell } from '../../algorithm'

function getOccupiedSlots(items: Cell[]) {
  const map: Record<string, string> = {}

  items.forEach((item) => {
    for (let r = 0; r < item.height; r++) {
      for (let c = 0; c < item.width; c++) {
        const key = `${item.startRow + r},${item.startColumn + c}`
        map[key] = item.id
      }
    }
  })
  return map
}

export { getOccupiedSlots }
