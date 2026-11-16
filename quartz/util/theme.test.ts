/**
 * Tests for the theme.css parser (quartz/util/theme.ts). The parser is the
 * enforcement mechanism for the palette-SSOT invariant — these tests pin its
 * fail-loud behaviour so structural drift can never fail silently.
 */
import test, { describe } from "node:test"
import assert from "node:assert"
import { readFileSync } from "node:fs"
import { parseThemeData } from "./theme"

// Minimal theme.css stand-in carrying the full palette + font contract. The
// dark-low block exercises chrome extraction without adding an OG palette; its
// selector-bearing comment doubles as a decoy that must never reach parsed values.
const fixtureCss = `
:root {
	--light: #faf6ef;
	--bg-grad-bottom: #f0e7d7;
	--lightgray: #e8e0d4;
	--gray: #b3a898;
	--darkgray: #55483c;
	--dark: #362c22;
	--secondary: #9a6b2f;
	--tertiary: #b89a5e;
	--highlight: rgba(166, 124, 82, 0.15);
	--textHighlight: #f2c94c88;
	--headerFont:
		"Atkinson Hyperlegible Next", system-ui, sans-serif;
	--bodyFont:
		"Atkinson Hyperlegible Next", system-ui, sans-serif;
}

:root[saved-theme="dark"] {
	--light: #1a1714;
	--bg-grad-bottom: #100e0b;
	--lightgray: #3a332c;
	--gray: #7a6f62;
	--darkgray: #d8cfc2;
	--dark: #ede5d8;
	--secondary: #c89b5a;
	--tertiary: #a6895a;
	--highlight: rgba(166, 124, 82, 0.18);
	--textHighlight: #c9a22788;
}

/* OG-image contract: the build-time parser matches only ":root" and
   ':root[saved-theme="dark"]' exactly, so this block is intentionally outside
   the two-palette contract — og-image never sees it. */
:root[saved-theme="dark-low"] {
	--light: #26211c;
	--bg-grad-bottom: #1b1712;
	--lightgray: #453e36;
	--gray: #857a6c;
	--darkgray: #c9c0b4;
	--dark: #ddd4c7;
	--secondary: #c89b5a;
	--tertiary: #a6895a;
	--highlight: rgba(166, 124, 82, 0.18);
	--textHighlight: #c9a22788;
}
`

describe("parseThemeData", () => {
	test("extracts palettes and font families from well-formed theme css", () => {
		const theme = parseThemeData(fixtureCss)
		assert.equal(theme.colors.lightMode.light, "#faf6ef")
		assert.equal(theme.colors.darkMode.dark, "#ede5d8")
		assert.equal(theme.typography.header, "Atkinson Hyperlegible Next")
		assert.equal(theme.typography.body, "Atkinson Hyperlegible Next")
	})

	test("derives chrome colors for all modes from the solid background", () => {
		assert.deepEqual(parseThemeData(fixtureCss).chrome, {
			light: "#f0e7d7",
			dark: "#100e0b",
			"dark-low": "#1b1712",
		})
	})

	test("fails if the dark-low background is missing", () => {
		const broken = fixtureCss.replace("--bg-grad-bottom: #1b1712;", "")
		assert.throws(() => parseThemeData(broken), /dark-low is missing --bg-grad-bottom/)
	})

	test("throws naming the missing variable when a palette var is absent", () => {
		// Replaces the FIRST --secondary occurrence — the light block's.
		const broken = fixtureCss.replace("--secondary: #9a6b2f;", "")
		assert.throws(() => parseThemeData(broken), /light palette is missing variables.*secondary/)
	})

	test("ignores commented-out declarations instead of parsing them as live values", () => {
		// The decoy sits AFTER the live line, so a comment-blind parser would let
		// it override the real value in the name→value map.
		const commented = fixtureCss.replace("--light: #faf6ef;", "--light: #faf6ef;\n\t/* --light: red; */")
		const theme = parseThemeData(commented)
		assert.equal(theme.colors.lightMode.light, "#faf6ef")
	})

	/* Tests the OG 2-palette contract: a third saved-theme block is a real
   stylesheet feature, so the parser must keep producing exactly two palettes
   with the dark values coming from the dark block — never from dark-low. */
	test("keeps exactly two palettes when a dark-low block follows dark", () => {
		const theme = parseThemeData(fixtureCss)
		assert.deepEqual(Object.keys(theme.colors), ["lightMode", "darkMode"])
		// Dark values must be the dark block's; dark-low's lifted --light (#26211c)
		// and softened text ramp would fail loudly here if the block leaked in.
		assert.equal(theme.colors.darkMode.light, "#1a1714")
		assert.equal(theme.colors.darkMode.dark, "#ede5d8")
		assert.equal(theme.colors.darkMode.darkgray, "#d8cfc2")
		// The OG-contract comment inside the dark-low block mentions selectors and
		// values; a comment-blind parser would surface it as a live declaration.
		assert.equal(theme.colors.darkMode.secondary, "#c89b5a")
	})

	test("throws when a palette selector disappears from the stylesheet", () => {
		const broken = fixtureCss.replace(':root[saved-theme="dark"] {', ":dark-noop {")
		assert.throws(() => parseThemeData(broken), /selector.*not found/)
	})

	test("throws when a font variable carries no quoted family", () => {
		// Replaces the FIRST stack occurrence — --headerFont's.
		const broken = fixtureCss.replace(
			'"Atkinson Hyperlegible Next", system-ui, sans-serif',
			"system-ui, sans-serif",
		)
		assert.throws(() => parseThemeData(broken), /--headerFont carries no quoted font family/)
	})

	test("the real theme.css still satisfies the parser (SSOT drift guard)", () => {
		// Pins actual SSOT values on purpose: a palette/font edit must consciously
		// update this assertion rather than drift past the parser unnoticed.
		const css = readFileSync(new URL("../styles/theme.css", import.meta.url), "utf-8")
		const theme = parseThemeData(css)
		assert.equal(theme.colors.lightMode.light, "#faf6ef")
		assert.equal(theme.colors.darkMode.dark, "#ede5d8")
		assert.equal(theme.typography.header, "Georgia")
		assert.deepEqual(Object.keys(theme.colors), ["lightMode", "darkMode"])
		assert.deepEqual(theme.chrome, { light: "#f0e7d7", dark: "#100e0b", "dark-low": "#1b1712" })
	})
})
