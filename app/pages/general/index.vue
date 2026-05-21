<script setup>
import OhmsLaw from "~/components/calc/ohms-law/OhmsLaw.vue"

const { t } = useI18n()
</script>

<template>
	<PageWrapper
		:title="t('pages.general')"
		:breadcrumbs="[{ to: '/', icon: 'i-lucide-home' }]"
	>
		<div class="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			<OhmsLaw />
		</div>
	</PageWrapper>
</template>
