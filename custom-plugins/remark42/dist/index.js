// remark42-browser:remark42:browser
var remark42_browser_default = '"use strict";(()=>{console.debug("[remark42] scaffold bootstrap loaded");})();\n';

// src/index.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var Remark42 = (options) => {
  if (!options) {
    throw new Error("[Remark42] Missing options block in quartz.config.yaml");
  }
  const { host, siteId, threadBaseUrl } = options;
  const Component = ({ fileData }) => {
    const frontmatter = fileData.frontmatter;
    if (!frontmatter || frontmatter.comments === false) return null;
    const commentId = frontmatter["comment-id"];
    if (typeof commentId !== "string" || commentId.length === 0) return null;
    const threadUrl = `${threadBaseUrl}/${commentId}`;
    return /* @__PURE__ */ jsxs("section", { class: "remark42-comments", "aria-label": "Comments", children: [
      /* @__PURE__ */ jsx("h2", { children: "Comments" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          id: "remark42",
          "data-comment-id": commentId,
          "data-remark42-host": host,
          "data-remark42-site-id": siteId,
          "data-remark42-url": threadUrl,
          "data-remark42-title": frontmatter.title ?? fileData.slug ?? "Comments",
          children: /* @__PURE__ */ jsx("p", { role: "status", children: "Loading comments\u2026" })
        }
      )
    ] });
  };
  Component.afterDOMLoaded = remark42_browser_default;
  Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }";
  return Component;
};
export {
  Remark42
};
