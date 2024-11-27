const { install, BrowserPlatform, Browser, resolveBuildId, getInstalledBrowsers } = require('@puppeteer/browsers')
const { join } = require('path')

// Define the target directory for the Chromium binary
const cacheDir = join(__dirname, '..', '.electron-browsers')

// Create a function to download Chromium for all platforms
async function downloadChromium() {
  await install({
    browser: Browser.CHROMEHEADLESSSHELL,
    cacheDir,
    buildId: await resolveBuildId(Browser.CHROMEHEADLESSSHELL, BrowserPlatform.WIN64, 'latest'),
  })
}

// Run the download function
downloadChromium()
