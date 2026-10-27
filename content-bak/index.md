---
title: Welcome to Quartz
---

This is a blank Quartz installation.
See the [documentation](https://quartz.jzhao.xyz) for how to get started.
This is a blank Quartz installation.
See the [documentation](https://quartz.jzhao.xyz) for how to get started.
This is a blank Quartz installation.
See the [documentation](https://quartz.jzhao.xyz) for how to get started.

This is a blank Quartz installation.
See the [documentation](https://quartz.jzhao.xyz) for how to get started.
This is a blank Quartz installation.
See the [documentation](https://quartz.jzhao.xyz) for how to get started.
This is a blank Quartz installation.
See the [documentation](https://quartz.jzhao.xyz) for how to get started.

```typescript
export declare global {
	interface Document {
		addEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Document, ev: CustomEventMap[K]) => void,
		): void
		removeEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Document, ev: CustomEventMap[K]) => void,
		): void
		dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K] | UIEvent): void
	}
	interface Window {
		spaNavigate(url: URL, isBack: boolean = false)
		addCleanup(fn: (...args: any[]) => void)
	}
}

```