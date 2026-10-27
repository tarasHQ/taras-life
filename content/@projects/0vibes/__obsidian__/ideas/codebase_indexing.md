- You can get other app's querries for parsing/tree-sitter or whatever. As reference or just copypaste

---

Below is an old phase of reverted implementation

# Phase #5 - Codebase Indexing & Semantic Search

This phase implements codebase indexing with embeddings and vector search, exposed as a `codebase_search` tool for the LLM. The system parses files using tree-sitter for intelligent chunking, generates embeddings via OpenRouter, stores vectors in LanceDB with content-hash deduplication to minimize redundant embedding calls, and supports reranking via DeepInfra for improved search quality.

## Architecture Overview

**Storage split**: SQLite stores file mtimes and content hashes for change detection. LanceDB stores chunk text and embeddings for vector search. Each project+model combination gets its own LanceDB table named `chunks_{sanitizedProjectName}_{projectId}_{embeddingModelName}`.

**Indexing trigger**: Manual only. Happens on `codebase_search` tool call (ensures fresh index before search) or via dedicated UI button. No file watcher.

**Deduplication strategy**: Chunks are keyed by content hash, not file position. When a file changes, only chunks with new content hashes get embedded. Unchanged chunks (even if reordered) reuse existing embeddings, dramatically reducing embedding API calls for typical edits.

**Flow on tool call**:

1. Scan project directory, compare mtimes against SQLite cache
2. For changed files: parse with tree-sitter, extract chunks, hash each chunk
3. Query LanceDB for existing chunk hashes, embed only missing ones
4. Update file→chunk mappings in LanceDB
5. Embed query, search vectors, optionally rerank results
6. Return relevant file snippets to LLM

## Configuration Defaults

All values should be configurable via a central config object/file:

- **Chunk max characters**: 1500
- **Embedding batch size**: 200
- **Search max results**: 20
- **Search score threshold**: 0.5
- **Reranker batch size**: configurable
- **Reranker score threshold**: configurable

## Configurable Values Notes

Configuration values for this feature should follow the existing patterns in the codebase. Currently, there's a `packages/server/src/config.ts` that loads from environment variables. The indexing configuration should be integrated there. For embedding model name, chunk size, batch sizes, thresholds, and reranker settings - these should all be accessible from a central configuration location that can be adjusted without code changes.

## Docs

Tree-sitter at `docs\tree-sitter`
LanceDB at `docs\lancedb`
fast-glob at `docs\fast-glob`

---

## Stage 1: SQLite Schema for File Tracking

### Context

We need to track file mtimes to detect changes efficiently. This lives in SQLite alongside existing project/task data because it's metadata about files, not vector data.

**Change detection logic**: When scanning files, first compare mtime. If mtime unchanged → skip (file unchanged). If mtime differs → compute file content hash and compare. If hash differs → file actually changed, needs reprocessing. If hash matches despite mtime change (e.g., `touch` command) → just update stored mtime, skip reprocessing.

### Tasks

**1.1** Added `file_index` table definition to `packages/server/src/db/schema.ts`:

- `project_id` (TEXT, foreign key to projects with ON DELETE CASCADE)
- `file_path` (TEXT, relative path within project, with COLLATE NOCASE for case-insensitive matching)
- `mtime` (INTEGER, Unix timestamp in milliseconds from fs.stat().mtimeMs)
- `content_hash` (TEXT, SHA256 hex of entire file content)

Composite primary key: `(project_id, file_path)`. Implemented using Drizzle's `primaryKey()` helper function. Exported `InsertFileIndex` and `SelectFileIndex` types.

**1.2** Appended `fileIndexSQL` to the `CREATE_TABLES_SQL` array for database initialization.

**1.3** Created `packages/server/src/db/repositories/FileIndexRepository.ts` with:

- `FileIndexEntry` interface: `{ mtime: number, contentHash: string }`
- `getForProject(projectId)` - returns Map\<string, FileIndexEntry>
- `bulkUpsert(projectId, entries)` - uses `.onConflictDoUpdate()` with transaction via `getRawDb().transaction()`
- `deleteByPaths(projectId, paths)` - uses `inArray()` for batch deletion
- `clearForProject(projectId)` - single DELETE statement

Exported singleton `fileIndexRepository`.

