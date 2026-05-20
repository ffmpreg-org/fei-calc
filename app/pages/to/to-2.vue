<script setup>
const { t } = useI18n()
</script>

<template>
	<PageWrapper
		:title="t('pages.to-2')"
		:breadcrumbs="[
			{ to: '/', icon: 'i-lucide-home' },
			{ to: '/to', icon: 'i-lucide-book-text', label: t('pages.to') }
		]"
	>
	</PageWrapper>
</template>
