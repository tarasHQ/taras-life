// The local build injects a browser bundle as text for Quartz's resource collector.
declare module "remark42:browser" {
	const script: string
	export default script
}
