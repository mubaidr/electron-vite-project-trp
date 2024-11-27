/**
 * Builds the Electron application using electron-builder.
 *
 * This script reads the base configuration from electron-builder.json,
 * determines the target platform (from command-line arguments or OS),
 * adds platform-specific extra resources, and then uses electron-builder
 * to perform the build.
 */

const { build, Platform } = require('electron-builder')
const path = require('path')
const os = require('os')
const fs = require('fs')

/**
 * Loads the base configuration from electron-builder.json.
 * @returns {object} The parsed configuration object.
 */
const loadBaseConfig = () => {
  const baseConfigPath = path.resolve(__dirname, 'electron-builder.json')

  try {
    return JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'))
  } catch (error) {
    console.error('Error loading electron-builder.json:', error)
    process.exit(1)
  }
}

/**
 * Determines the target platform based on command-line arguments or OS.
 * @param {string} argPlatform - The platform specified via command-line argument.
 * @param {string} userOS - The user's operating system.
 * @returns {Platform} The electron-builder Platform object.
 */
const determinePlatform = (argPlatform, userOS) => {
  const platformMap = {
    linux: Platform.LINUX,
    darwin: Platform.MAC,
    win32: Platform.WINDOWS,
  }
  const defaultPlatform = platformMap[userOS] || Platform.LINUX

  return platformMap[argPlatform] || defaultPlatform
}

/**
 * Gets platform-specific extra resources.
 * @param {Platform} platform - The target platform.
 * @returns {Array<object>} An array of extra resource objects.
 */
const getExtraResources = (platform) => {
  const extraResourcesMap = {
    linux: [
      {
        from: path.resolve(__dirname, '.electron-browsers/linux'),
        to: '.electron-browsers',
      },
    ],
    mac: [
      {
        from: path.resolve(__dirname, '.electron-browsers/mac'),
        to: '.electron-browsers',
      },
    ],
    win: [
      {
        from: path.resolve(__dirname, '.electron-browsers/windows'),
        to: '.electron-browsers',
      },
    ],
  }

  return extraResourcesMap[platform.name.toLowerCase()] || []
}

const baseConfig = loadBaseConfig()
const argPlatform = process.argv[2]
const userOS = os.platform()
const platform = determinePlatform(argPlatform, userOS)
const extraResources = getExtraResources(platform)

const enhancedConfig = {
  ...baseConfig,
  extraResources,
}

console.log(`Building for platform: ${ platform.name }`)

build({
  targets: platform.createTarget(),
  config: enhancedConfig,
})
  .then(() => console.log('Build successful!'))
  .catch((err) => {
    console.error('Error during build:', err)
    process.exit(1)
  })
