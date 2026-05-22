<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		label: string | undefined
		leadingLabel?: string
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
		<div
			v-if="leadingLabel"
			class="text-sm text-muted whitespace-nowrap"
		>
			{{ leadingLabel }}
		</div>
		<div class="flex min-w-0 gap-2 items-center">
			<slot name="default" />
		</div>
		<label
			v-if="label"
			class="text-sm text-muted whitespace-nowrap"
			>{{ label }}</label
		>
		<slot name="label" />
	</div>
</template>
