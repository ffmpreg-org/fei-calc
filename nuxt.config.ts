// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/i18n"],

	devtools: {
		enabled: true
	},

	app: {
		head: {
			title: "FEI Calc",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
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
			link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }]
		}
	},

	css: ["~/assets/css/main.css"],

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
	}
})
