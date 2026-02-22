import { ReshufflableGrid, RenderItemInfo, Cell } from 'react-native-reshuffled'
import { generateInitialItems } from '../mocks/configurations'
import {
  CONFIGURATION_PAIRS,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
} from '../mocks/sizes'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

interface CellWithExtraData extends Cell {
  extraText: string
  extraComponent: React.ReactElement
}

export default function App() {
  const config = 3
  const defaultData = generateInitialItems(config)().map((item) => {
    return {
      ...item,
      extraText: 'this is extraText to test generic types',
      extraComponent: (
        <View style={{ width: 30, height: 30, backgroundColor: 'black' }} />
      ),
    }
  })

  const renderItem = (info: RenderItemInfo<CellWithExtraData>) => {
    return (
      <View
        style={[
          {
            backgroundColor: info.item.color,
            alignItems: 'center',
            justifyContent: 'center',
          },
          styles.item,
        ]}
      >
        <Text>{info.item.id}</Text>
        <Text style={{ fontSize: 6 }}>{info.item.extraText}</Text>
        {info.item.extraComponent}
      </View>
    )
  }

  const renderShadow = (info: RenderItemInfo<CellWithExtraData>) => {
    return (
      <View
        style={[
          { backgroundColor: info.item.color, opacity: 0.4 },
          styles.item,
        ]}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ReshufflableGrid
        data={defaultData}
        renderItem={renderItem}
        renderShadow={renderShadow}
        rows={CONFIGURATION_PAIRS[config].rows}
        columns={CONFIGURATION_PAIRS[config].columns}
        style={styles.grid}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: { width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT },
  item: { flex: 1, borderRadius: 8 },
})
