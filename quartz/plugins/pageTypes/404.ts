import { QuartzPageTypePlugin } from "../types"
import { match } from "./matchers"
import { NotFound } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { i18n } from "../../i18n"
import { FullSlug } from "../../util/path"

export const NotFoundPageType: QuartzPageTypePlugin = () => ({
	name: "404",
	priority: -1,
	match: match.none(),
	generate({ cfg }) {
		const notFound = i18n(cfg.locale).pages.error.title
		const slug = "404" as FullSlug
		const [, vfile] = defaultProcessedContent({
			slug,
			text: notFound,
			description: notFound,
			// Fixed code-owned identity so the remark42 component renders here: every
			// missing URL serves this same page, so the thread is one shared "404" thread.
			frontmatter: { title: notFound, tags: [], id: "404" },
		})

		return [
			{
				slug,
				title: notFound,
				data: vfile.data,
			},
		]
	},
	layout: "404",
	frame: "minimal",
	body: NotFound,
})
