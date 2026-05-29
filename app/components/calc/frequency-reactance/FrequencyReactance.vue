<script setup lang="ts">
import {
	frequencyTriple,
	reactance as calcReactance,
	roundTo
} from "~/utils/equations"
import { fromBase, toBase } from "~/utils/prefixes"

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { t } = useI18n()

const { currentContent, title } = useLocalizedMarkdown({ cs, en })

type Field = "frequency" | "period" | "angularFrequency"
const fields: Field[] = ["frequency", "period", "angularFrequency"]

const PRECISION = 4

const prefixed = usePrefixedValues(fields)
const { values, prefixes, setPrefix, baseValue } = prefixed
const recent = useRecentFields<Field>(["frequency", "period"])
const { lastEdited } = recent

function setValue(field: Field, value: number | undefined) {
	prefixed.setValue(field, value)
	recent.markEdited(field)
}

function toDisplay(field: Field, base: number): number | undefined {
	return prefixed.displayFromBase(field, base, PRECISION)
}

function filledFields(): Field[] {
	return fields.filter((f) => values[f] != null)
}

function isDerivedField(field: Field): boolean {
	const filled = filledFields()
	if (filled.length === 0) return false
	if (filled.length === 1) return field !== filled[0]
	if (filled.length === 2) return !filled.includes(field)
	return field !== lastEdited.value[0]
}

const display = computed(() => {
	const filled = filledFields()
	const out = Object.fromEntries(fields.map((f) => [f, undefined])) as Record<
		Field,
		number | undefined
	>

	if (filled.length === 0) return out

	const anchorOnly =
		filled.length === 1
			? filled[0]!
			: filled.length === 3
				? lastEdited.value[0]
				: null

	const triple = frequencyTriple(
		(anchorOnly == null || anchorOnly === "frequency") &&
			values.frequency != null
			? baseValue("frequency")
			: undefined,
		(anchorOnly == null || anchorOnly === "period") && values.period != null
			? baseValue("period")
			: undefined,
		(anchorOnly == null || anchorOnly === "angularFrequency") &&
			values.angularFrequency != null
			? baseValue("angularFrequency")
			: undefined
	)
	if (!triple) return out

	for (const field of fields) {
		const useUserValue =
			anchorOnly != null ? field === anchorOnly : values[field] != null
		out[field] = useUserValue
			? values[field]
			: toDisplay(field, triple[field])
	}
	return out
})

const inputs = computed(() =>
	fields.map((field) => ({
		field,
		label: `${t(`units.${field}.name`)} [${t(`units.${field}.unit`)}]`,
		placeholder: t(`units.${field}.unit`)
	}))
)

type ReactanceComponent = "capacitor" | "inductor"
const {
	options: components,
	symbolOf,
	unitOf
} = useElectricalComponentMeta(["capacitor", "inductor"] as const)

const selectedComponent = ref<ReactanceComponent>("capacitor")

const componentValue = ref<number | undefined>(undefined)
const componentPrefix = ref("-")

function setComponentValue(value: number | undefined) {
	componentValue.value = value
}

const reactancePrefix = ref("-")

const reactanceValueBase = computed((): number | undefined => {
	const f = display.value.frequency
	if (f == null || componentValue.value == null) return undefined

	const fBase = toBase(f, prefixes.frequency)
	const componentBase = toBase(componentValue.value, componentPrefix.value)

	if (selectedComponent.value === "capacitor") {
		return calcReactance(fBase, undefined, componentBase)
	}
	return calcReactance(fBase, componentBase, undefined)
})

const reactanceDisplay = computed(() => {
	const base = reactanceValueBase.value
	return base == null
		? undefined
		: roundTo(fromBase(base, reactancePrefix.value), PRECISION)
})
</script>

<template>
	<CalcWrapper
		:title="title"
		:description="currentContent"
	>
		<div class="flex gap-x-4 gap-y-2 flex-wrap items-center">
			<PrefixedInput
				v-for="input in inputs"
				:key="input.field"
				:label="input.label"
				orientation="vertical"
				:model-value="display[input.field]"
				:prefix="prefixes[input.field]"
				:placeholder="input.placeholder"
				:variant="
					isDerivedField(input.field) && display[input.field] != null
						? 'subtle'
						: 'outline'
				"
				input-class="max-w-32 w-full"
				@update:model-value="setValue(input.field, $event)"
				@update:prefix="setPrefix(input.field, $event)"
			/>
		</div>
		<div class="flex gap-x-4 gap-y-2 flex-wrap items-center">
			<LabeledInput
				:label="t('component')"
				orientation="vertical"
			>
				<USelect
					v-model="selectedComponent"
					:items="components"
					class="min-w-40"
					:ui="{
						item: 'items-center',
						itemLeadingIcon: 'size-8',
						content: 'min-w-fit'
					}"
					:icon="
						components.find((c) => c.value === selectedComponent)
							?.icon
					"
				/>
			</LabeledInput>
			<PrefixedInput
				v-model:prefix="componentPrefix"
				orientation="vertical"
				:label="`${symbolOf(selectedComponent)} [${unitOf(selectedComponent)}]`"
				:placeholder="unitOf(selectedComponent)"
				:model-value="componentValue"
				@update:model-value="setComponentValue"
			/>
		</div>
		<USeparator />
		<PrefixedInput
			v-model:prefix="reactancePrefix"
			:leading-label="`${t('result')}:`"
			:label="`X [${t('units.resistance.unit')}]`"
			:placeholder="t('units.resistance.unit')"
			:model-value="reactanceDisplay"
			readonly
			variant="subtle"
		/>
	</CalcWrapper>
</template>
