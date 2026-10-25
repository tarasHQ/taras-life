// remark42-browser:remark42:browser
var remark42_browser_default = '"use strict";(()=>{var u="remark42",h="remark42-config",m="600px";var g="Comments could not be loaded. Reload the page to try again.",l=class{load=null;liveInstance=null;gateObserver=null;watchdog=null;revealObserver=null;generation=0;autoRunReady=null;onNav(){this.reset();let e=document.getElementById(u),n=document.getElementById(h),r=n?v(n):null;!e||!r||this.armGate(e,r)}onPrenav(){this.reset()}onThemeChange(e){this.liveInstance?.changeTheme(e)}async mount(e,n){let r=++this.generation;this.destroyInstance();let i={...n,theme:p()};R(i),this.armWatchdog(e,r);let s=this.load===null;if(s){console.debug("[remark42] loading the embed module");let o=`${n.host}/web/embed.mjs`;this.load=import(o)}try{if(await this.load,r!==this.generation)return;let o=a();if(s&&!o?.destroy&&(o=await this.waitForAutoRun(),r!==this.generation))return;if(this.liveInstance=s?k(o):o?.createInstance(i)??null,!this.liveInstance)throw new Error("Remark42 global is missing or malformed after import");this.armRevealWatch(e,r)}catch(o){if(r!==this.generation)return;console.error("[remark42] mounting the widget failed:",o),this.destroyInstance(),this.stopRevealWatch(),d(e)}}armGate(e,n){this.gateObserver=new IntersectionObserver(r=>{r.some(i=>i.isIntersecting)&&(this.disconnectGate(),this.mount(e,n))},{rootMargin:m}),this.gateObserver.observe(e)}reset(){this.generation++,this.destroyInstance(),this.stopRevealWatch(),this.disconnectGate()}waitForAutoRun(){let e=a();return e?.destroy?Promise.resolve(e):(this.autoRunReady??=new Promise(n=>{window.addEventListener("REMARK42::ready",()=>n(a()),{once:!0})}),this.autoRunReady)}armWatchdog(e,n){this.watchdog=window.setTimeout(()=>{this.watchdog=null,n===this.generation&&(console.error("[remark42] widget did not reveal within",15e3,"ms \\u2014 showing the failure note"),this.destroyInstance(),this.stopRevealWatch(),d(e))},15e3)}armRevealWatch(e,n){this.revealObserver=new MutationObserver(()=>{if(n!==this.generation){this.stopRevealWatch();return}w(e)&&this.stopRevealWatch()}),this.revealObserver.observe(e,{childList:!0})}stopRevealWatch(){this.watchdog!==null&&(window.clearTimeout(this.watchdog),this.watchdog=null),this.revealObserver?.disconnect(),this.revealObserver=null}disconnectGate(){this.gateObserver?.disconnect(),this.gateObserver=null}destroyInstance(){let e=this.liveInstance;this.liveInstance=null,e?.destroy();let n=a();!e&&n?.destroy&&n.destroy(),n&&(delete n.destroy,delete n.changeTheme)}};function v(t){let e=t.textContent??"",n=e.indexOf("{"),r=e.lastIndexOf("}");if(n===-1||r<=n)return null;try{let i=JSON.parse(e.slice(n,r+1));return f(i)?i:null}catch{return null}}function f(t){if(typeof t!="object"||t===null)return!1;let e=t;return typeof e.host=="string"&&e.host.length>0&&typeof e.site_id=="string"&&e.site_id.length>0}function a(){let t=window.REMARK42;return typeof t!="object"||t===null||typeof t.createInstance!="function"?null:t}function R(t){window.remark_config=t}function k(t){return!t||typeof t.destroy!="function"||typeof t.changeTheme!="function"?null:{destroy:t.destroy,changeTheme:t.changeTheme}}function p(){return document.documentElement.getAttribute("saved-theme")==="dark"?"dark":"light"}function w(t){let e=t.querySelector(":scope > iframe[data-remark42-iframe]");if(!e)return!1;for(let n of t.children)if(n!==e)return!1;return!0}function b(t){let e=t.detail;if(typeof e!="object"||e===null)return!1;let n=e.theme;return n==="light"||n==="dark"}function d(t){let e=document.createElement("p");e.setAttribute("role","status"),e.textContent=g,t.replaceChildren(e)}var c=new l;document.addEventListener("nav",()=>c.onNav());document.addEventListener("prenav",()=>c.onPrenav());document.addEventListener("themechange",t=>{b(t)&&c.onThemeChange(t.detail.theme)});})();\n';

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
      /* @__PURE__ */ jsx(
        "script",
        {
          id: "remark42-config",
          dangerouslySetInnerHTML: { __html: `var remark_config = ${JSON.stringify(remarkConfig)}` }
        }
      ),
      /* @__PURE__ */ jsx("div", { id: "remark42", children: /* @__PURE__ */ jsx("p", { role: "status", children: "Loading comments\u2026" }) })
    ] });
  };
  Component.afterDOMLoaded = remark42_browser_default;
  Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }";
  return Component;
};
export {
  Remark42
};
