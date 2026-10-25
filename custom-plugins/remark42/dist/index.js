// remark42-browser:remark42:browser
var remark42_browser_default = '"use strict";(()=>{console.debug("[remark42] scaffold bootstrap loaded");})();\n';

// src/index.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var Remark42 = (opts) => {
  if (opts !== void 0) {
    throw new Error(
      "[Remark42] The plugin is not configurable via YAML options \u2014 configuration is hardcoded in custom-plugins/remark42/src/index.tsx; edit it and rebuild the plugin."
    );
  }
  const Component = ({ fileData }) => {
    const frontmatter = fileData.frontmatter;
    if (!frontmatter || frontmatter.comments === false) return null;
    const commentId = frontmatter["comment-id"];
    if (typeof commentId !== "string" || commentId.length === 0) return null;
    const remarkConfig = {
      host: "https://comments.taras.life",
      site_id: "taras-life",
      url: `https://taras.life/comments/${commentId}`,
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
