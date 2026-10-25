// remark42-browser:remark42:browser
var remark42_browser_default = '"use strict";(()=>{console.debug("[remark42] scaffold bootstrap loaded");})();\n';

// src/thread-identity.ts
var ID_PATTERN = /^[a-z0-9-]+$/;
function checkThreadId(value) {
  if (value === void 0) return { kind: "absent" };
  if (typeof value !== "string") {
    return { kind: "invalid", problem: `id must be a string, got ${describe(value)}` };
  }
  const id = value.trim();
  if (id.length === 0) return { kind: "invalid", problem: "id is empty or whitespace-only" };
  if (id === "." || id === "..") {
    return { kind: "invalid", problem: `id must not be the dot segment ${JSON.stringify(id)}` };
  }
  if (!ID_PATTERN.test(id)) {
    return { kind: "invalid", problem: `id must match [a-z0-9-]+, got ${JSON.stringify(value)}` };
  }
  return { kind: "valid", id };
}
function buildThreadUrl(id, threadBaseUrl) {
  return `${threadBaseUrl}/${encodeURIComponent(id)}`;
}
function scanThreadIdIssues(pages) {
  const issues = [];
  const pagesById = /* @__PURE__ */ new Map();
  for (const page of pages) {
    const frontmatter = asRecord(page.frontmatter);
    if (!frontmatter || frontmatter["comments"] === false) continue;
    const check = checkThreadId(frontmatter["id"]);
    if (check.kind === "absent") continue;
    const source = describeSource(page);
    if (check.kind === "invalid") {
      issues.push({ pages: [source], problem: check.problem });
      continue;
    }
    const sources = pagesById.get(check.id) ?? /* @__PURE__ */ new Set();
    sources.add(source);
    pagesById.set(check.id, sources);
  }
  for (const [id, sources] of pagesById) {
    if (sources.size > 1) {
      issues.push({
        pages: [...sources],
        problem: `duplicate id ${JSON.stringify(id)} \u2014 these pages would silently share one comment thread`
      });
    }
  }
  return issues.sort(compareIssues);
}
function formatThreadIdIssues(issues) {
  const lines = issues.map((issue) => `- ${issue.pages.join(", ")}: ${issue.problem}`);
  return `[Remark42] Comment identity errors \u2014 fix the frontmatter \`id\` key:
${lines.join("\n")}`;
}
function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function describeSource(page) {
  const name = typeof page.relativePath === "string" ? page.relativePath : typeof page.slug === "string" ? page.slug : void 0;
  return name ?? "unknown page";
}
function describe(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
function compareIssues(a, b) {
  const aSource = a.pages.join(", ");
  const bSource = b.pages.join(", ");
  if (aSource !== bSource) return aSource < bSource ? -1 : 1;
  return a.problem < b.problem ? -1 : a.problem > b.problem ? 1 : 0;
}

// src/index.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var THREAD_BASE_URL = "https://taras.life/comments";
var Remark42 = (opts) => {
  if (opts !== void 0) {
    throw new Error(
      "[Remark42] The plugin is not configurable via YAML options \u2014 configuration is hardcoded in custom-plugins/remark42/src/index.tsx; edit it and rebuild the plugin."
    );
  }
  const Component = ({ fileData, allFiles }) => {
    const frontmatter = fileData.frontmatter;
    if (!frontmatter || frontmatter.comments === false) return null;
    const issues = scanThreadIdIssues(allFiles ?? []);
    if (issues.length > 0) throw new Error(formatThreadIdIssues(issues));
    const check = checkThreadId(frontmatter["id"]);
    if (check.kind !== "valid") return null;
    const remarkConfig = {
      host: "https://comments.taras.life",
      site_id: "taras-life",
      url: buildThreadUrl(check.id, THREAD_BASE_URL),
      no_footer: true,
      custom_properties: {},
      // filled at step 08 (visual polish)
      page_title: frontmatter.title ?? fileData.slug ?? "Comments"
    };
    return /* @__PURE__ */ jsxs("section", { class: "remark42-comments", "aria-label": "Comments", children: [
      /* @__PURE__ */ jsx("h2", { children: "Comments" }),
      /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `var remark_config = ${JSON.stringify(remarkConfig)}` } }),
      /* @__PURE__ */ jsx("div", { id: "remark42", children: /* @__PURE__ */ jsx("p", { role: "status", children: "Loading comments\u2026" }) }),
      /* @__PURE__ */ jsx("script", { type: "module", src: `${remarkConfig.host}/web/embed.mjs` })
    ] });
  };
  Component.afterDOMLoaded = remark42_browser_default;
  Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }";
  return Component;
};
export {
  Remark42
};