**1.4** Exported repository from `packages/server/src/db/repositories/index.ts`: `FileIndexRepository`, `fileIndexRepository`, and `FileIndexEntry` type.

---

## Stage 2: Directory Scanner

### Context

We need to scan project directories efficiently, respecting ignore patterns and handling edge cases like locked files. The scanner produces a list of indexable files with their current mtimes.

### Tasks

**2.1** Create `packages/server/src/indexing/scanner.ts`. This module exports a function that takes a project path and returns a Map of relative file paths to their mtimes.

**2.2** The scanner should use fast-glob for efficient recursive directory traversal. Configure fast-glob with:

- `cwd: projectPath` - handles OS-native paths
- `dot: true` - include dotfiles (config files like `.eslintrc.js`)
- `onlyFiles: true` - skip directories
- `suppressErrors: true` - continue despite permission errors (log for observability)
- `followSymbolicLinks: true` (default) - symlinks are followed; fast-glob handles cycle detection internally

**2.3** Define comprehensive ignore patterns as a hardcoded constant:

```typescript
const DEFAULT_IGNORE_PATTERNS = [
	// Version control
	'**/.git/**',

	// Dependencies
	'**/node_modules/**',
	'**/vendor/**', // PHP/Go

	// Build outputs
	'**/dist/**',
	'**/build/**',
	'**/out/**',
	'**/target/**', // Rust/Java
	'**/.next/**',
	'**/.nuxt/**',

	// Test/coverage
	'**/coverage/**',

	// Caches
	'**/.cache/**',
	'**/__pycache__/**', // Python

	// Project metadata
	'**/.axon/**', // Axon's own folder

	// Lock files (large, no semantic value)
	'**/package-lock.json',
	'**/pnpm-lock.yaml',
	'**/yarn.lock',
	'**/Cargo.lock',
	'**/composer.lock',
	'**/Gemfile.lock',
	'**/poetry.lock',
	'**/pubspec.lock',
]
```

All patterns use forward slashes (fast-glob requirement). Use `normalizePath()` from existing utils if constructing patterns dynamically.

**2.4** Do NOT use an extension allowlist. The scanner returns all non-ignored files. Binary detection happens later using `isBinaryFile()` (already used by read\_file/write\_to\_file tools). Tree-sitter support check determines chunking strategy (semantic vs line-based).

**2.5** Implement retry logic for file stat operations: if reading a file's mtime fails (e.g., file locked), wait 100ms and retry up to 3 times total. If all retries fail, log a warning with the file path and track it as a failed file. Do not throw - the indexing process should continue with other files.

**2.6** Create a diff function that compares scanned files against cached state from SQLite. Returns:

```typescript
interface ScanDiff {
	added: string[] // In scan but not in cache
	mtimeChanged: string[] // In both, but mtime differs (may or may not be truly modified - hash check happens in IndexManager)
	deleted: string[] // In cache but not in scan
	unchanged: string[] // mtime matches
	failed: Array<{ path: string; error: string }> // Files that failed to stat after retries
}
```

Note: If a file appears in glob results but fails to stat after retries, it's treated as "not scanned" (absent from the mtime map). The diff function will see it as either "deleted" (if was cached) or invisible (if not cached). This is intentional - failed files are surfaced via the `failed` array for observability.

**2.7** Maximum file size filtering is NOT the scanner's responsibility. The IndexManager (Stage 6) will skip files exceeding a configurable threshold when reading content. This keeps the scanner focused on "find files" vs "decide what's worth indexing."

---

## Stage 3: Tree-sitter Chunking

### Context

Tree-sitter provides language-aware parsing for intelligent code chunking. We want to split files at semantic boundaries (functions, classes, methods) rather than arbitrary line counts. Native tree-sitter bindings (not WASM) are required for performance.

### Tasks

**3.1** Add tree-sitter and language-specific parser packages to server dependencies. Required parsers: tree-sitter-typescript (covers both TS and TSX), tree-sitter-javascript, tree-sitter-python. Additional languages can be added later following the same pattern.

**3.2** Create `packages/server/src/indexing/chunker.ts`. This module handles file parsing and chunk extraction.

