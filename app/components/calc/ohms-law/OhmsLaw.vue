<script setup lang="ts">
import { ohmsLaw, roundTo } from "~/utils/equations"
import { fromBase } from "~/utils/prefixes"

// Text logic

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { t } = useI18n()

const { currentContent, title } = useLocalizedMarkdown({ cs, en })

// Math logic

type Field = "voltage" | "resistance" | "current"
const fields: Field[] = ["voltage", "resistance", "current"]

const prefixed = usePrefixedValues(fields)
const { values, prefixes, setPrefix, baseValue } = prefixed
const recent = useRecentFields<Field>(["voltage", "resistance"])
const { lastEdited } = recent

function setValue(field: Field, value: number | undefined) {
	prefixed.setValue(field, value)
	recent.markEdited(field)
}

const resultField = computed(
	() => fields.find((f) => !lastEdited.value.includes(f))!
)
const resultValue = computed(() => {
	const target = resultField.value
	const base = ohmsLaw(
		target === "voltage" ? undefined : baseValue("voltage"),
		target === "resistance" ? undefined : baseValue("resistance"),
		target === "current" ? undefined : baseValue("current")
	)
	return base == null
		? undefined
		: roundTo(fromBase(base, prefixes[target]), 4)
})

const display = computed(
	() =>
		Object.fromEntries(
			fields.map((f) => [
				f,
				resultField.value === f ? resultValue.value : values[f]
			])
		) as Record<Field, number | undefined>
)

const inputs = computed(() =>
	fields.map((field) => ({
		field,
		label: `${t(`units.${field}.name`)} [${t(`units.${field}.unit`)}]`,
		placeholder: t(`units.${field}.unit`)
	}))
)
</script>

<template>
	<CalcWrapper
		:title="title"
		:description="currentContent"
	>
		<PrefixedInput
			v-for="input in inputs"
			:key="input.field"
			:label="input.label"
			:model-value="display[input.field]"
			:prefix="prefixes[input.field]"
			:placeholder="input.placeholder"
			:variant="
				resultField === input.field && resultValue != null
					? 'subtle'
					: 'outline'
			"
			@update:model-value="setValue(input.field, $event)"
			@update:prefix="setPrefix(input.field, $event)"
		/>
	</CalcWrapper>
</template>
