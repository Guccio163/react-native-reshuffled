#pragma once

#include "HybridReshuffleSpec.hpp"
#include <vector>
#include <string>
#include <map>
#include <limits>

#include "Cell.hpp"

namespace margelo::nitro::reshuffle {

  struct Position {
      double startRow;
      double startColumn;
  };

  class HybridReshuffle : public HybridReshuffleSpec {
  public:
      HybridReshuffle() : HybridObject(TAG) {}

      std::vector<Cell> getNewGrid(
          const std::vector<Cell>& cellsToBeSet,
          double pickedCellIndex,
          double targetRow,
          double targetCol,
          double rows,
          double columns,
          double penalty
      ) override;

  private:

      static void toggleCells(
          std::vector<std::vector<bool>>& grid,
          const Cell& cell,
          int row,
          int col,
          bool occupied,
          int maxRows,
          int maxCols
      );

      static bool isEnoughSpaceAvailable(
          const std::vector<std::vector<bool>>& grid,
          double cellHeight,
          double cellWidth,
          int startRow,
          int startColumn,
          int maxRows,
          int maxCols
      );

      void solveRecursively(
          std::vector<Cell>& currentSolution,
          std::vector<Cell>& remainingCells,
          std::vector<std::vector<bool>>& grid,
          double currentWeight,
          double& bestWeight,
          std::vector<Cell>& bestSolution,
          const std::map<std::string, Position>& originalPositions,
          int maxRows,
          int maxCols,
          double movePenalty
      );
  };

}