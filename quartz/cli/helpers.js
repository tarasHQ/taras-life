import fs from "fs"
import path from "path"

/**
 * Create a directory symlink with Windows fallback.
 *
 * On Windows, creating symlinks requires Developer Mode or admin privileges.
 * When that fails (EPERM), we try a junction first (no elevation needed),
 * then fall back to a recursive copy as a last resort.
 *
 * @param {string} target  Symlink target (may be relative)
 * @param {string} linkPath  Path where the link is created
 */
export function symlinkOrCopySync(target, linkPath) {
	try {
		fs.symlinkSync(target, linkPath, "dir")
	} catch (err) {
		if (err.code === "EEXIST") return
		if (err.code === "EPERM" && process.platform === "win32") {
			try {
				fs.symlinkSync(target, linkPath, "junction")
				return
			} catch {
				const resolvedTarget = path.resolve(path.dirname(linkPath), target)
				fs.cpSync(resolvedTarget, linkPath, { recursive: true })
				return
			}
		}
		throw err
	}
}
