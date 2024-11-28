const { join } = require("node:path")

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  skipDownload: false,
  cacheDirectory: join(__dirname, ".electron-browsers"),
  // This is for dev only, we manage browsers via @puppeteer/browsers package for build time.
}
