<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui"

const props = defineProps<{
	breadcrumbs?: BreadcrumbItem[]
	title?: string | null
}>()

const { t } = useI18n()

useHead({
	title: computed(() =>
		props.title ? `${props.title} · ${t("app.name")}` : t("app.name")
	)
})
</script>

<template>
	<div class="flex flex-col gap-y-4 min-h-full p-4 w-full">
		<div class="flex items-center justify-between gap-3 w-full">
			<div class="flex items-center gap-2">
				<slot name="breadcrumbs-leading" />
				<UBreadcrumb :items="breadcrumbs" />
				<slot name="breadcrumbs" />
			</div>
			<slot name="breadcrumbs-trailing" />
		</div>
		<div
			class="flex items-start lg:items-center justify-between gap-3 w-full flex-col lg:flex-row"
		>
			<div class="flex items-center gap-2">
				<slot name="title-leading" />
				<h1
					v-if="title"
					class="lg:text-5xl text-3xl font-bold"
				>
					{{ props.title }}
				</h1>
				<slot name="title" />
			</div>
			<slot name="title-trailing" />
		</div>
		<slot name="description" />
		<div class="flex items-center gap-3 w-full">
			<USeparator class="flex-1 min-w-0" />
			<slot name="separator-trailing" />
		</div>
		<slot name="default" />
	</div>
</template>
