<script setup lang="ts">
import type { ElectricalComponent } from "~/composables/useElectricalComponentMeta"
import { roundTo, sumBaseParts, sumBaseReciprocals } from "~/utils/equations"
import { fromBase, toBase } from "~/utils/prefixes"

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { t } = useI18n()

const { title, body } = useLocalizedMarkdown({ cs, en })
const {
	options: components,
	symbolOf,
	unitOf
} = useElectricalComponentMeta(["resistor", "capacitor", "inductor"] as const)

const MAX_EQUATION_TERMS = 8

function formatEquationTerm(sym: string, index: number, reciprocal: boolean) {
	const sub = `${sym}_{${index}}`
	return reciprocal ? `\\frac{1}{${sub}}` : sub
}

function buildEquationTerms(sym: string, count: number, reciprocal: boolean) {
	if (count <= MAX_EQUATION_TERMS) {
		return Array.from({ length: count }, (_, i) =>
			formatEquationTerm(sym, i + 1, reciprocal)
		).join(" + ")
	}
	const terms = Array.from({ length: MAX_EQUATION_TERMS }, (_, i) =>
		formatEquationTerm(sym, i + 1, reciprocal)
	)
	if (count > MAX_EQUATION_TERMS) {
		terms.push("\\cdots", formatEquationTerm(sym, count, reciprocal))
	}
	return terms.join(" + ")
}

const equationLatex = computed(() => {
	const sym = symbolOf(selectedComponent.value)
	const terms = buildEquationTerms(sym, partCount.value, false)
	const recipTerms = buildEquationTerms(sym, partCount.value, true)
	const eq = `${sym}`

	if (selectedConfiguration.value === "series") {
		if (
			selectedComponent.value === "resistor" ||
			selectedComponent.value === "inductor"
		) {
			return `${eq} = ${terms}`
		}
		if (selectedComponent.value === "capacitor") {
			return `\\frac{1}{${eq}} = ${recipTerms}`
		}
	}
	if (selectedConfiguration.value === "parallel") {
		if (
			selectedComponent.value === "resistor" ||
			selectedComponent.value === "inductor"
		) {
			return `\\frac{1}{${eq}} = ${recipTerms}`
		}
		if (selectedComponent.value === "capacitor") {
			return `${eq} = ${terms}`
		}
	}
	return ""
})

const description = computed(() => {
	const eq = equationLatex.value
	if (!eq) return body.value
	return `${body.value}\n\n$$\n${eq}\n$$`
})

const selectedComponent = ref<ElectricalComponent>("resistor")

const selectedConfiguration = ref<string>("series")

const partCount = ref(2)

const partValues = ref<(number | undefined)[]>([undefined, undefined])
const partPrefixes = ref<string[]>(["-", "-"])
const outputPrefix = ref("-")

const decrementPartCount = () => {
	if (partCount.value > 2) {
		partCount.value--
		partValues.value = partValues.value.slice(0, partCount.value)
		partPrefixes.value = partPrefixes.value.slice(0, partCount.value)
	}
}

const incrementPartCount = () => {
	partValues.value = [...partValues.value, undefined]
	partPrefixes.value = [...partPrefixes.value, "-"]
	partCount.value++
}

function setPartValue(index: number, value: number | undefined) {
	partValues.value[index] = value
}

function setPartPrefix(index: number, prefix: string | undefined) {
	if (!prefix || partPrefixes.value[index] === prefix) return
	partPrefixes.value[index] = prefix
}

function basePartValue(index: number): number | undefined {
	const value = partValues.value[index]
	return value == null
		? undefined
		: toBase(value, partPrefixes.value[index] ?? "-")
}

const basePartValuesList = computed(() =>
	partValues.value.map((_, i) => basePartValue(i))
)

// Series: R/L sum; 1/C = sum of reciprocals
// Parallel: 1/R, 1/L = sum of reciprocals; C sums
const outputValueBase = computed(() => {
	const bases = basePartValuesList.value
	if (selectedConfiguration.value === "series") {
		if (
			selectedComponent.value === "resistor" ||
			selectedComponent.value === "inductor"
		) {
			return roundTo(sumBaseParts(bases), 4)
		}
		if (selectedComponent.value === "capacitor") {
			return roundTo(1 / sumBaseReciprocals(bases), 4)
		}
	} else if (selectedConfiguration.value === "parallel") {
		if (
			selectedComponent.value === "resistor" ||
			selectedComponent.value === "inductor"
		) {
			return roundTo(1 / sumBaseReciprocals(bases), 4)
		}
		if (selectedComponent.value === "capacitor") {
			return roundTo(sumBaseParts(bases), 4)
		}
	}
	return undefined
})

const displayOutput = computed(() => {
	const base = outputValueBase.value
	return base == null
		? undefined
		: roundTo(fromBase(base, outputPrefix.value), 4)
})
</script>

<template>
	<CalcWrapper
		:title="title"
		:description="description"
		class="series-parallel"
	>
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
			<LabeledInput
				:label="t('configuration')"
				orientation="vertical"
			>
				<UFieldGroup class="max-w-42 w-full">
					<UButton
						:label="t('configurations.series')"
						:color="
							selectedConfiguration === 'series'
								? 'primary'
								: 'neutral'
						"
						variant="subtle"
						class="flex-1"
						@click="selectedConfiguration = 'series'"
					/>
					<UButton
						:label="t('configurations.parallel')"
						:color="
							selectedConfiguration === 'parallel'
								? 'primary'
								: 'neutral'
						"
						variant="subtle"
						class="flex-1"
						@click="selectedConfiguration = 'parallel'"
					/>
				</UFieldGroup>
			</LabeledInput>
			<LabeledInput
				:label="`${t('count')} (${partCount})`"
				orientation="vertical"
			>
				<div class="flex gap-2 items-center">
					<UButton
						icon="i-lucide-minus"
						size="sm"
						variant="subtle"
						color="neutral"
						@click="decrementPartCount"
					/>
					<UButton
						icon="i-lucide-plus"
						size="sm"
						variant="subtle"
						color="neutral"
						@click="incrementPartCount"
					/>
				</div>
			</LabeledInput>
		</div>
		<div
			class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-2 flex-wrap items-center justify-between"
		>
			<PrefixedInput
				v-for="i in partCount"
				:key="i"
				:label="`${symbolOf(selectedComponent)}${i}`"
				:model-value="partValues[i - 1]"
				:prefix="partPrefixes[i - 1]"
				:placeholder="unitOf(selectedComponent)"
				input-class="flex-1 max-w-42"
				class="w-full"
				@update:model-value="setPartValue(i - 1, $event)"
				@update:prefix="setPartPrefix(i - 1, $event)"
			/>
		</div>
		<USeparator />
		<PrefixedInput
			v-model:prefix="outputPrefix"
			:leading-label="`${t('result')}:`"
			:label="`${symbolOf(selectedComponent)} [${unitOf(selectedComponent)}]`"
			:model-value="displayOutput"
			:placeholder="unitOf(selectedComponent)"
			readonly
			variant="subtle"
		/>
	</CalcWrapper>
</template>
