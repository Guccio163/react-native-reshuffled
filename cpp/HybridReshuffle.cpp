#include "HybridReshuffle.hpp"
#include <cmath>
#include <algorithm>
#include <iterator>

namespace margelo::nitro::reshuffle {

    // --- Helpery ---

    void HybridReshuffle::toggleCells(
        std::vector<std::vector<bool>>& grid,
        const Cell& cell,
        int r,
        int c,
        bool occupied, // true = ustaw false (zajęte), false = ustaw true (wolne)
        int maxRows, // Argument
        int maxCols
    ) {
        // W twoim kodzie: true = wolne, false = zajęte.
        // Więc jeśli chcemy zająć (occupied=true), wpisujemy false.
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
        int maxRows, // Argument
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

    // --- Core Algorytmu (Optymalizacja) ---

    void HybridReshuffle::solveRecursively(
        std::vector<Cell>& currentSolution,
        std::vector<Cell>& remainingCells,
        std::vector<std::vector<bool>>& grid,
        double currentWeight,
        double& bestWeight,
        std::vector<Cell>& bestSolution,
        const std::map<std::string, Position>& originalPositions,
        int maxRows,       // Argument
        int maxCols,       // Argument
        double movePenalty
    ) {
        // 1. PRZYCINANIE (Pruning): Jeśli już teraz jest gorzej niż w najlepszym
        // znanym rozwiązaniu, nie ma sensu liczyć dalej. Wracamy.
        if (currentWeight >= bestWeight) {
            return;
        }

        // 2. Warunek końca: Jeśli nie ma więcej komórek, mamy kompletne rozwiązanie
        if (remainingCells.empty()) {
            // Skoro przeszliśmy punkt 1, to znaczy że currentWeight < bestWeight
            bestWeight = currentWeight;
            bestSolution = currentSolution; // Kopiujemy tylko raz, na końcu
            return;
        }

        // Pobieramy następną komórkę do ułożenia
        // (Bierzemy kopię ostatniej i usuwamy z wektora - efektywne w C++)
        Cell currentCell = remainingCells.back();
        remainingCells.pop_back();

        int maxRow = maxRows - static_cast<int>(currentCell.height) + 1;
        int maxCol = maxCols - static_cast<int>(currentCell.width) + 1;

        // Pobieramy starą pozycję dla obliczenia kosztu
        double origR = 0; 
        double origC = 0;
        if (originalPositions.find(currentCell.id) != originalPositions.end()) {
            origR = originalPositions.at(currentCell.id).startRow;
            origC = originalPositions.at(currentCell.id).startColumn;
        }

        // Iterujemy po możliwych pozycjach
        for (int r = 0; r < maxRow; r++) {
            for (int c = 0; c < maxCol; c++) {
                
                if (isEnoughSpaceAvailable(grid, currentCell.height, currentCell.width, r, c, maxRows, maxCols)) {
                    
                    // a) Oblicz koszt dodania tego klocka
                    double moveCost = std::abs(r - origR) + std::abs(c - origC) + movePenalty;
                    double newWeight = currentWeight + moveCost;

                    // PRZYCINANIE SZYBKIE: Sprawdź wagę ZANIM zmodyfikujesz grid
                    if (newWeight >= bestWeight) continue;

                    // b) Zmodyfikuj stan (Zajmij miejsce)
                    toggleCells(grid, currentCell, r, c, true, maxRows, maxCols);
                    
                    currentCell.startRow = static_cast<double>(r);
                    currentCell.startColumn = static_cast<double>(c);
                    currentSolution.push_back(currentCell);

                    // c) Rekurencja
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

                    // d) BACKTRACKING (Cofnij zmiany)
                    // Zdejmij miejsce na planszy
                    toggleCells(grid, currentCell, r, c, false, maxRows, maxCols);
                    // Usuń z rozwiązania
                    currentSolution.pop_back();
                }
            }
        }

        // Przywracamy komórkę do remainingCells dla poziomu wyżej (sprzątanie po sobie)
        remainingCells.push_back(currentCell);
    }


    // --- Metoda Publiczna ---

    std::vector<Cell> HybridReshuffle::getNewGrid(
        const std::vector<Cell>& cellsToBeSet,
        double pickedCellIndex,
        double targetRow,
        double targetCol,
        double rowsInput,    // Nowy arg
        double colsInput,    // Nowy arg
        double penaltyInput
    ) {
        int pIndex = static_cast<int>(pickedCellIndex);
        if (pIndex < 0 || pIndex >= cellsToBeSet.size()) return cellsToBeSet;

        // Konwersja argumentów na int dla logiki siatki
        int R = static_cast<int>(rowsInput);
        int C = static_cast<int>(colsInput);

        // 1. Przygotuj mapę oryginalnych pozycji (dla szybkiego dostępu O(1))
        std::map<std::string, Position> originalPositions;
        for (const auto& c : cellsToBeSet) {
            originalPositions[c.id] = { c.startRow, c.startColumn };
        }

        // 2. Przygotuj pusty grid
        std::vector<std::vector<bool>> grid(R, std::vector<bool>(C, true));

        // 3. Ustaw "Picked Cell" na sztywno
        Cell pickedCell = cellsToBeSet[pIndex];
        pickedCell.startRow = targetRow;
        pickedCell.startColumn = targetCol;

        // Oznacz pickedCell na gridzie
        toggleCells(grid, pickedCell, (int)targetRow, (int)targetCol, true, R, C);

        // 4. Przygotuj listę pozostałych komórek
        // Używamy wektora jako stosu, więc odwracamy kolejność, żeby brać .back()
        std::vector<Cell> remainingCells;
        remainingCells.reserve(cellsToBeSet.size());
        for (int i = cellsToBeSet.size() - 1; i >= 0; --i) {
            if (i != pIndex) remainingCells.push_back(cellsToBeSet[i]);
        }

        // 5. Zmienne stanu rekurencji
        std::vector<Cell> currentSolution;
        currentSolution.reserve(cellsToBeSet.size());
        currentSolution.push_back(pickedCell); // Picked jest już częścią rozwiązania
        
        // Oblicz wagę początkową (tylko dla PickedCell)
        double initialWeight = 0;
        if (originalPositions.count(pickedCell.id)) {
            auto old = originalPositions[pickedCell.id];
            initialWeight = std::abs(targetRow - old.startRow) + std::abs(targetCol - old.startColumn) + penaltyInput;
        }

        std::vector<Cell> bestSolution = cellsToBeSet; // Domyślnie zwracamy wejście
        double bestWeight = std::numeric_limits<double>::max(); // Na start nieskończoność

        // 6. START!
        solveRecursively(
            currentSolution,
            remainingCells,
            grid,
            initialWeight,
            bestWeight,
            bestSolution,
            originalPositions,
            R,           // Rows
            C,           // Cols
            penaltyInput
        );

        return bestSolution;
    }

} // namespace