**3.3** Implement a parser cache that lazily initializes parsers per language. Map file extensions to languages (e.g., `.ts`/`.tsx` → typescript, `.py` → python). For unknown extensions, fall back to line-based chunking.

**3.4** The main chunking function takes file content, file path, and max chunk size (default from config). It returns an array of chunks, each containing: text content, start line, end line, and a type hint (function, class, method, or block for non-semantic chunks).

**3.5** For tree-sitter parsed files: traverse the AST to find top-level declarations (functions, classes, methods within classes). Each becomes a candidate chunk. If a declaration exceeds max chunk size, split it further at logical points (nested functions, or fall back to line-based splitting).

**3.6** For each chunk, prepend a header comment with the file path to provide context for the embedding model: `// File: {relativePath}`. This helps the embedding capture file context.

**3.7** For files without tree-sitter support: use simple line-based chunking. Split on blank lines (paragraph boundaries), accumulating content until approaching max chunk size, then start a new chunk. Always include the file path header.

**3.8** Implement content hashing utility: SHA256 hash of the chunk text content. This hash is used for deduplication - two chunks with identical content have identical hashes regardless of source file or position.

---

## Stage 4: LanceDB Integration

### Context

LanceDB stores embeddings and enables vector search. Each project+model combination gets its own table. The table contains chunk text (for returning snippets) alongside embeddings.

### Tasks

**4.1** Add `@lancedb/lancedb` package to server dependencies.

**4.2** Create `packages/server/src/indexing/vectorStore.ts`. This module manages LanceDB connections and table operations.

**4.3** LanceDB database should be stored at a path derived from the Axon data directory (same location as SQLite). Create a subdirectory like `~/.axon/lancedb/` for vector data.

**4.4** Implement table naming: `chunks_{sanitizedProjectName}_{projectId}_{embeddingModelName}`. Sanitize project name to be filesystem-safe (lowercase, replace spaces/special chars with underscores, truncate if too long). The embedding model name should also be sanitized (e.g., `openai/text-embedding-3-small` becomes `openai_text_embedding_3_small`).

**4.5** Define the table schema. Each row represents a chunk and contains:

- `content_hash` (string) - SHA256 of chunk text, used for deduplication
- `file_path` (string) - relative path of source file
- `chunk_index` (int) - order within file (for display)
- `chunk_text` (string) - actual text content of the chunk
- `start_line` (int) - line number where chunk starts
- `end_line` (int) - line number where chunk ends
- `vector` (fixed-size float array) - the embedding

**4.6** Implement table management functions:

- `getOrCreateTable(projectId, projectName, modelName)` - returns table, creating with schema if doesn't exist
- `tableExists(projectId, projectName, modelName)` - checks if specific table exists for model detection
- `deleteTable(projectId, projectName, modelName)` - for manual cleanup

**4.7** Implement chunk operations:

- `getExistingHashes(table)` - returns Set of all content\_hash values currently in table
- `upsertChunks(table, chunks)` - adds new chunks, uses merge-insert pattern to update existing
- `deleteChunksByFilePath(table, filePaths)` - removes all chunks for given files (for deleted/modified files)

**4.8** Implement vector search function:

- Takes table, query embedding, limit (from config default), score threshold (from config default)
- Returns results sorted by similarity score, filtered by threshold
- Each result includes: file\_path, chunk\_text, start\_line, end\_line, score

---

## Stage 5: Embedding Provider

### Context

Embeddings are generated via OpenRouter API. The provider should handle batching efficiently and integrate with the existing provider pattern in the codebase.

### Tasks

**5.1** Create `packages/server/src/indexing/embeddingProvider.ts`. This provides the interface for generating embeddings.

**5.2** Research the existing OpenRouter provider implementation at `packages/server/src/providers/openrouter.ts` to understand patterns for API calls, error handling, and retry logic.

**5.3** Implement embedding function that takes an array of texts and returns an array of embedding vectors (as Float32Arrays). Use the OpenRouter embeddings endpoint. The embedding model should be configurable (stored in config).

**5.4** Implement batching: if input exceeds configured batch size (default 200), split into batches and process sequentially. This respects API limits while processing large file sets.

**5.5** Handle API errors with retry logic consistent with existing provider patterns. Log embedding progress for observability.

**5.6** For single-text embedding (used for query embedding), provide a convenience wrapper that handles the single-element array case.

