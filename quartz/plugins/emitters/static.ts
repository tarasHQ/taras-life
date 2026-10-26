import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"

export const Static: QuartzEmitterPlugin = () => ({
	name: "Static",
	async *emit({ argv, cfg }) {
		const staticPath = joinSegments(QUARTZ, "static")
		const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
		const outputStaticPath = joinSegments(argv.output, "static")
		await fs.promises.mkdir(outputStaticPath, { recursive: true })
		for (const fp of fps) {
			const src = joinSegments(staticPath, fp) as FilePath
			// CUSTOM EDITS: Cloudflare Workers parses _headers (and _redirects) only
			// from the output root, not from served subdirectories. Emit these at
			// the root so they are parsed but never served as assets.
			const isCloudflareConfigFile = fp === "_headers" || fp === "_redirects"
			const dest = joinSegments(isCloudflareConfigFile ? argv.output : outputStaticPath, fp) as FilePath
			await fs.promises.mkdir(dirname(dest), { recursive: true })
			await fs.promises.copyFile(src, dest)
			yield dest
		}
	},
	async *partialEmit() {},
})
