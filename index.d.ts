declare module "*.css" {
	const content: string
	export = content
}

// dom custom event
// `themechange`'s theme union is the RAW mode list owned by
// quartz/components/scripts/themeContract.ts (THEME_MODES) — keep the two in sync.
// NOTE: never import "@quartz-community/types/globals" anywhere in this repo. Its global
// CustomEventMap augmentation still declares upstream's binary "light" | "dark" payload,
// and merging it with this interface is a hard TS2717 error. This file is this repo's
// augmentation of CustomEventMap.
interface CustomEventMap {
	prenav: CustomEvent<{}>
	nav: CustomEvent<{ url: FullSlug }>
	themechange: CustomEvent<{ theme: "light" | "dark" | "dark-low" }>
	readermodechange: CustomEvent<{ mode: "on" | "off" }>
	render: CustomEvent<{}>
}

type ContentIndex = Record<FullSlug, ContentDetails>
declare const fetchData: Promise<ContentIndex>
