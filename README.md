# **react-native-reshuffled 🔀**

High-performance, **Nitro-powered** grid layout for React Native. Unlike standard lists, react-native-reshuffled provides a dynamic coordinate-based grid where every item transition is fluidly animated across both X and Y axes.

<details>
<summary>Android Demo 🤖 </summary>
  
https://github.com/user-attachments/assets/3a8ed85b-adb2-4860-bc55-cc6fd155b214

</details>
<details>
<summary>iOS Demo 🍎 </summary>
  
https://github.com/user-attachments/assets/170737aa-ab90-4c5e-9479-25be29e8fd48

</details>


## **⚡ Powered by Nitro Modules**

This library is built on top of [**react-native-nitro-modules**](https://github.com/mrousavy/nitro), leveraging the next generation of React Native architecture:

* **Ultra-fast Serialization**: Communication between JS and Native is handled via JSI with zero overhead.  
* **Type Safety**: Fully typed modules ensure stability and a superior Developer Experience.  
* **Next-Gen Performance**: Optimized for the New Architecture (TurboModules) and high-frequency layout updates.

## **✨ Features**

* **True Grid Layout**: Break free from the linear constraints of FlatList.  
* **Smart Reordering**: Items don't just "jump" to new slots; they calculate the shortest path and animate smoothly.  
* **Fully Responsive**: Automatically recalculates positions on screen orientation or container size changes.  
* **Native Speed**: Coordinate calculations are handled via Nitro-optimized native communication.

## **📦 Installation**

First, install the main package:  
```bash
npm install react-native-reshuffled
```

### **Peer Dependencies**

Since this library utilizes modern animation and gesture engines, ensure you have the following installed in your project:  
```bash
npm install react-native-nitro-modules react-native-reanimated react-native-gesture-handler
```

**Note for iOS:** Don't forget to run cd ios && pod install to link the native Nitro modules.

## **🚀 Quick Start**
```typescript
import React, { useState } from 'react';  
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';  
import { ReshuffledGrid } from 'react-native-reshuffled';

const App = () => {  
  const [data, setData] = useState([  
    { id: '1', color: '#6200EE', title: 'A', width:1, height: 1, startColumn: 0, startRow: 0 },  
    { id: '2', color: '#03DAC6', title: 'B', width:1, height: 1, startColumn: 1, startRow: 0 },  
    { id: '3', color: '#B00020', title: 'C', width:1, height: 1, startColumn: 0, startRow: 1 },  
    { id: '4', color: '#FFDE03', title: 'D', width:2, height: 1, startColumn: 0, startRow: 2 },  
  ]);

  return (  
    <View style={styles.container}>  
      <Text style={styles.btnText}>RESHUFFLED: GRID<Text>  

      <ReshuffledGrid
        data={data}  
        columns={2}
        rows={3}
        gapVertical={12}
        gapHorizontal={12}  
        renderItem={({ item }) => (  
          <View style={[styles.card, { backgroundColor: item.color }]}>  
             <Text style={styles.cardText}>{item.title}</Text>  
          </View>  
        )}  
      />  
    </View>  
  );  
};

const styles = StyleSheet.create({  
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },  
  button: {   
    padding: 16,   
    backgroundColor: '#000',   
    marginBottom: 20,   
    alignItems: 'center',  
    borderRadius: 8   
  },  
  btnText: { color: '#fff', fontWeight: 'bold' },  
  card: {   
    flex: 1,   
    borderRadius: 12,   
    height: 150,   
    justifyContent: 'center',   
    alignItems: 'center'   
  },  
  cardText: { color: '#fff', fontSize: 24, fontWeight: 'bold' }  
});
```

## **⚙️ API Reference**

### **ReshuffledGrid Props**

| Prop | Type | Description | Default |
| :---- | :---- | :---- | :---- |
| `data` | `T[] extends Cell[]` | Array of items to be rendered. | **Required** |
| `renderItem` | `(info: {item: ItemT, index: number}) => React.ReactElement \| null` | Function returning a component for each item. | **Required** |
| `renderShadow` | `(info: {item: ItemT, index: number}) => React.ReactElement \| null` | Function returning a shadow/ghost component shown at the drop target while dragging. | `null` |
| `rows` | `number` | Number of rows in the grid. | **Required** |
| `columns` | `number` | Number of columns in the grid. | **Required** |
| `style` | `StyleProp<ViewStyle>` | Style applied to the grid container. | — |
| `gapVertical` | `number` | Vertical spacing between items in pixels. | `0` |
| `gapHorizontal` | `number` | Horizontal spacing between items in pixels. | `0` |
| `allowCollisions` | `boolean` | When `true`, items can overlap each other and the grid does not auto-adjust positions on drop. | `false` |
| `getNewGrid` | `(props: GetNewGridProps) => Cell[]` | Custom callback that overrides the default reshuffling algorithm. Receives the current grid state and drop target, returns the desired new layout. | — |
| `onDragEnd` | `(items: T[]) => void` | Called after every drop with the updated item array. | — |

## **🛠 Why not FlatList?**

Standard FlatList is essentially a one-dimensional list that only allows for arranging elements in a single direction (linear sequence). Even when using the numColumns parameter, it remains constrained to a strict flow where items simply "snap" into fixed positions.

react-native-reshuffled breaks these limitations by allowing you to define a true 2D grid where components can be placed anywhere. More importantly, it enables dynamic reordering with fluid, high-performance animations, moving elements seamlessly across the layout rather than jumping from one index to another.It utilizes **Nitro Modules** to bridge the gap between JavaScript state and native layout positions, allowing elements to slide across the screen to their new coordinates smoothly.

## **🚧 Planned additions**

- Expanded web support.

Have an idea for a useful addition? Feel free to open an issue! 😃

## **📄 License**

MIT © 2026
