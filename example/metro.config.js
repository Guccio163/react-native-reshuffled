// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

const path = require('path')
const root = path.join(__dirname, '..')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// Watch the parent library folder (src only, not node_modules)
config.watchFolders = [root]

// ONLY resolve from example's node_modules - never from parent
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
]

// Block parent's node_modules entirely
config.resolver.blockList = [
  new RegExp(`${root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/node_modules/.*`),
]

// Force peer deps to resolve from example
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (typeof name === 'string') {
        return path.join(__dirname, 'node_modules', name)
      }
      return target[name]
    },
  },
)

module.exports = config
