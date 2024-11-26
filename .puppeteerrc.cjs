// const { join } = require('node:path')

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  skipDownload: false
  // cacheDirectory: join(__dirname, '.electron-browsers'),
  // we manage browsers via @puppeteer/browsers package
}
