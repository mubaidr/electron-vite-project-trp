const { install, BrowserPlatform, Browser, resolveBuildId } = require('@puppeteer/browsers')
const { join } = require('path')

// TODO: download binaries for all build targets in relative paths

// Define the target directory for the Chromium binary
const cacheDir = join(__dirname, '..', '.electron-browsers')

// Create a function to download Chromium for all platforms
async function downloadChromium() {
  await install({
    browser: Browser.CHROMEHEADLESSSHELL,
    cacheDir,
    buildId: await resolveBuildId(Browser.CHROMEHEADLESSSHELL, BrowserPlatform.LINUX, 'latest'),
  })

  await install({
    browser: Browser.CHROMEHEADLESSSHELL,
    cacheDir,
    buildId: await resolveBuildId(Browser.CHROMEHEADLESSSHELL, BrowserPlatform.WIN64, 'latest'),
  })
}

// Run the download function
downloadChromium()
