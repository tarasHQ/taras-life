// Deprecated. Slow. If cmd approach will be stable - remove this script

const { execFile } = require("child_process")

const VAULT_NAME = "Obsidian-Vault"
const VSC_LINK_VAULT_PREFIX = "ThePlan/Job-Career-Finances/0vibes/vsc-link"

// 1. Gather the input file path from arguments
const rawFilePath = process.argv.slice(2).join(" ").trim()
if (!rawFilePath) {
	console.error("No file path provided.")
	process.exit(1)
}

// Remove surrounding quotes if any
const cleanFilePath = rawFilePath.replace(/^["']|["']$/g, "")

// 2. Normalize backslashes to forward slashes
const normalizedPath = cleanFilePath.replace(/\\/g, "/")

// 3. Extract subpath relative to __obsidian__
const match = normalizedPath.match(/__obsidian__\/(.*)$/i)
if (!match) {
	console.error("The selected file is not inside the __obsidian__ directory:", cleanFilePath)
	process.exit(1)
}

const relativeToObsidian = match[1]
const targetVaultPath = `${VSC_LINK_VAULT_PREFIX}/${relativeToObsidian}`

// 4. Construct Obsidian URI
const encodedVault = encodeURIComponent(VAULT_NAME)
const encodedFile = encodeURIComponent(targetVaultPath)
const obsidianUri = `obsidian://open?vault=${encodedVault}&file=${encodedFile}`

// 5. Open via PowerShell Start-Process (handles custom protocol URLs without cmd escaping quirks)
execFile("powershell", ["-NoProfile", "-Command", `Start-Process '${obsidianUri.replace(/'/g, "''")}'`], (err) => {
	if (err) {
		console.error("Failed to open Obsidian URI:", err)
		process.exit(1)
	}
	process.exit(0)
})