---

## Stage 6: Index Manager (Core Orchestrator)

### Context

The Index Manager ties together all indexing components. It's the main entry point called by the tool executor and the manual rebuild trigger.

### Tasks

**6.1** Create `packages/server/src/indexing/IndexManager.ts`. This is the core orchestrator class.

**6.2** Create `packages/server/src/indexing/index.ts` that exports a singleton instance of IndexManager and re-exports types/utilities needed by consumers.

**6.3** Implement the primary method `ensureIndexed(projectId, projectPath, projectName)` that:

- Determines current embedding model from config
- Checks if LanceDB table exists for this project+model combination
- If no table exists: treat as cold start, full index needed
- If table exists: load mtime cache from SQLite, scan directory, diff to find changes

**6.4** For files needing processing (added or modified):

- Read file content with retry logic (same 3x100ms pattern as scanner)
- Parse with tree-sitter and extract chunks
- Hash each chunk's content
- Compare against existing hashes in LanceDB table
- Collect chunks that need embedding (hash not found in table)

**6.5** For modified files: delete all existing chunks for that file from LanceDB before inserting new ones. This handles cases where chunk boundaries change.

**6.6** For deleted files: remove their chunks from LanceDB and their entries from SQLite mtime cache.

**6.7** Batch embed all new chunks using the embedding provider. Insert into LanceDB.

**6.8** Update SQLite mtime cache with new file states (mtime and content hash for each processed file).

**6.9** Return indexing statistics: files scanned, files processed, chunks created, chunks reused (hash hit), errors encountered, duration.

**6.10** Implement `forceReindex(projectId, projectPath, projectName)` that clears SQLite cache for project, drops and recreates LanceDB table, then runs full indexing. Used by manual rebuild button.

**6.11** Throughout the process, emit progress events that can be consumed by the progress UI. Define a simple event structure: phase (scanning/parsing/embedding/storing), current count, total count, optional message.

---

## Stage 7: Progress Streaming

### Context

Indexing can take several seconds for large codebases. Users need feedback that something is happening. The progress indicator should work for both tool-triggered indexing and manual rebuilds.

### Tasks

**7.1** Define indexing progress event types in `packages/shared/src/types/websocket.ts`. Events should include: `indexing:started`, `indexing:progress`, `indexing:completed`, `indexing:error`. The progress event carries: projectId, phase (scanning/parsing/embedding), current, total, optional details.

**7.2** Modify IndexManager to accept an optional event emitter callback. When provided, the manager calls it with progress events at key points: start of each phase, periodic updates during embedding (every N chunks), completion or error.

**7.3** Create a WebSocket handler at `packages/server/src/ws/handlers/indexing.ts` for manual index rebuild requests. It should:

- Accept project ID
- Call IndexManager.forceReindex with a callback that sends progress events to the client
- Send final completion or error event

**7.4** On the client side, create an indexing store at `packages/client/src/stores/indexingStore.ts` using Zustand. It tracks: isIndexing (boolean), currentProject (projectId or null), currentPhase, progress (current/total), lastError.

**7.5** Add WebSocket listener handling for indexing events. On `indexing:started`, set isIndexing true. On `indexing:progress`, update phase and counts. On `indexing:completed` or `indexing:error`, set isIndexing false and store result/error.

**7.6** Create a minimal IndexingStatus component that displays: spinner when indexing, idle indicator when not. On click, show a popover/tooltip with details: current phase, progress counts, any errors from last run. This component should be self-contained and can be placed in TaskView footer area for now.

**7.7** Add a "Rebuild Index" button to the IndexingStatus component (or nearby). Clicking sends the manual rebuild request to server.

---

## Stage 8: codebase\_search Tool

### Context

The `codebase_search` tool is the LLM-facing interface to semantic code search. It ensures the index is fresh, performs vector search, and returns relevant snippets.

### Tasks

**8.1** Create tool directory structure at `packages/server/src/tools/codebase_search/` following the established pattern with: `schema.ts`, `executor.ts`, `index.ts`.

**8.2** Define the tool schema. Parameters:

- `query` (string, required): Natural language description of what to search for
- `limit` (number, optional): Maximum results to return, defaults to configured max (20)

**8.3** In the executor:

