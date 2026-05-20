<script setup>
const { t } = useI18n()
</script>

<template>
	<PageWrapper
		:title="t('pages.to')"
		:breadcrumbs="[{ to: '/', icon: 'i-lucide-home' }]"
	>
	</PageWrapper>
</template>
