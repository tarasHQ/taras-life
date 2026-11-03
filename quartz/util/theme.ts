/**
 * Build-time theme data extracted from the `quartz/styles/theme.css` text.
 *
 * The stylesheet is the single source of truth for the site palette and font
 * families: its `:root` / `:root[saved-theme="dark"]` blocks hold the colors and
 * the `--headerFont` / `--bodyFont` variables hold the family names. This module
 * parses that text back into the data shape consumed by plugins that still expect
 * the upstream `cfg.theme` contract (@quartz-community/og-image); quartz.ts imports
 * the stylesheet and injects the parsed result into the in-memory configuration at
 * startup. The data is never authored in quartz.config.yaml — edit theme.css instead.
 *
 * The module is deliberately pure: the CSS text is threaded in by the caller rather
 * than imported here, because the tsx test runner cannot load `.css` imports — a
 * stylesheet import in this file would make the parser untestable.
 */

// CSS custom properties that make up a palette; all must exist in both :root blocks.
const COLOR_VARS = [
	"light",
	"lightgray",
	"gray",
	"darkgray",
	"dark",
	"secondary",
	"tertiary",
	"highlight",
	"textHighlight",
] as const

/** One light/dark palette as consumed by og-image (subset of the CSS variables). */
export type Palette = Record<(typeof COLOR_VARS)[number], string>

/** Theme data derived from theme.css; injected into cfg.configuration.theme at startup. */
export type ThemeData = {
	typography: {
		header: string
		body: string
	}
	colors: {
		lightMode: Palette
		darkMode: Palette
	}
}

// ===

/**
 * Extracts the body of a top-level CSS block identified by its selector pattern.
 * Palette blocks contain no nested braces, so the first `{`/`}` pair after the
 * selector is the block. The pattern is whitespace-tolerant so a formatting
 * change (e.g. prettier dropping the space before `{`) can't false-alarm the
 * build; only genuinely structural edits (renamed/removed selector) throw.
 */
function extractBlock(css: string, selector: RegExp, label: string): string {
	const match = selector.exec(css)
	if (!match) {
		throw new Error(`theme.ts: selector ${label} not found in quartz/styles/theme.css`)
	}

	const open = css.indexOf("{", match.index)
	const close = css.indexOf("}", open)
	if (open === -1 || close === -1) {
		throw new Error(`theme.ts: malformed block for selector ${label} in quartz/styles/theme.css`)
	}

	return css.slice(open + 1, close)
}

/**
 * Parses `--name: value;` declarations from a CSS block body into a name→value map.
 * Values may span multiple lines (prettier-formatted font stacks), hence `[^;]+`.
 */
function parseVariables(block: string): Map<string, string> {
	const variables = new Map<string, string>()
	const declaration = /--([\w-]+):\s*([^;]+);/g
	let match: RegExpExecArray | null
	while ((match = declaration.exec(block)) !== null) {
		variables.set(match[1], match[2].trim())
	}

	return variables
}

/**
 * Pulls the first quoted family name from a font stack variable (e.g. --headerFont).
 * The first quoted family is the primary family og-image resolves font files by;
 * the fallback entries in the stack are CSS-only and never reach og-image.
 */
function parseFontFamily(variables: Map<string, string>, name: string): string {
	const stack = variables.get(name)
	const family = stack?.match(/"([^"]+)"/)?.[1]
	if (!family) {
		throw new Error(`theme.ts: variable --${name} carries no quoted font family in quartz/styles/theme.css`)
	}

	return family
}

/** Builds one Palette from a parsed :root block, failing loudly on missing colors. */
function parsePalette(variables: Map<string, string>, scheme: string): Palette {
	const missing = COLOR_VARS.filter((name) => !variables.has(name))
	if (missing.length > 0) {
		throw new Error(
			`theme.ts: ${scheme} palette is missing variables in quartz/styles/theme.css: ${missing.join(", ")}`,
		)
	}

	// The missing-variable check above establishes that every COLOR_VARS key has a
	// value, so the assertion cannot introduce a hole into the palette shape.
	return Object.fromEntries(COLOR_VARS.map((name) => [name, variables.get(name)!])) as Palette
}

// ===

/**
 * Parses theme CSS text into the plugin-facing theme data. Throws on any
 * structural drift between this parser and the stylesheet it parses.
 *
 * Fonts are read from the light block only — the dark palette defines colors.
 */
export function parseThemeData(css: string): ThemeData {
	// Comments are stripped before parsing: a commented-out palette line must
	// never be parsed as a live value (og-image would consume a color the
	// stylesheet itself ignores — the divergence this module exists to prevent).
	const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "")

	const lightVariables = parseVariables(extractBlock(withoutComments, /:root\s*\{/, '":root"'))
	const darkVariables = parseVariables(
		extractBlock(withoutComments, /:root\[saved-theme=["']dark["']\]\s*\{/, ':root[saved-theme="dark"]'),
	)

	return {
		typography: {
			header: parseFontFamily(lightVariables, "headerFont"),
			body: parseFontFamily(lightVariables, "bodyFont"),
		},
		colors: {
			lightMode: parsePalette(lightVariables, "light"),
			darkMode: parsePalette(darkVariables, "dark"),
		},
	}
}
