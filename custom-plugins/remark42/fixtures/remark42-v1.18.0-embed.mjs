;(() => {
	"use strict"
	const e = (function (e, n) {
		if (!e) throw new Error("Remark42: remark_config.host wasn't configured.")
		try {
			const { protocol: t } = new URL(e)
			if ((t !== n && console.error("Remark42: Protocol mismatch."), "http:" !== t && "https:" !== t))
				throw (console.error("Remark42: Wrong protocol in host URL."), new Error())
		} catch (e) {
			throw new Error("Remark42: Invalid host URL.")
		}
		return e
	})(window.remark_config.host ?? "https://comments.taras.life", window.location.protocol)
	function n(e, n) {
		return !!e?.contentWindow && (e.contentWindow.postMessage(n, "*"), !0)
	}
	function t({ data: e }) {
		return "object" != typeof e || null === e || Array.isArray(e) ? {} : e
	}
	function o(e, n = {}) {
		Object.entries(n).forEach(([n, t]) => {
			e.style[n] = `${t}`
		})
	}
	function i(e, n = {}) {
		Object.entries(n).forEach(([n, t]) => {
			e.setAttribute(n, `${t}`)
		})
	}
	function r({ __colors__: n, custom_properties: r, styles: c, onReveal: d, ...a }) {
		const s = document.createElement("iframe"),
			l = new URLSearchParams(a).toString()
		return (
			i(s, {
				src: `${e}/web/iframe.html?${l}`,
				name: JSON.stringify({ __colors__: { ...n, ...r } }),
				tabindex: "0",
				title: "Comments | Remark42",
			}),
			o(s, {
				height: "100%",
				width: "100%",
				border: "none",
				padding: 0,
				margin: 0,
				overflow: "hidden",
				colorScheme: "dark" === a.theme ? "dark" : "light",
				visibility: "hidden",
				...c,
			}),
			(function (e, n) {
				function o() {
					;(window.removeEventListener("message", i),
						window.clearTimeout(r),
						(e.style.visibility = "visible"),
						n?.())
				}
				function i(n) {
					n.source === e.contentWindow && !0 === t(n).inited && o()
				}
				const r = window.setTimeout(o, 5e3)
				window.addEventListener("message", i)
			})(s, d),
			s
		)
	}
	let c = null,
		d = null
	function a() {
		d?.parentNode?.removeChild(d)
	}
	function s(e) {
		;(console.log(e.code), "Escape" === e.code && u())
	}
	function l(e) {
		;(o(document.body, { overflow: "hidden" }),
			(function (e) {
				a()
				const n = r({
					...e,
					page: "profile",
					styles: m.iframe,
					onReveal: () => n.isConnected && n.focus(),
				})
				;((d = n),
					c ||
						((c = (function (e, n) {
							const t = document.createElement("div")
							return (o(t, n), i(t, void 0), t)
						})(0, m.root)),
						document.body.appendChild(c)),
					c.appendChild(d),
					o(c, m.rootShown))
			})(e),
			window.requestAnimationFrame(() => {
				c && d && o(c, m.rootAppear)
			}),
			window.addEventListener("keydown", s))
	}
	function w(e) {
		return null !== e && null !== d && e === d.contentWindow
	}
	function u() {
		;(window.removeEventListener("keydown", s),
			new Promise((e) => {
				function n() {
					;(e(), c && (o(c, m.rootHidden), c.removeEventListener("transitionend", n)))
				}
				window.requestAnimationFrame(() => {
					c && d && (o(c, m.rootDisappear), c.addEventListener("transitionend", n))
				})
			}).then(() => {
				;(a(), document.body.style.removeProperty("overflow"))
			}))
	}
	const m = {
			root: {
				display: "none",
				position: "fixed",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				width: "100%",
				height: "100%",
				transition: "opacity 0.5s ease-in",
				background: "rgba(0, 0, 0, .4)",
				opacity: 0,
				zIndex: 99999999,
			},
			rootShown: { display: "block" },
			rootHidden: { display: "none" },
			rootAppear: { opacity: "1" },
			rootDisappear: { opacity: "0", transition: "opacity 0.3s ease-out" },
			iframe: { position: "absolute", right: 0, width: "100%", height: "100%" },
		},
		h = "data-remark42-iframe"
	let f = null
	function p() {
		;((window.REMARK42 = window.REMARK42 || {}),
			(window.REMARK42.createInstance = g),
			g(window.remark_config),
			window.dispatchEvent(new Event("REMARK42::ready")))
	}
	function g(e) {
		const o = document.getElementById("remark42")
		if (!o) throw new Error("Remark42: Can't find root node.")
		if (!window.remark_config) throw new Error("Remark42: Config object is undefined.")
		if (!window.remark_config.site_id) throw new Error("Site ID is undefined.")
		let i = null
		e.url = (e.url || `${window.location.origin}${window.location.pathname}`).split("#")[0]
		const c = o.querySelector(`:scope > iframe[${h}]`) ?? r(e)
		;(c.setAttribute(h, ""),
			o.appendChild(c),
			f?.(),
			(f = v),
			window.addEventListener("message", a),
			window.addEventListener("hashchange", m),
			document.addEventListener("click", g))
		const d = document.querySelector("title")
		function a(i) {
			if (i.source !== c.contentWindow && !w(i.source)) return
			const r = t(i)
			;("number" == typeof r.height && (c.style.height = `${r.height}px`),
				"number" == typeof r.scrollTo &&
					window.scrollTo(
						window.pageXOffset,
						r.scrollTo + c.getBoundingClientRect().top + window.pageYOffset,
					),
				"object" == typeof r.profile && (null === r.profile ? u() : l({ ...e, ...r.profile })),
				!0 === r.signout && n(c, { signout: !0 }),
				!0 === r.inited &&
					(Array.from(o.childNodes)
						.filter((e) => e !== c)
						.forEach((e) => e.remove()),
					s(),
					p(document.title)))
		}
		function s(e = window.location.hash) {
			e.startsWith("#remark42__comment-") && n(c, { hash: e })
		}
		function m(e) {
			s(new URL(e.newURL).hash)
		}
		function p(e) {
			n(c, { title: e })
		}
		function g(e) {
			c.contains(e.target) || n(c, { clickOutside: !0 })
		}
		function y(e) {
			;((window.remark_config.theme = e), (c.style.colorScheme = e), n(c, { theme: e }))
		}
		function v() {
			;(window.removeEventListener("message", a),
				window.removeEventListener("hashchange", m),
				document.removeEventListener("click", g),
				i && (i.disconnect(), (i = null)))
		}
		function E() {
			;(v(), f === v && (f = null), c.remove())
		}
		return (
			d &&
				((i = new MutationObserver((e) => p(e[0].target.textContent))),
				i.observe(d, { subtree: !0, characterData: !0, childList: !0 })),
			(window.REMARK42.changeTheme = y),
			(window.REMARK42.destroy = () => {
				;(E(), delete window.REMARK42.changeTheme, delete window.REMARK42.destroy)
			}),
			{ changeTheme: y, destroy: E }
		)
	}
	"loading" === document.readyState ? document.addEventListener("DOMContentLoaded", p) : p()
})()