- Get project context (projectId, projectPath, projectName) - this follows patterns from existing tools
- Call IndexManager.ensureIndexed() to ensure fresh index. Pass a progress callback that emits WebSocket events so UI can show indexing status even when triggered by tool
- Generate embedding for the query text
- Perform vector search on the project's LanceDB table
- Return results formatted for LLM consumption

**8.4** Format tool results as a structured list showing: file path, line range, relevance score (formatted as percentage or normalized value), and the snippet text. Keep snippets readable but concise - the LLM will read the full file if needed.

**8.5** Set tool metadata: `requiresApproval: false` (read-only, safe to auto-execute), `rerunSafe: true`.

**8.6** Register the tool in `packages/server/src/tools/index.ts`.

**8.7** Handle edge cases:

- If indexing fails, return an error result explaining what happened
- If no results meet the score threshold, return a message indicating no relevant matches found (not an error)
- If query embedding fails, return appropriate error

---

## Stage 9: Reranking Integration

### Context

Reranking improves search quality by using a more sophisticated model to re-score initial vector search results. We use DeepInfra with the Qwen3-Reranker-8B model. Since this API isn't OpenAI-compatible, we make direct HTTP requests.

### Tasks

**9.1** Create `packages/server/src/indexing/reranker.ts`. This module handles reranking API calls.

**9.2** Research DeepInfra's reranker API format. The Qwen/Qwen3-Reranker-8B model expects query-document pairs and returns relevance scores. Implement the request/response handling accordingly.

**9.3** The rerank function takes: query string, array of candidate documents (chunk texts), and returns the same documents with reranker scores, sorted by score descending.

**9.4** Implement batching for reranking if the number of candidates exceeds configured batch size.

**9.5** Handle API errors gracefully - if reranking fails, fall back to returning the original vector search results with a warning logged. Reranking should enhance results but never block the search.

**9.6** Add reranker configuration to the central config: enable/disable toggle, model name, API endpoint, score threshold, batch size.

**9.7** Integrate reranking into the codebase\_search executor:

- After vector search returns candidates, if reranking is enabled and there are results
- Pass results to reranker
- Filter by reranker score threshold
- Return reranked results

**9.8** Consider adding reranking information to tool result metadata so users can see if results were reranked.

---

## Stage 10: Client Tool Renderer

### Context

The tool results need a clean UI representation. Following existing patterns, create a renderer for codebase\_search results.

### Tasks

**10.1** Create `packages/client/src/components/tool-renderers/CodebaseSearch/` directory with the standard renderer structure.

**10.2** The renderer should display search results as a list. Each result shows:

- File path (clickable if IDE connected, following existing file link patterns)
- Line range
- Relevance score (as percentage or visual indicator)
- Snippet preview (first few lines, expandable if long)

**10.3** Show indexing metadata in a subtle way: "Indexed X files (Y chunks) in Zms" or similar, so users understand the indexing happened.

**10.4** If search returned no results, show a helpful message rather than empty space.

**10.5** Register the renderer in the tool renderer registry following existing patterns.

---

## Rough idea of Key Files Created

**Server (packages/server/src/):**

- `db/schema.ts` - modified with file\_index table
- `db/repositories/FileIndexRepository.ts` - new
- `indexing/scanner.ts` - new
- `indexing/chunker.ts` - new
- `indexing/vectorStore.ts` - new
- `indexing/embeddingProvider.ts` - new
- `indexing/reranker.ts` - new
- `indexing/IndexManager.ts` - new
- `indexing/index.ts` - new (exports)
- `ws/handlers/indexing.ts` - new
- `tools/codebase_search/` - new tool directory

**Shared (packages/shared/src/):**

- `types/websocket.ts` - modified with indexing event types

**Client (packages/client/src/):**

- `stores/indexingStore.ts` - new
- `components/IndexingStatus.tsx` - new
- `components/tool-renderers/CodebaseSearch/` - new renderer

---

## Already installed dependencies

**packages/server/package.json:**

- `@lancedb/lancedb` - vector database
- `tree-sitter` - native bindings
- `tree-sitter-typescript` - TS/TSX parser
- `tree-sitter-javascript` - JS parser
- `tree-sitter-python` - Python parser
- `fast-glob` - efficient directory scanning (if not already present)
