<script setup lang="ts">
import math, { Math } from "@comark/vue/plugins/math"

export interface CalcWrapperTab {
	label: string
	value?: string | number
	description?: string
	slot?: string
	trailingSlot?: string
	icon?: string
	disabled?: boolean
}

const props = withDefaults(
	defineProps<{
		title: string
		description?: string
		tabs?: CalcWrapperTab[]
		modelValue?: string | number
	}>(),
	{
		tabs: () => []
	}
)

const emit = defineEmits<{
	"update:modelValue": [value: string | number]
}>()

const internalSelectedTab = ref<string | number>()

const tabItems = computed(() =>
	props.tabs.map((tab, index) => ({
		...tab,
		value: tab.value ?? String(index)
	}))
)

const hasTabs = computed(() => tabItems.value.length > 0)

const selectedTab = computed({
	get() {
		return (
			props.modelValue ??
			internalSelectedTab.value ??
			tabItems.value[0]?.value ??
			"0"
		)
	},
	set(value: string | number) {
		internalSelectedTab.value = value
		emit("update:modelValue", value)
	}
})

watchEffect(() => {
	if (!hasTabs.value) {
		internalSelectedTab.value = undefined
		return
	}

	const hasSelectedTab = tabItems.value.some(
		(tab) => tab.value === selectedTab.value
	)

	if (!hasSelectedTab) {
		const firstTabValue = tabItems.value[0]?.value
		if (firstTabValue != null) {
			selectedTab.value = firstTabValue
		}
	}
})

const activeTab = computed(() =>
	tabItems.value.find((tab) => tab.value === selectedTab.value)
)

const activeDescription = computed(
	() => activeTab.value?.description ?? props.description
)
const activeContentSlot = computed(() => activeTab.value?.slot ?? "default")
const activeTrailingSlot = computed(
	() => activeTab.value?.trailingSlot ?? "trailing"
)
</script>

<template>
	<div class="flex gap-3 items-start w-full min-w-0">
		<div class="h-full w-1 bg-primary rounded-full shrink-0"></div>
		<div class="flex gap-8 lg:flex-row items-center flex-col w-full">
			<div class="flex min-w-0 flex-1 flex-col gap-2 h-full w-full">
				<h2 class="text-2xl font-bold">{{ title }}</h2>
				<UTabs
					v-if="hasTabs"
					v-model="selectedTab"
					:items="tabItems"
					:content="false"
					class="w-full"
					variant="link"
				/>
				<Comark
					:markdown="activeDescription"
					:components="{ math: Math }"
					:plugins="[math()]"
					class="compact min-w-0 max-w-full"
				/>
				<USeparator />
				<div
					class="flex min-w-0 flex-col gap-4 h-full w-full justify-center"
				>
					<slot
						:name="activeContentSlot"
						:item="activeTab"
						:selected-tab="activeTab"
						:selected-tab-value="selectedTab"
					/>
				</div>
			</div>
			<slot
				:name="activeTrailingSlot"
				:item="activeTab"
				:selected-tab="activeTab"
				:selected-tab-value="selectedTab"
			/>
		</div>
	</div>
</template>
