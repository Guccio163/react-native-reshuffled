import { Cell } from 'react-native-reshuffled'

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const generateInitialItems1 = (): Cell[] => {
  return [
    {
      id: `item-0`,
      width: 1,
      height: 1,
      color: getRandomColor(),
      startColumn: 1,
      startRow: 0,
    },
    {
      id: `item-1`,
      width: 1,
      height: 1,
      color: getRandomColor(),
      startColumn: 1,
      startRow: 1,
    },
    {
      id: `item-2`,
      width: 2,
      height: 2,
      color: getRandomColor(),
      startColumn: 2,
      startRow: 1,
    },
  ]
}

const generateInitialItems2 = (): Cell[] => {
  return [
    {
      id: `item-0`,
      width: 4,
      height: 1,
      color: getRandomColor(),
      startColumn: 1,
      startRow: 0,
    },
    {
      id: `item-1`,
      width: 1,
      height: 4,
      color: getRandomColor(),
      startColumn: 1,
      startRow: 1,
    },
    {
      id: `item-2`,
      width: 2,
      height: 2,
      color: getRandomColor(),
      startColumn: 2,
      startRow: 1,
    },
    {
      id: `item-3`,
      width: 1,
      height: 1,
      color: getRandomColor(),
      startColumn: 4,
      startRow: 4,
    },
    {
      id: `item-4`,
      width: 1,
      height: 1,
      color: getRandomColor(),
      startColumn: 4,
      startRow: 3,
    },
  ]
}

const generateInitialItems3 = (): Cell[] => {
  return [
    {
      id: `item-0`,
      width: 2,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 0,
    },
    {
      id: `item-1`,
      width: 3,
      height: 1,
      color: getRandomColor(),
      startColumn: 3,
      startRow: 1,
    },
    {
      id: `item-2`,
      width: 2,
      height: 3,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 3,
    },
    {
      id: `item-3`,
      width: 1,
      height: 1,
      color: getRandomColor(),
      startColumn: 3,
      startRow: 4,
    },
    {
      id: `item-4`,
      width: 3,
      height: 3,
      color: getRandomColor(),
      startColumn: 4,
      startRow: 4,
    },
  ]
}

const generateInitialItems4 = (): Cell[] => {
  return [
    // --- Górna sekcja ---
    {
      id: `item-0`,
      width: 3,
      height: 3,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 0,
    },
    {
      id: `item-1`,
      width: 4,
      height: 2,
      color: getRandomColor(),
      startColumn: 4,
      startRow: 1,
    },
    {
      id: `item-2`,
      width: 2,
      height: 2,
      color: getRandomColor(),
      startColumn: 8,
      startRow: 0,
    },

    // --- Środkowa sekcja ---
    {
      id: `item-3`,
      width: 2,
      height: 4,
      color: getRandomColor(),
      startColumn: 3,
      startRow: 4,
    },
    {
      id: `item-4`,
      width: 3,
      height: 2,
      color: getRandomColor(),
      startColumn: 6,
      startRow: 5,
    },

    // --- Dolna sekcja ---
    {
      id: `item-5`,
      width: 2,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 8,
    },
    {
      id: `item-6`,
      width: 3,
      height: 3,
      color: getRandomColor(),
      startColumn: 7,
      startRow: 7,
    },
  ]
}

