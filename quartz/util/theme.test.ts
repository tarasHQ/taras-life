/**
 * Tests for the theme.css parser (quartz/util/theme.ts). The parser is the
 * enforcement mechanism for the palette-SSOT invariant — these tests pin its
 * fail-loud behaviour so structural drift can never fail silently.
 */
import test, { describe } from "node:test"
import assert from "node:assert"
import { readFileSync } from "node:fs"
import { parseThemeData } from "./theme"

// Minimal theme.css stand-in carrying the full palette + font contract.
const fixtureCss = `
:root {
	--light: #faf8f8;
	--lightgray: #e5e5e5;
	--gray: #b8b8b8;
	--darkgray: #4e4e4e;
	--dark: #2b2b2b;
	--secondary: #284b63;
	--tertiary: #84a59d;
	--highlight: rgba(143, 159, 169, 0.15);
	--textHighlight: #fff23688;
	--headerFont:
		"Atkinson Hyperlegible Next", system-ui, sans-serif;
	--bodyFont:
		"Atkinson Hyperlegible Next", system-ui, sans-serif;
}

:root[saved-theme="dark"] {
	--light: #161618;
	--lightgray: #393639;
	--gray: #646464;
	--darkgray: #d4d4d4;
	--dark: #ebebec;
	--secondary: #7b97aa;
	--tertiary: #84a59d;
	--highlight: rgba(143, 159, 169, 0.15);
	--textHighlight: #b3aa0288;
}
`

describe("parseThemeData", () => {
	test("extracts palettes and font families from well-formed theme css", () => {
		const theme = parseThemeData(fixtureCss)
		assert.equal(theme.colors.lightMode.light, "#faf8f8")
		assert.equal(theme.colors.darkMode.dark, "#ebebec")
		assert.equal(theme.typography.header, "Atkinson Hyperlegible Next")
		assert.equal(theme.typography.body, "Atkinson Hyperlegible Next")
	})

	test("throws naming the missing variable when a palette var is absent", () => {
		// Replaces the FIRST --secondary occurrence — the light block's.
		const broken = fixtureCss.replace("--secondary: #284b63;", "")
		assert.throws(() => parseThemeData(broken), /light palette is missing variables.*secondary/)
	})

	test("ignores commented-out declarations instead of parsing them as live values", () => {
		// The decoy sits AFTER the live line, so a comment-blind parser would let
		// it override the real value in the name→value map.
		const commented = fixtureCss.replace("--light: #faf8f8;", "--light: #faf8f8;\n\t/* --light: red; */")
		const theme = parseThemeData(commented)
		assert.equal(theme.colors.lightMode.light, "#faf8f8")
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
		assert.equal(theme.colors.lightMode.light, "#faf8f8")
		assert.equal(theme.colors.darkMode.dark, "#ebebec")
		assert.equal(theme.typography.header, "Atkinson Hyperlegible Next")
	})
})
