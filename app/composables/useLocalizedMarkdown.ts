import { parseFrontmatter } from "comark"
import type { ComputedRef } from "vue"

export function useLocalizedMarkdown(
	sources: Record<string, string>,
	fallbackLocale = "en"
): {
	currentContent: ComputedRef<string>
	frontmatter: ComputedRef<Record<string, unknown>>
	title: ComputedRef<string>
	body: ComputedRef<string>
} {
	const { locale } = useI18n()

	const currentContent = computed(() => {
		return (
			sources[locale.value] ??
			sources[fallbackLocale] ??
			Object.values(sources)[0] ??
			""
		)
	})

	const parsed = computed(() => parseFrontmatter(currentContent.value))
	const frontmatter = computed(() => parsed.value.data)
	const title = computed(() => String(frontmatter.value.title ?? ""))
	const body = computed(() => parsed.value.content.trim())

	return {
		currentContent,
		frontmatter,
		title,
		body
	}
}
