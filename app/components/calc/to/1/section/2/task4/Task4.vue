<script setup lang="ts">
import Schematic from "~/assets/schematics/section-2-4.svg"
import { roundTo } from "~/utils/equations"

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { t } = useI18n()

const { currentContent, title } = useLocalizedMarkdown({ cs, en })

const PRECISION = 4

type Field = "Ri" | "R1" | "R2" | "I" | "I_2"
const fields: Field[] = ["Ri", "R1", "R2", "I", "I_2"]
const { values, prefixes, setValue, setPrefix, baseValue, displayFromBase } =
	usePrefixedValues(fields)

const resultValueBase = computed((): number | undefined => {
	const ri = baseValue("Ri")
	const r1 = baseValue("R1")
	const r2 = baseValue("R2")
	const i = baseValue("I")
	if (ri == null || r1 == null || r2 == null || i == null) return undefined

	// $$
	// R_{i1} = \frac{R_i \times R_1}{R_i + R_1}
	// $$

	// $$
	// I_2 = I_i \times \frac{R_{i1}}{R_{i1} + R_2}
	// $$

	// const ri12 = ri + r1 + r2
	// const u2 = u * (r2 / ri12)

	const ri1 = (ri * r1) / (ri + r1)
	const i2 = i * (ri1 / (ri1 + r2))

	return roundTo(i2, PRECISION)
})

const displayResult = computed(() => {
	return displayFromBase("I_2", resultValueBase.value, PRECISION)
})
</script>

<template>
	<div class="flex gap-8 h-fit flex-col xl:flex-row">
		<CalcWrapper
			:title="title"
			:description="currentContent"
		>
			<div class="flex flex-col gap-4">
				<PrefixedInput
					:label="`${t('units.current.symbol')}i [${t('units.current.unit')}]`"
					:model-value="values.I"
					:prefix="prefixes.I"
					@update:model-value="setValue('I', $event)"
					@update:prefix="setPrefix('I', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')}i [${t('units.resistance.unit')}]`"
					:model-value="values.Ri"
					:prefix="prefixes.Ri"
					@update:model-value="setValue('Ri', $event)"
					@update:prefix="setPrefix('Ri', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 1 [${t('units.resistance.unit')}]`"
					:model-value="values.R1"
					:prefix="prefixes.R1"
					@update:model-value="setValue('R1', $event)"
					@update:prefix="setPrefix('R1', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 2 [${t('units.resistance.unit')}]`"
					:model-value="values.R2"
					:prefix="prefixes.R2"
					@update:model-value="setValue('R2', $event)"
					@update:prefix="setPrefix('R2', $event)"
				/>

				<USeparator />

				<PrefixedInput
					v-model:prefix="prefixes.I_2"
					:leading-label="`${t('result')}:`"
					:label="`${t('units.current.symbol')} [${t('units.current.unit')}]`"
					:placeholder="t('units.current.unit')"
					:model-value="displayResult"
					readonly
					variant="subtle"
				/>
			</div>
			<template #trailing>
				<Schematic
					class="xl:max-w-1/3 max-w-2/3 md:max-w-1/2 max-h-80"
				/>
			</template>
		</CalcWrapper>
	</div>
</template>
