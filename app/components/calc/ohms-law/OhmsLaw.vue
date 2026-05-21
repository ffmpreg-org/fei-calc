<script setup lang="ts">
import { ohmsLaw } from "~/utils/equations"
import { fromBase, toBase } from "~/utils/prefixes"
import CalculatorWrapper from "../CalculatorWrapper.vue"
import { parseFrontmatter } from "comark"

// Text logic

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { locale, t } = useI18n()

const currentContent = computed(() => (locale.value === "cs" ? cs : en))
const title = computed(() =>
	String(parseFrontmatter(currentContent.value).data.title ?? "")
)

// Math logic

type Field = "voltage" | "resistance" | "current"
const fields: Field[] = ["voltage", "resistance", "current"]

const values = reactive<Record<Field, number | undefined>>({
	voltage: undefined,
	resistance: undefined,
	current: undefined
})

const prefixes = reactive<Record<Field, string>>({
	voltage: "-",
	resistance: "-",
	current: "-"
})

const lastEdited = ref<[Field, Field]>(["voltage", "resistance"])

function setValue(field: Field, value: number | undefined) {
	values[field] = value
	const [a, b] = lastEdited.value
	if (field === a) return
	lastEdited.value = field === b ? [b, a] : [field, a]
}

function setPrefix(field: Field, prefix: string | undefined) {
	if (!prefix || prefixes[field] === prefix) return
	prefixes[field] = prefix
}

function baseValue(field: Field): number | undefined {
	const value = values[field]
	return value == null ? undefined : toBase(value, prefixes[field])
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
	return base == null ? undefined : fromBase(base, prefixes[target])
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
	<CalculatorWrapper
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
	</CalculatorWrapper>
</template>
