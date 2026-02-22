import { Dimensions } from 'react-native'

const CONFIGURATION_PAIRS = [
  { rows: 4, columns: 4 },
  { rows: 5, columns: 5 },
  { rows: 7, columns: 7 },
  // BORDERLINE, ALREADY HEAVY ON 7 X 7
  { rows: 10, columns: 10 },
  { rows: 20, columns: 20 },
  { rows: 20, columns: 20 },
  { rows: 2, columns: 3 },
  { rows: 13, columns: 13 },
  // NITROMODULES RUN ON 13 X 13 WITH COUPLE OF OBJECTS
]

// container styles
const MARGIN_LEFT = 50
const MARGIN_TOP = 250
const CONTAINER_WIDTH = Dimensions.get('window').width - MARGIN_LEFT * 2
const CONTAINER_HEIGHT = Dimensions.get('window').height - MARGIN_TOP * 2

export {
  CONFIGURATION_PAIRS,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  MARGIN_LEFT,
  MARGIN_TOP,
}
