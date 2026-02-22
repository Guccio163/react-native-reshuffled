import React, { createContext, ReactNode, useContext, useMemo } from 'react'

interface GridProps {
  gridWidth: number
  gridHeight: number
  columns: number
  rows: number
  gapVertical: number
  gapHorizontal: number
  movePenalty: number
}
interface GridContextType extends GridProps {
  CELL_WIDTH: number
  CELL_HEIGHT: number
  OLD_TRANSLATE_X_Y_DEFAULT: number
  MOVE_PENALTY: number
  CONTAINER_WIDTH: number
  CONTAINER_HEIGHT: number
}

const GridContext = createContext<GridContextType | undefined>(undefined)

interface ProviderProps extends GridProps {
  children: ReactNode
}

export const GridPropsContextProvider: React.FC<ProviderProps> = ({
  children,
  gridWidth,
  gridHeight,
  columns,
  rows,
  gapVertical,
  gapHorizontal,
  movePenalty,
}) => {
  const CONTAINER_WIDTH = gridWidth
  const CONTAINER_HEIGHT = gridHeight
  const ROWS = rows
  const COLUMNS = columns
  const CELL_WIDTH = (CONTAINER_WIDTH - gapHorizontal * (COLUMNS - 1)) / COLUMNS
  const CELL_HEIGHT = (CONTAINER_HEIGHT - gapVertical * (ROWS - 1)) / ROWS
  const OLD_TRANSLATE_X_Y_DEFAULT = 0
  const MOVE_PENALTY = movePenalty

  const value = useMemo(
    () => ({
      gridWidth,
      gridHeight,
      columns,
      rows,
      gapVertical,
      gapHorizontal,
      movePenalty,
      CELL_WIDTH,
      CELL_HEIGHT,
      OLD_TRANSLATE_X_Y_DEFAULT,
      MOVE_PENALTY,
      CONTAINER_WIDTH,
      CONTAINER_HEIGHT,
    }),
    [
      gridWidth,
      gridHeight,
      columns,
      rows,
      gapVertical,
      gapHorizontal,
      movePenalty,
      CELL_WIDTH,
      CELL_HEIGHT,
      MOVE_PENALTY,
      CONTAINER_WIDTH,
      CONTAINER_HEIGHT,
    ]
  )

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>
}

export const useGridProps = () => {
  const context = useContext(GridContext)
  if (!context) {
    throw new Error(
      'useGridProps must be used within a GridPropsContextProvider'
    )
  }
  return context
}
