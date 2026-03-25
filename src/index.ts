import ReshufflableGrid from './components/ReshufflableGrid/index'
import { RenderItemInfo } from './components/ReshufflableGrid/types'

export const Reshuffled = {
  Grid: ReshufflableGrid,
}

export type { RenderItemInfo }
export type { Cell, GetNewGridProps } from './algorithm/index'
