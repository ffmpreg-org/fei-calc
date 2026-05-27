<script setup lang="ts">
import math, { Math } from "@comark/vue/plugins/math"

defineProps<{
	title: string
	description?: string
}>()
</script>

<template>
	<div class="flex gap-3 items-start w-full min-w-0">
		<div class="h-full w-1 bg-primary rounded-full shrink-0"></div>
		<div class="flex gap-8 xl:flex-row items-center flex-col-reverse">
			<div class="flex min-w-0 flex-1 flex-col gap-2 h-full w-full">
				<h2 class="text-2xl font-bold hidden xl:block">{{ title }}</h2>
				<Comark
					:markdown="description"
					:components="{ math: Math }"
					:plugins="[math()]"
					class="compact min-w-0 max-w-full"
				/>
				<USeparator />
				<div
					class="flex min-w-0 flex-col gap-4 h-full w-full justify-center"
				>
					<slot name="default" />
				</div>
			</div>
			<slot name="trailing" />
			<h2 class="text-2xl font-bold block xl:hidden w-full text-start">
				{{ title }}
			</h2>
		</div>
	</div>
</template>
