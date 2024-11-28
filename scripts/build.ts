import {
  Browser,
  BrowserPlatform,
  detectBrowserPlatform,
  install,
  resolveBuildId,
} from "@puppeteer/browsers"
import path from "path"
import fs from "fs"
import url from "url"
import { require } from "tsx/cjs/api"

const electronBuilder = require("electron-builder", import.meta.url)
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cacheDir = path.join(__dirname, "..", ".electron-browsers")

function loadBaseConfig() {
  const baseConfigPath = path.resolve(__dirname, "..", "electron-builder.json")

  try {
    return JSON.parse(fs.readFileSync(baseConfigPath, "utf8"))
  } catch (error) {
    console.error("ℹ️ Error loading electron-builder.json:", error)
    process.exit(1)
  }
}

function determinePlatforms() {
  const argPlatform = process.argv[2]
  const argPlatformList = (argPlatform ? argPlatform.split(",") : []) as (
    | "linux"
    | "mac"
    | "win"
  )[]
  const platformMap = {
    linux: BrowserPlatform.LINUX,
    mac: BrowserPlatform.MAC,
    win: BrowserPlatform.WIN64,
  }

  const platformList: BrowserPlatform[] = []

  for (const platform of argPlatformList) {
    if (platform in platformMap) {
      platformList.push(platformMap[platform])
    }
  }

  if (platformList.length > 0) {
    return platformList
  }

  const detectedPlatform = detectBrowserPlatform()

  if (detectedPlatform) {
    return [detectedPlatform]
  }

  throw new Error("ℹ️ No platform specified and no platform detected")
}

async function downloadChromeBinary(platform: BrowserPlatform) {
  await install({
    browser: Browser.CHROME,
    cacheDir: `${cacheDir}/${platform}`,
    buildId: await resolveBuildId(Browser.CHROME, platform, "stable"),
    downloadProgressCallback(downloadedBytes, totalBytes) {
      console.log(
        `📥 Downloading browser binary for platform: ${platform} (${(
          (downloadedBytes / totalBytes) *
          100
        ).toFixed(2)}%)`
      )
    },
    unpack: false,
  })
}

async function getPlatformTarget(platform: BrowserPlatform) {
  switch (platform) {
    case BrowserPlatform.LINUX:
      return electronBuilder.Platform.LINUX.createTarget()
    case BrowserPlatform.MAC:
      return electronBuilder.Platform.MAC.createTarget()
    case BrowserPlatform.WIN64:
      return electronBuilder.Platform.WINDOWS.createTarget()
  }
}

async function buildApp() {
  const baseConfig = loadBaseConfig()
  const platforms = determinePlatforms()

  console.info("⏩ Building for platforms:", platforms)

  for (const platform of platforms) {
    console.log(
      `➡️ Downloading browser binary for platform: ${platform}. This may take a while...`
    )

    await downloadChromeBinary(platform)

    console.log(`✔️ Browser binary downloaded for platform: ${platform}`)

    const enhancedConfig = {
      ...baseConfig,
      extraResources: [
        {
          from: path.join(__dirname, "..", ".electron-browsers", platform),
          to: `.electron-browsers/${platform}`,
        },
      ],
    }

    console.log(`⏱️ Building for platform: ${platform}`)

    await electronBuilder.build({
      config: enhancedConfig,
      targets: await getPlatformTarget(platform),
    })

    console.log(`✅ Build completed for platform: ${platform}`)
  }
}

buildApp()
  .then(() => {
    console.log("🎉 Build completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Error building app:", error)
    process.exit(1)
  })
