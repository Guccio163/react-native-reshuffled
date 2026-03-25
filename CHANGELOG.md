# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.2.0] - 2026-03-25

### Added
- `allowCollisions` prop on `ReshufflableGrid` — when `true`, dragged items can overlap others and the grid does not auto-adjust positions.
- `getNewGrid` prop on `ReshufflableGrid` — custom callback that overrides the default best-fit reshuffling algorithm, enabling fully custom drop logic (e.g. swap on single overlap, revert on multiple overlaps).
- `onDragEnd` callback — fired after every drop with the updated item array.
- Puzzle demo in the example app showcasing both collision modes side by side.

### Fixed
- Dragged item briefly appeared beneath other items after being dropped.

### Changed
- `ReshufflableGrid` internally split into `ReshufflableGridCore` and `useReshufflableGrid` for better separation of concerns.

---

## [0.1.3] - 2026-03-09

### Fixed
- Overflow issue when items exceeded grid bounds.
- TypeScript compilation error.
- Android mock app build problems.
- Grid style inconsistencies on certain screen sizes.

### Changed
- Item width and height calculation moved to grid context to avoid prop drilling.
- Cleaned up web exports and removed unused legacy C++ implementations.
- Updated dependencies.

---

## [0.1.0] - 2026-02-22

### Added
- `gapVertical` and `gapHorizontal` props for controlling spacing between grid cells.
- Example app demonstrating basic grid usage.

---

## [0.0.8] and earlier

Early development releases establishing the core Nitro / C++ module structure, basic `Cell` type exports, and Android support.
