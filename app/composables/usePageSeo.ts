const ogLocales = {
	cs: "cs_CZ",
	en: "en_US"
} as const

export function usePageSeo(pageTitle?: MaybeRefOrGetter<string | null | undefined>) {
	const { t, locale } = useI18n()
	const requestURL = useRequestURL()

	const title = computed(() => {
		const name = toValue(pageTitle)
		return name ? `${name} · ${t("app.name")}` : t("app.name")
	})

	const description = computed(() => t("app.description"))

	const ogLocale = computed(
		() => ogLocales[locale.value as keyof typeof ogLocales] ?? ogLocales.cs
	)

	const ogLocaleAlternate = computed(() =>
		Object.values(ogLocales).filter((value) => value !== ogLocale.value)
	)

	useHead({ title })

	useSeoMeta({
		description,
		ogTitle: title,
		ogDescription: description,
		ogType: "website",
		ogSiteName: () => t("app.name"),
		ogUrl: computed(() => requestURL.href),
		ogLocale,
		ogLocaleAlternate
	})
}