const generateInitialItems5 = (): Cell[] => {
  return [
    {
      id: `item-0`,
      width: 3,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 0,
    },
    {
      id: `item-1`,
      width: 5,
      height: 3,
      color: getRandomColor(),
      startColumn: 3,
      startRow: 0,
    },
    {
      id: `item-2`,
      width: 2,
      height: 5,
      color: getRandomColor(),
      startColumn: 8,
      startRow: 0,
    },
    {
      id: `item-3`,
      width: 10,
      height: 2,
      color: getRandomColor(),
      startColumn: 10,
      startRow: 0,
    },

    {
      id: `item-4`,
      width: 3,
      height: 3,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 2,
    },
    {
      id: `item-5`,
      width: 5,
      height: 2,
      color: getRandomColor(),
      startColumn: 3,
      startRow: 3,
    },
    {
      id: `item-6`,
      width: 10,
      height: 4,
      color: getRandomColor(),
      startColumn: 10,
      startRow: 2,
    },

    {
      id: `item-7`,
      width: 8,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 5,
    },
    {
      id: `item-8`,
      width: 2,
      height: 3,
      color: getRandomColor(),
      startColumn: 8,
      startRow: 5,
    },
    {
      id: `item-9`,
      width: 4,
      height: 4,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 7,
    },
    {
      id: `item-10`,
      width: 4,
      height: 4,
      color: getRandomColor(),
      startColumn: 4,
      startRow: 7,
    },
    {
      id: `item-11`,
      width: 2,
      height: 8,
      color: getRandomColor(),
      startColumn: 8,
      startRow: 8,
    },
    {
      id: `item-12`,
      width: 10,
      height: 10,
      color: getRandomColor(),
      startColumn: 10,
      startRow: 6,
    },

    {
      id: `item-13`,
      width: 8,
      height: 5,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 11,
    },
  ]
}

const generateInitialItems6 = (): Cell[] => {
  return [
    {
      id: `item-0`,
      width: 3,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 0,
    },
    {
      id: `item-1`,
      width: 5,
      height: 3,
      color: getRandomColor(),
      startColumn: 3,
      startRow: 0,
    },
    {
      id: `item-2`,
      width: 2,
      height: 5,
      color: getRandomColor(),
      startColumn: 8,
      startRow: 0,
    },
    {
      id: `item-3`,
      width: 10,
      height: 2,
      color: getRandomColor(),
      startColumn: 10,
      startRow: 0,
    },

    {
      id: `item-4`,
      width: 3,
      height: 3,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 2,
    },
    {
      id: `item-5`,
      width: 5,
      height: 2,
      color: getRandomColor(),
      startColumn: 3,
      startRow: 3,
    },
    {
      id: `item-6`,
      width: 10,
      height: 4,
      color: getRandomColor(),
      startColumn: 10,
      startRow: 2,
    },

    {
      id: `item-7`,
      width: 8,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 5,
    },
    {
      id: `item-8`,
      width: 2,
      height: 3,
      color: getRandomColor(),
      startColumn: 8,
      startRow: 5,
    },
    {
      id: `item-9`,
      width: 4,
      height: 4,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 7,
    },
    {
      id: `item-10`,
      width: 4,
      height: 4,
      color: getRandomColor(),
      startColumn: 4,
      startRow: 7,
    },
    {
      id: `item-11`,
      width: 2,
      height: 8,
      color: getRandomColor(),
      startColumn: 8,
      startRow: 8,
    },
    {
      id: `item-12`,
      width: 10,
      height: 10,
      color: getRandomColor(),
      startColumn: 10,
      startRow: 6,
    },

    {
      id: `item-13`,
      width: 8,
      height: 5,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 11,
    },
    {
      id: `item-14`,
      width: 20,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 16,
    },

    {
      id: `item-15`,
      width: 5,
      height: 2,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 18,
    },
    {
      id: `item-16`,
      width: 5,
      height: 2,
      color: getRandomColor(),
      startColumn: 5,
      startRow: 18,
    },
    {
      id: `item-17`,
      width: 5,
      height: 2,
      color: getRandomColor(),
      startColumn: 10,
      startRow: 18,
    },
    {
      id: `item-18`,
      width: 5,
      height: 2,
      color: getRandomColor(),
      startColumn: 15,
      startRow: 18,
    },
  ]
}

const generateInitialItems7 = (): Cell[] => {
  return [
    {
      id: `item-0`,
      width: 2,
      height: 1,
      color: getRandomColor(),
      startColumn: 0,
      startRow: 0,
    },
    {
      id: `item-1`,
      width: 1,
      height: 2,
      color: getRandomColor(),
      startColumn: 2,
      startRow: 0,
    },
  ]
}

const mockItemsFunctions = [
  generateInitialItems1,
  generateInitialItems2,
  generateInitialItems3,
  generateInitialItems4,
  generateInitialItems5,
  generateInitialItems6,
  generateInitialItems7,
  generateInitialItems4,
]
const generateInitialItems = (configurationNumber: number) =>
  mockItemsFunctions[configurationNumber]

export { generateInitialItems }
