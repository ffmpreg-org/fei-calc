// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@nuxt/eslint",
		"@nuxt/ui",
		"@nuxtjs/i18n",
		"@vite-pwa/nuxt",
		"@comark/nuxt"
	],

	devtools: {
		enabled: true
	},

	app: {
		head: {
			title: "FEI Calc",
			meta: [
				{ charset: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{
					name: "theme-color",
					content: "#14b8a6",
					media: "(prefers-color-scheme: light)"
				},
				{
					name: "theme-color",
					content: "#134e4a",
					media: "(prefers-color-scheme: dark)"
				},
				{ name: "color-scheme", content: "light dark" }
			],
			link: [
				{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
				{
					rel: "icon",
					href: "/favicon.svg",
					sizes: "any",
					type: "image/svg+xml"
				},
				{
					rel: "apple-touch-icon",
					href: "/apple-touch-icon-180x180.png"
				}
			]
		}
	},

	css: ["~/assets/css/main.css", "katex/dist/katex.min.css"],

	build: {
		transpile: ["@comark/vue"]
	},

	routeRules: {
		"/": { prerender: true }
	},

	compatibilityDate: "2025-01-15",

	eslint: {
		config: {
			stylistic: {
				commaDangle: "never",
				braceStyle: "1tbs"
			}
		}
	},

	i18n: {
		defaultLocale: "cs",
		locales: [
			{
				code: "cs",
				file: "cs.json",
				name: "Čeština"
			},
			{
				code: "en",
				file: "en.json",
				name: "English"
			}
		]
	},

	pwa: {
		registerType: "autoUpdate",
		experimental: {
			enableWorkboxPayloadQueryParams: true
		},
		workbox: {
			globPatterns: ["**/*.{html,js,css,json,png,svg,ico,woff2}"],
			navigateFallback: "/"
		},
		manifest: {
			name: "FEI Calc",
			short_name: "FEI Calc",
			description: "FEI Calc",
			theme_color: "#14b8a6",
			background_color: "#ffffff",
			display: "standalone",
			orientation: "portrait",
			scope: "/",
			start_url: "/",
			icons: [
				{
					src: "pwa-64x64.png",
					sizes: "64x64",
					type: "image/png"
				},
				{
					src: "pwa-192x192.png",
					sizes: "192x192",
					type: "image/png"
				},
				{
					src: "pwa-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "any"
				},
				{
					src: "maskable-icon-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable"
				}
			]
		}
	},

	vite: {
		optimizeDeps: {
			include: [
				"@vue/devtools-core",
				"@vue/devtools-kit",
				"@vueuse/core",
				"comark"
			]
		}
	}
})
