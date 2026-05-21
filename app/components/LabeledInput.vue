<script setup lang="ts">
defineProps<{
	label: string | undefined
}>()
</script>

<template>
	<div class="flex gap-2 items-center">
		<slot name="default" />
		<label
			v-if="label"
			class="text-sm text-muted whitespace-nowrap"
			>{{ label }}</label
		>
		<slot name="label" />
	</div>
</template>
