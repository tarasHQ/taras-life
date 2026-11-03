import { readFileSync } from "fs"

/**
 * All constants relating to helpers or handlers
 */
export const cacheFile = "./quartz/.quartz-cache/transpiled-build.mjs"
export const fp = "./quartz/build.ts"
export const { version } = JSON.parse(readFileSync("./package.json").toString())
