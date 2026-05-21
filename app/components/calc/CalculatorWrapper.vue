<script setup lang="ts">
import math, { Math } from "@comark/vue/plugins/math"

defineProps<{
	title: string
	description?: string
}>()
</script>

<template>
	<div class="flex gap-3 items-center w-full">
		<div class="h-full w-1 bg-primary rounded-full"></div>
		<div class="flex flex-col gap-2 w-full">
			<h2 class="text-2xl font-bold">{{ title }}</h2>
			<Comark
				:markdown="description"
				:components="{ math: Math }"
				:plugins="[math()]"
				class="compact"
			/>
			<slot name="default" />
		</div>
	</div>
</template>
