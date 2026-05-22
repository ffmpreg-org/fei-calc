<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		label: string | undefined
		orientation?: "horizontal" | "vertical"
	}>(),
	{
		orientation: "horizontal"
	}
)

const rootClass = computed(() =>
	props.orientation === "vertical"
		? "flex flex-col-reverse gap-2 items-stretch"
		: "flex flex-row gap-2 items-center"
)
</script>

<template>
	<div :class="rootClass">
		<slot name="default" />
		<label
			v-if="label"
			class="text-sm text-muted whitespace-nowrap"
			>{{ label }}</label
		>
		<slot name="label" />
	</div>
</template>
