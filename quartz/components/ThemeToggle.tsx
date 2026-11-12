import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { themeToggleScript } from "./scripts/themeContract"
import toggleStyles from "./styles/theme-toggle.css"

/**
 * Build-time theme toggle: renders the button that cycles the site through
 * the theme contract's mode list (light → dark → dark-low). Purely a build-time
 * function — all browser behaviour lives in the contract's `themeToggleScript`
 * (delegated document-level click listener, registered once), and the icon
 * state is pure CSS keyed off the `saved-theme` attribute. The icon is a
 * single morphing SVG whose three glyphs (sun / moon / half-contrast circle)
 * map one-to-one to the three modes; every attribute value must have a CSS
 * branch or the default (sun) glyph leaks into that mode.
 */
const ThemeToggle: QuartzComponent = () => {
	return (
		<button type="button" class="theme-toggle" aria-label="Toggle theme">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true">
				<g class="icon-sun">
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
				</g>
				<g class="icon-moon">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</g>
				<g class="icon-low">
					<circle cx="12" cy="12" r="9" />
					<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
				</g>
			</svg>
		</button>
	)
}

ThemeToggle.css = toggleStyles
ThemeToggle.beforeDOMLoaded = themeToggleScript

export default (() => ThemeToggle) satisfies QuartzComponentConstructor
