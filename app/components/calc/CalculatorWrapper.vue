<script setup lang="ts">
import math, { Math } from "@comark/vue/plugins/math"

defineProps<{
	title: string
	description?: string
}>()
</script>

<template>
	<div class="flex gap-3 items-start w-full">
		<div class="h-full w-1 bg-primary rounded-full"></div>
		<div class="flex flex-col gap-2 w-full h-full">
			<h2 class="text-2xl font-bold">{{ title }}</h2>
			<Comark
				:markdown="description"
				:components="{ math: Math }"
				:plugins="[math()]"
				class="compact"
			/>
			<USeparator />
			<div class="flex flex-col gap-4 h-full w-full justify-center">
				<slot name="default" />
			</div>
		</div>
	</div>
</template>
