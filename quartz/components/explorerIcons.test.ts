import assert from "node:assert/strict"
import test from "node:test"
import { resolveExplorerIcon } from "./explorerIcons"

test("resolves only exact approved icon selections and defaults only when absent", () => {
	assert.equal(resolveExplorerIcon({ supplied: false }), "folder-closed")
	for (const key of ["stone", "workflow", "notebook", "map", "folder-closed", "house"]) {
		assert.equal(resolveExplorerIcon({ supplied: true, value: key }), key)
	}
	for (const value of [
		"",
		" ",
		" stone",
		"STONE",
		"unknown",
		"constructor",
		"toString",
		"__proto__",
		null,
		false,
		42,
		{},
		[],
	]) {
		assert.equal(resolveExplorerIcon({ supplied: true, value }), undefined)
	}
})
