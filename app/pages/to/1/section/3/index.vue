<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
	<PageWrapper
		:title="`${t('section')} 3`"
		:breadcrumbs="[
			{ to: '/', icon: 'i-lucide-home' },
			{ to: '/to', icon: 'i-lucide-book-text', label: t('pages.to') },
			{ to: '/to/1', label: t('pages.to-1') }
		]"
	>
		<CalcTo1Section3Task1 />
	</PageWrapper>
</template>
