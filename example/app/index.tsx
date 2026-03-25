import { Reshuffled, RenderItemInfo, Cell } from 'react-native-reshuffled'
import {
  PuzzleConfettiRoot,
  usePuzzleConfettiBurst,
} from './PuzzleConfettiRoot'
import { generateInitialItems } from '../mocks/configurations'
import { puzzleResolveNewGrid } from '../mocks/puzzleResolve'
import {
  CONFIGURATION_PAIRS,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
} from '../mocks/sizes'
import { useMemo, useState } from 'react'
import {
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'

interface CellWithExtraData extends Cell {
  icon: string
  title: string
  color: string
}

interface PuzzlePiece extends Cell {
  targetRow: number
  targetColumn: number
}

type AppMode = 'demo' | 'puzzle'

/** Puzzle behavior preset: collisions allowed vs custom overlap-based layout while dragging. */
type PuzzleGridMode = 'grid12' | 'grid3'

const CELL_CONTENT: Record<
  string,
  { icon: string; title: string; color: string }
> = {
  'item-0': { icon: '🔋', title: 'Battery', color: '#6366f1' },
  'item-1': { icon: '🎥', title: 'Camera', color: '#ec4899' },
  'item-2': { icon: '☁️', title: 'Cloud', color: '#06b6d4' },
  'item-3': { icon: '⌛', title: 'Time', color: '#f59e0b' },
  'item-4': { icon: '🎨', title: 'Edit', color: '#8b5cf6' },
  'item-5': { icon: '📈', title: 'Analytics', color: '#10b981' },
  'item-6': { icon: '🗺️', title: 'Maps', color: '#f43f5e' },
}

const PUZZLE_BLOCK_COUNT = 3

const PUZZLE_LAYOUT = {
  grid12: { rows: 12, columns: 12, stride: 4 },
  grid3: { rows: 3, columns: 3, stride: 1 },
} as const

/**
 * Official React Native icon (PWA / docs).
 * https://github.com/facebook/react-native-website/blob/main/website/static/img/pwa/manifest-icon-512.png
 */
const REACT_NATIVE_LOGO = require('../assets/images/react-native-logo.png')

const PUZZLE_SHADOW_TINT = [
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#c084fc',
  '#818cf8',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6',
  '#4c1d95',
]

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
}

function buildScrambledPuzzle(layout: PuzzleGridMode): PuzzlePiece[] {
  const { stride } = PUZZLE_LAYOUT[layout]
  const solved: PuzzlePiece[] = []
  for (let i = 0; i < 9; i++) {
    const br = Math.floor(i / PUZZLE_BLOCK_COUNT) * stride
    const bc = (i % PUZZLE_BLOCK_COUNT) * stride
    solved.push({
      id: `pz-${i}`,
      width: stride,
      height: stride,
      color: PUZZLE_SHADOW_TINT[i] ?? '#64748b',
      targetRow: br,
      targetColumn: bc,
      startRow: br,
      startColumn: bc,
    })
  }

  const slots = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  do {
    shuffleInPlace(slots)
  } while (slots.every((s, i) => s === i))

  return solved.map((p, i) => {
    const s = slots[i]!
    return {
      ...p,
      startRow: Math.floor(s / PUZZLE_BLOCK_COUNT) * stride,
      startColumn: (s % PUZZLE_BLOCK_COUNT) * stride,
    }
  })
}

function isPuzzleSolved(items: PuzzlePiece[]): boolean {
  return items.every(
    (it) => it.startRow === it.targetRow && it.startColumn === it.targetColumn
  )
}

export default function App() {
  return (
    <PuzzleConfettiRoot>
      <AppContent />
    </PuzzleConfettiRoot>
  )
}

