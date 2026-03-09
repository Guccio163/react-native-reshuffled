#include "HybridReshuffle.hpp"
#include <cmath>
#include <algorithm>
#include <iterator>

namespace margelo::nitro::reshuffle {

    void HybridReshuffle::toggleCells(
        std::vector<std::vector<bool>>& grid,
        const Cell& cell,
        int r,
        int c,
        bool occupied,
        int maxRows,
        int maxCols
    ) {
        bool valueToSet = !occupied;
        
        int h = static_cast<int>(cell.height);
        int w = static_cast<int>(cell.width);
        
        for (int i = 0; i < h; ++i) {
            for (int j = 0; j < w; ++j) {
                 if (r + i < maxRows && c + j < maxCols) {
                     grid[r + i][c + j] = valueToSet;
                 }
            }
        }
    }

    bool HybridReshuffle::isEnoughSpaceAvailable(
        const std::vector<std::vector<bool>>& grid,
        double cellHeight,
        double cellWidth,
        int startRow,
        int startColumn,
        int maxRows,
        int maxCols
    ) {
        int rLimit = static_cast<int>(cellHeight);
        int cLimit = static_cast<int>(cellWidth);

        if (startRow + rLimit > maxRows || startColumn + cLimit > maxCols) return false;

        for (int r = 0; r < rLimit; r++) {
            for (int c = 0; c < cLimit; c++) {
                if (!grid[startRow + r][startColumn + c]) return false;
            }
        }
        return true;
    }

    void HybridReshuffle::solveRecursively(
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
    ) {
        // Prune if current path can't beat best solution
        if (currentWeight >= bestWeight) {
            return;
        }

        // Base case: all cells placed
        if (remainingCells.empty()) {
            bestWeight = currentWeight;
            bestSolution = currentSolution;
            return;
        }

        Cell currentCell = remainingCells.back();
        remainingCells.pop_back();

        int maxRow = maxRows - static_cast<int>(currentCell.height) + 1;
        int maxCol = maxCols - static_cast<int>(currentCell.width) + 1;

        double origR = 0; 
        double origC = 0;
        if (originalPositions.find(currentCell.id) != originalPositions.end()) {
            origR = originalPositions.at(currentCell.id).startRow;
            origC = originalPositions.at(currentCell.id).startColumn;
        }

        for (int r = 0; r < maxRow; r++) {
            for (int c = 0; c < maxCol; c++) {
                
                if (isEnoughSpaceAvailable(grid, currentCell.height, currentCell.width, r, c, maxRows, maxCols)) {
                    
                    double moveCost = std::abs(r - origR) + std::abs(c - origC) + movePenalty;
                    double newWeight = currentWeight + moveCost;

                    if (newWeight >= bestWeight) continue;

                    toggleCells(grid, currentCell, r, c, true, maxRows, maxCols);
                    
                    currentCell.startRow = static_cast<double>(r);
                    currentCell.startColumn = static_cast<double>(c);
                    currentSolution.push_back(currentCell);

                    solveRecursively(currentSolution, 
                        remainingCells, 
                        grid, 
                        newWeight, 
                        bestWeight, 
                        bestSolution, 
                        originalPositions, 
                        maxRows,
                        maxCols,
                        movePenalty);

                    // Backtrack
                    toggleCells(grid, currentCell, r, c, false, maxRows, maxCols);
                    currentSolution.pop_back();
                }
            }
        }

        remainingCells.push_back(currentCell);
    }

    std::vector<Cell> HybridReshuffle::getNewGrid(
        const std::vector<Cell>& cellsToBeSet,
        double pickedCellIndex,
        double targetRow,
        double targetCol,
        double rowsInput,
        double colsInput,
        double penaltyInput
    ) {
        int pIndex = static_cast<int>(pickedCellIndex);
        if (pIndex < 0 || pIndex >= cellsToBeSet.size()) return cellsToBeSet;

        int R = static_cast<int>(rowsInput);
        int C = static_cast<int>(colsInput);

        std::map<std::string, Position> originalPositions;
        for (const auto& c : cellsToBeSet) {
            originalPositions[c.id] = { c.startRow, c.startColumn };
        }

        std::vector<std::vector<bool>> grid(R, std::vector<bool>(C, true));

        // Lock picked cell at target position
        Cell pickedCell = cellsToBeSet[pIndex];
        pickedCell.startRow = targetRow;
        pickedCell.startColumn = targetCol;
        toggleCells(grid, pickedCell, (int)targetRow, (int)targetCol, true, R, C);

        // Build remaining cells in reverse order for stack-like access
        std::vector<Cell> remainingCells;
        remainingCells.reserve(cellsToBeSet.size());
        for (int i = cellsToBeSet.size() - 1; i >= 0; --i) {
            if (i != pIndex) remainingCells.push_back(cellsToBeSet[i]);
        }

        std::vector<Cell> currentSolution;
        currentSolution.reserve(cellsToBeSet.size());
        currentSolution.push_back(pickedCell);
        
        // Initial weight accounts for picked cell displacement
        double initialWeight = 0;
        if (originalPositions.count(pickedCell.id)) {
            auto old = originalPositions[pickedCell.id];
            initialWeight = std::abs(targetRow - old.startRow) + std::abs(targetCol - old.startColumn) + penaltyInput;
        }

        std::vector<Cell> bestSolution = cellsToBeSet;
        double bestWeight = std::numeric_limits<double>::max();

        solveRecursively(
            currentSolution,
            remainingCells,
            grid,
            initialWeight,
            bestWeight,
            bestSolution,
            originalPositions,
            R,
            C,
            penaltyInput
        );

        return bestSolution;
    }

}