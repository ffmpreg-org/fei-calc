<script setup lang="ts">
import { PREFIXES } from "~/utils/prefixes"

withDefaults(
	defineProps<{
		label: string
		modelValue?: number
		prefix?: string
		placeholder?: string
		variant?: "outline" | "subtle"
		readonly?: boolean
	}>(),
	{
		prefix: "-",
		variant: "outline"
	}
)

const emit = defineEmits<{
	"update:modelValue": [value: number | undefined]
	"update:prefix": [prefix: string | undefined]
}>()
</script>

<template>
	<LabeledInput :label="label">
		<UInput
			:model-value="modelValue"
			:model-modifiers="{ optional: true }"
			:type="readonly ? undefined : 'number'"
			step="any"
			:placeholder="placeholder"
			:readonly="readonly"
			:variant="variant"
			class="flex-1 max-w-42"
			@update:model-value="emit('update:modelValue', $event)"
		/>
		<USelect
			:model-value="prefix"
			:items="PREFIXES"
			class="max-w-14 w-full"
			variant="ghost"
			size="sm"
			@update:model-value="emit('update:prefix', $event)"
		/>
	</LabeledInput>
</template>
