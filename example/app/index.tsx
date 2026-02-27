import { ReshufflableGrid, RenderItemInfo, Cell } from 'react-native-reshuffled'
import { generateInitialItems } from '../mocks/configurations'
import {
  CONFIGURATION_PAIRS,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
} from '../mocks/sizes'
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'

interface CellWithExtraData extends Cell {
  icon: string
  title: string
  color: string
}

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

export default function App() {
  const config = 3
  const { rows, columns } = CONFIGURATION_PAIRS[config]

  const defaultData: CellWithExtraData[] = generateInitialItems(config)().map(
    (item) => ({
      ...item,
      ...CELL_CONTENT[item.id],
    })
  )

  const renderItem = ({ item }: RenderItemInfo<CellWithExtraData>) => (
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

  const renderShadow = ({ item }: RenderItemInfo<CellWithExtraData>) => (
    <View style={styles.shadowWrapper}>
      <View style={[styles.shadowInner, { borderColor: item.color }]} />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.brandingHeader}>
        <Text style={styles.brandTitle}>RESHUFFLABLE</Text>
        <Text style={styles.instructionText}>
          Drag and drop the tiles to see how other elements dynamically adjust
          to the new layout in real-time.
        </Text>
      </View>
      <View style={styles.gridWrapper}>
        <View style={styles.gridBoard}>
          <ReshufflableGrid
            data={defaultData}
            renderItem={renderItem}
            renderShadow={renderShadow}
            rows={rows}
            columns={columns}
            style={styles.grid}
            gapVertical={12}
            gapHorizontal={12}
          />
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
    paddingTop: 100,
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#94a3b8',
    letterSpacing: 4,
  },
  instructionText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: '80%',
    fontWeight: '500',
  },
  gridWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