function AppContent() {
  const burstConfetti = usePuzzleConfettiBurst()
  const [mode, setMode] = useState<AppMode>('demo')
  const [collisionsAllowed, setCollisionsAllowed] = useState(false)
  const [puzzleGridMode, setPuzzleGridMode] = useState<PuzzleGridMode>('grid12')
  const [puzzleData, setPuzzleData] = useState<PuzzlePiece[]>(() =>
    buildScrambledPuzzle('grid12')
  )
  /** Remount grid when starting / resetting puzzle so `data` applies cleanly. */
  const [puzzleSession, setPuzzleSession] = useState(0)

  const puzzleDims = PUZZLE_LAYOUT[puzzleGridMode]

  const config = 3
  const { rows, columns } = CONFIGURATION_PAIRS[config]

  const defaultData: CellWithExtraData[] = useMemo(
    () =>
      generateInitialItems(config)().map((item) => ({
        ...item,
        ...CELL_CONTENT[item.id],
      })),
    [config]
  )

  const renderDemoItem = ({ item }: RenderItemInfo<CellWithExtraData>) => (
    <View style={[styles.itemWrapper, { backgroundColor: item.color }]}>
      <View style={styles.glassEffect} />
      <View
        style={[
          styles.itemContent,
          item.width > item.height ? styles.row : styles.column,
        ]}
      >
        <View style={styles.iconWrapper}>
          <Text style={styles.emoji}>{item.icon}</Text>
        </View>
        {item.width > 2 && (
          <View style={styles.textWrapper}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
          </View>
        )}
      </View>
    </View>
  )

  const renderDemoShadow = ({ item }: RenderItemInfo<CellWithExtraData>) => (
    <View style={styles.shadowWrapper}>
      <View style={[styles.shadowInner, { borderColor: item.color }]} />
    </View>
  )

  const renderPuzzleItem = ({ item }: RenderItemInfo<PuzzlePiece>) => {
    const onTarget =
      item.startRow === item.targetRow && item.startColumn === item.targetColumn
    const tr = item.targetRow
    const tc = item.targetColumn
    const stride = item.width
    const pieceCol = tc / stride
    const pieceRow = tr / stride
    return (
      <View style={[styles.puzzlePiece, onTarget && styles.puzzlePieceLocked]}>
        <View style={styles.puzzleImageClip}>
          <View
            style={[
              styles.puzzleImagePan,
              {
                width: `${PUZZLE_BLOCK_COUNT * 100}%`,
                height: `${PUZZLE_BLOCK_COUNT * 100}%`,
                left: `${-pieceCol * 100}%`,
                top: `${-pieceRow * 100}%`,
              },
            ]}
          >
            <Image
              source={REACT_NATIVE_LOGO}
              style={styles.puzzleImageFull}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    )
  }

  const renderPuzzleShadow = ({ item }: RenderItemInfo<PuzzlePiece>) => (
    <View style={styles.shadowWrapper}>
      <View style={[styles.shadowInner, { borderColor: item.color }]} />
    </View>
  )

  const onPuzzleDragEnd = (items: PuzzlePiece[]) => {
    if (isPuzzleSolved(items)) {
      burstConfetti(280)
      Alert.alert('Solved!', 'The React Native logo is complete.', [
        {
          text: 'New puzzle',
          onPress: () => {
            setPuzzleData(buildScrambledPuzzle(puzzleGridMode))
            setPuzzleSession((s) => s + 1)
          },
        },
        { text: 'OK', style: 'cancel' },
      ])
    }
  }

  const switchToPuzzle = () => {
    setMode('puzzle')
    setPuzzleData(buildScrambledPuzzle(puzzleGridMode))
    setPuzzleSession((s) => s + 1)
  }

  const setPuzzleLayoutMode = (next: PuzzleGridMode) => {
    if (next === puzzleGridMode) return
    setPuzzleGridMode(next)
    setPuzzleData(buildScrambledPuzzle(next))
    setPuzzleSession((s) => s + 1)
  }

  const switchToDemo = () => {
    setMode('demo')
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.brandingHeader}>
        <Text style={styles.brandTitle}>RESHUFFLABLE</Text>

        <Pressable
          style={({ pressed }) => [
            styles.modeToggle,
            pressed && styles.modeTogglePressed,
          ]}
          onPress={mode === 'demo' ? switchToPuzzle : switchToDemo}
        >
          <Text style={styles.modeToggleLabel}>
            {mode === 'demo' ? '→ Puzzles' : '← Demo mode'}
          </Text>
          <Text style={styles.modeToggleHint}>
            {mode === 'demo'
              ? 'Try solving the puzzles—they showcase the new additions.'
              : 'Back to the standard grid with collision toggle.'}
          </Text>
        </Pressable>

        {mode === 'demo' ? (
          <>
            <Text style={styles.instructionText}>
              Drag and drop the tiles to see how other elements dynamically
              adjust to the new layout in real-time.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.collisionsToggle,
                pressed && styles.collisionsTogglePressed,
              ]}
              onPress={() => setCollisionsAllowed((v) => !v)}
            >
              <Text style={styles.collisionsToggleLabel}>
                Collisions: {collisionsAllowed ? 'ON' : 'OFF'}
              </Text>
              <Text style={styles.collisionsToggleHint}>
                {collisionsAllowed
                  ? "Tiles can overlap; grid doesn't adjust"
                  : 'Grid reshuffles to avoid overlap.'}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.puzzleLayoutToggleRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.puzzleLayoutChip,
                  puzzleGridMode === 'grid12' && styles.puzzleLayoutChipActive,
                  pressed && styles.puzzleLayoutChipPressed,
                ]}
                onPress={() => setPuzzleLayoutMode('grid12')}
              >
                <Text
                  style={[
                    styles.puzzleLayoutChipLabel,
                    puzzleGridMode === 'grid12' &&
                      styles.puzzleLayoutChipLabelActive,
                  ]}
                >
                  Collisions allowed
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.puzzleLayoutChip,
                  puzzleGridMode === 'grid3' && styles.puzzleLayoutChipActive,
                  pressed && styles.puzzleLayoutChipPressed,
                ]}
                onPress={() => setPuzzleLayoutMode('grid3')}
              >
                <Text
                  style={[
                    styles.puzzleLayoutChipLabel,
                    puzzleGridMode === 'grid3' &&
                      styles.puzzleLayoutChipLabelActive,
                  ]}
                >
                  Custom algorithm
                </Text>
              </Pressable>
            </View>
            <Text style={styles.instructionText}>
              {puzzleGridMode === 'grid12'
                ? 'Tiles can overlap each other. Other tiles stay put—the grid does not reshuffle or auto-adjust when you drop.'
                : 'A custom algorithm runs while you drag: overlapping tiles are swapped in the layout.'}
            </Text>
          </>
        )}
      </View>
      <View style={styles.gridWrapper}>
        <View style={styles.gridBoard}>
          {mode === 'demo' ? (
            <Reshuffled.Grid
              key="demo"
              data={defaultData}
              renderItem={renderDemoItem}
              renderShadow={renderDemoShadow}
              allowCollisions={collisionsAllowed}
              rows={rows}
              columns={columns}
              style={styles.grid}
              gapVertical={12}
              gapHorizontal={12}
            />
          ) : (
            <Reshuffled.Grid
              key={`puzzle-${puzzleSession}-${puzzleGridMode}`}
              data={puzzleData}
              renderItem={renderPuzzleItem}
              renderShadow={renderPuzzleShadow}
              onDragEnd={onPuzzleDragEnd}
              allowCollisions={puzzleGridMode === 'grid12'}
              getNewGrid={
                puzzleGridMode === 'grid3' ? puzzleResolveNewGrid : undefined
              }
              rows={puzzleDims.rows}
              columns={puzzleDims.columns}
              style={styles.grid}
              gapVertical={10}
              gapHorizontal={10}
            />
          )}
        </View>
      </View>
      <Text style={styles.subtext}>v.0.1.1</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  brandingHeader: {
    paddingHorizontal: 30,
    paddingTop: Platform.select({ ios: 24, default: 100 }),
    alignItems: 'center',
    gap: 10,
    marginTop: Platform.select({ ios: 6, default: 20 }),
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#94a3b8',
    letterSpacing: 4,
  },
  modeToggle: {
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.45)',
    maxWidth: '92%',
  },
  modeTogglePressed: {
    opacity: 0.88,
  },
  modeToggleLabel: {
    color: '#86efac',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  modeToggleHint: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  instructionText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: '80%',
    fontWeight: '500',
  },
  puzzleLayoutToggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    maxWidth: '92%',
  },
  puzzleLayoutChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  puzzleLayoutChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.22)',
    borderColor: 'rgba(129, 140, 248, 0.65)',
  },
  puzzleLayoutChipPressed: {
    opacity: 0.88,
  },
  puzzleLayoutChipLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  puzzleLayoutChipLabelActive: {
    color: '#c7d2fe',
  },
  collisionsToggle: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.45)',
    maxWidth: '90%',
  },
  collisionsTogglePressed: {
    opacity: 0.85,
  },
  collisionsToggleLabel: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  collisionsToggleHint: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  gridWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  gridBoard: {
    width: CONTAINER_WIDTH + 30,
    height: CONTAINER_HEIGHT + 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  },
  itemWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  glassEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  itemContent: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  iconWrapper: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 22 },
  textWrapper: {
    padding: 4,
    overflow: 'hidden',
  },
  title: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  puzzlePiece: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  puzzlePieceLocked: {
    borderColor: 'rgba(52, 211, 153, 0.9)',
    borderWidth: 2,
  },
  puzzleImageClip: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 11,
  },
  puzzleImagePan: {
    position: 'absolute',
  },
  puzzleImageFull: {
    width: '100%',
    height: '100%',
  },
  shadowWrapper: {
    flex: 1,
    padding: 4,
  },
  shadowInner: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  subtext: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
})
