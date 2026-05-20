<script setup>
const { t } = useI18n()
</script>

<template>
	<PageWrapper
		:title="t('pages.general')"
		:breadcrumbs="[{ to: '/', icon: 'i-lucide-home' }]"
	>
	</PageWrapper>
</template>
