import path from "node:path"
import fs from "node:fs"

// TODO: load path from {electron resources directory}/.electron-browsers/platform for build

export async function getChromiumPath() {
  const chromiumPath = path.join(
    process.resourcesPath, // Path to the `resources` folder
    "chromium", // Folder name in `extraResources`
    process.platform === "win32"
      ? "chrome.exe"
      : process.platform === "darwin"
      ? "Chromium.app/Contents/MacOS/Chromium"
      : "chrome"
  )

  if (!fs.existsSync(chromiumPath)) {
    throw new Error(`Chromium not found at ${chromiumPath}`)
  }

  return chromiumPath
}
