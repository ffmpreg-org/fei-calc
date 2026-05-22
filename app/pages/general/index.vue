<script setup>
import OhmsLaw from "~/components/calc/ohms-law/OhmsLaw.vue"
import SeriesParallel from "~/components/calc/series-parallel/SeriesParallel.vue"

const { t } = useI18n()
</script>

<template>
	<PageWrapper
		:title="t('pages.general')"
		:breadcrumbs="[{ to: '/', icon: 'i-lucide-home' }]"
	>
		<div class="grid min-w-0 w-full gap-8 grid-cols-1 md:grid-cols-2">
			<OhmsLaw />
			<SeriesParallel />
		</div>
	</PageWrapper>
</template>
