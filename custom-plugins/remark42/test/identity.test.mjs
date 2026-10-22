// Stable thread keys are shared between article embeds and any future counters.
import assert from "node:assert/strict"
import test from "node:test"
import { findDuplicateCommentIds, getCommentId, getThreadUrl } from "../dist/identity.js"

const base = "https://taras.life/comments/"

test("only non-empty strings can identify a thread", () => {
	for (const value of [undefined, null, false, 123, "", "   ", ".", ".."]) {
		assert.equal(getCommentId(value), undefined)
		assert.equal(getThreadUrl(value, base), undefined)
	}
	assert.equal(getCommentId(" note-a "), "note-a")
})

test("the configured namespace, not a page path, determines the thread URL", () => {
	assert.equal(getThreadUrl("note-a", base), "https://taras.life/comments/note-a")
	assert.equal(getThreadUrl("note-a", base.replace(/\/$/, "")), getThreadUrl("note-a", base))
})

test("IDs containing URL punctuation are encoded as one path segment", () => {
	const id = "folder/note?x=1#part"
	const url = new URL(getThreadUrl(id, base))
	assert.equal(url.pathname, "/comments/folder%2Fnote%3Fx%3D1%23part")
	assert.equal(url.search, "")
	assert.equal(url.hash, "")
})

test("renaming or moving a note preserves its thread", () => {
	const before = { slug: "posts/old", frontmatter: { "comment-id": "stable-a" } }
	const after = { ...before, slug: "essays/new" }
	assert.equal(
		getThreadUrl(before.frontmatter["comment-id"], base),
		getThreadUrl(after.frontmatter["comment-id"], base),
	)
})

test("duplicate IDs identify every distinct source, not repeated references to one page", () => {
	const first = { relativePath: "a.md", frontmatter: { "comment-id": "shared" } }
	const second = { relativePath: "b.md", frontmatter: { "comment-id": " shared " } }
	assert.deepEqual(findDuplicateCommentIds([first, first]), [])
	assert.deepEqual(findDuplicateCommentIds([first, first, second, { slug: "no-id" }]), [
		{ id: "shared", pages: ["a.md", "b.md"] },
	])
})

test("the thread namespace rejects credentials and non-HTTP configuration", () => {
	for (const invalid of [
		"relative/path",
		"javascript:alert(1)",
		"https://user:password@example.com/comments",
		"https://example.com/comments?different-thread=1",
		"https://example.com/comments#fragment",
	]) {
		assert.throws(() => getThreadUrl("note-a", invalid), /threadBaseUrl/)
	}
})
