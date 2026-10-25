/**
 * Type declaration for the `remark42:browser` virtual module.
 *
 * The identifier does not exist on disk: the esbuild build (build.mjs) resolves it
 * through a plugin that substitutes the bundled browser script as a string module,
 * which then flows into `Component.afterDOMLoaded`. This shim makes the import
 * type-honest at compile time.
 */
declare module "remark42:browser" {
	const browserScript: string
	export default browserScript
}
