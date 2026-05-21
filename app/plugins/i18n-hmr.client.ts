import { localeLoaders } from "#build/i18n-options.mjs"

type LocaleMessage = Record<string, unknown>
type LocaleLoader = {
	load: () => Promise<unknown> | unknown
}
type I18nDevTools = {
	resetI18nProperties: (locale?: string) => Promise<void>
}
type I18nContext = {
	dev?: I18nDevTools
}
type I18nApi = {
	setLocaleMessage: (locale: string, messages: LocaleMessage) => void
}
type LocaleResolver = (locale: string) => Promise<unknown> | unknown

function isModule(value: unknown): value is { default: unknown } {
	return Object.prototype.toString.call(value) === "[object Module]"
}

function isRecord(value: unknown): value is LocaleMessage {
	return value != null && typeof value === "object" && !Array.isArray(value)
}

function mergeMessages(target: LocaleMessage, source: unknown) {
	if (!isRecord(source)) {
		return target
	}

	for (const [key, value] of Object.entries(source)) {
		if (isRecord(value) && isRecord(target[key])) {
			mergeMessages(target[key], value)
			continue
		}

		target[key] = value
	}

	return target
}

export default defineNuxtPlugin({
	name: "i18n:hmr-locale-messages",
	setup(nuxtApp) {
		if (!import.meta.dev) {
			return
		}

		const i18nContext = nuxtApp._nuxtI18n as I18nContext | undefined
		const i18n = nuxtApp.$i18n as I18nApi
		const devTools = i18nContext?.dev
		const originalReset = devTools?.resetI18nProperties

		if (!devTools || !originalReset) {
			return
		}

		async function loadLocaleMessages(locale: string) {
			const messages: LocaleMessage = {}
			const loaders = (localeLoaders as Record<string, LocaleLoader[] | undefined>)[locale] ?? []

			for (const loader of loaders) {
				const loaded = await nuxtApp.runWithContext(() => loader.load())
				const resolver = isModule(loaded) ? loaded.default : loaded
				const resolved =
					typeof resolver === "function"
						? await nuxtApp.runWithContext(() =>
								(resolver as LocaleResolver)(locale)
							)
						: resolver

				mergeMessages(messages, resolved)
			}

			return messages
		}

		devTools.resetI18nProperties = async (locale?: string) => {
			if (locale == null) {
				return originalReset(locale)
			}

			const messages = await loadLocaleMessages(locale)
			i18n.setLocaleMessage(locale, messages)
		}
	}
})
