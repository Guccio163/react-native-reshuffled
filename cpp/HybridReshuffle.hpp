#pragma once

#include "HybridReshuffleSpec.hpp"
#include <vector>
#include <string>
#include <map>
#include <limits> // Potrzebne do nieskończoności

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

      // Zmieniamy na void, bo modyfikujemy grid "w miejscu" (Backtracking)
      static void toggleCells(
          std::vector<std::vector<bool>>& grid,
          const Cell& cell,
          int row,
          int col,
          bool occupied, // true = zajmij, false = zwolnij
          int maxRows,    // <-- Potrzebne do sprawdzania granic
          int maxCols
      );

      static bool isEnoughSpaceAvailable(
          const std::vector<std::vector<bool>>& grid,
          double cellHeight,
          double cellWidth,
          int startRow,
          int startColumn,
          int maxRows,    // <-- Potrzebne do sprawdzania granic
          int maxCols
      );

      // Główna funkcja rekurencyjna
      void solveRecursively(
          std::vector<Cell>& currentSolution,    // Aktualnie budowane rozwiązanie
          std::vector<Cell>& remainingCells,     // Komórki do ułożenia
          std::vector<std::vector<bool>>& grid,  // Plansza (referencja!)
          double currentWeight,                  // Koszt obecnego rozwiązania
          double& bestWeight,                    // Najlepszy koszt znaleziony globalnie
          std::vector<Cell>& bestSolution,       // Najlepsze rozwiązanie globalne
          const std::map<std::string, Position>& originalPositions, // Do liczenia wagi
          int maxRows,        // <-- Przekazujemy dalej
          int maxCols,        // <-- Przekazujemy dalej
          double movePenalty
      );
  };

} // namespace