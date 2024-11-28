import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"
import prettierRecommended from "eslint-plugin-prettier/recommended"

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: [
      "node_modules",
      "dist",
      "dist-electron",
      "build",
      "out",
      "coverage",
      "public",
      "release",
      ".electron-browsers",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.worker,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  // @ts-expect-error - Missing types
  reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  // @ts-expect-error - Missing types
  reactPlugin.configs.flat["jsx-runtime"], // Add this if you are using React 17+
  prettierRecommended,
]
