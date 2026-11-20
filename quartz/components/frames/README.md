# quartz/components/frames/

## Why it exists?
- Defines the inner structure of a page independently of its content and configured components.

## What it does?
- A frame receives the page body and layout slots, then decides which slots to render and how to arrange them.
- **Default:** center, left and right sidebars, and footer.
- **Full width:** center and footer, without sidebars.
- **Minimal:** page body and footer only.

## Module Map
- `types.ts` — frame contract and available slots.
- `index.ts`, `registry.ts` — frame resolution and plugin registration.
- `DefaultFrame.tsx`, `FullWidthFrame.tsx`, `MinimalFrame.tsx` — built-in layouts.

## Additional Info

### Entry Point
- `renderPage.tsx` resolves the selected frame and passes it the page body and slots.
- Selection order: page-type layout override, page type's frame, then `default`.

### Quirks & Nuances
- A frame can omit a configured slot: sidebar components do not appear in full-width or minimal frames.
- Plugin-registered frames take precedence over built-ins with the same name. An unknown name warns and falls back to `default`.
