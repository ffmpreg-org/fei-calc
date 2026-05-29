<script setup lang="ts">
import Schematic from "~/assets/schematics/section-1-3.svg"
import { roundTo } from "~/utils/equations"

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { t } = useI18n()

const { currentContent, title } = useLocalizedMarkdown({ cs, en })

const PRECISION = 4

type Field = "R1" | "R2" | "R3" | "R4" | "U" | "U_R4"
const fields: Field[] = ["R1", "R2", "R3", "R4", "U", "U_R4"]
const { values, prefixes, setValue, setPrefix, baseValue, displayFromBase } =
	usePrefixedValues(fields)

const resultValueBase = computed((): number | undefined => {
	const r1 = baseValue("R1")
	const r2 = baseValue("R2")
	const r3 = baseValue("R3")
	const r4 = baseValue("R4")
	const u = baseValue("U")
	if (r1 == null || r2 == null || r3 == null || r4 == null || u == null)
		return undefined

	// $$
	// R_{12} = R_1 + R_2, \quad R_{123} = \frac{R_{12} \times R_3}{R_{12} + R_3}, \quad R_{1234} = R_{123} + R_4
	// $$

	// $$
	// \quad U_4 = U_i \times \frac{R_4}{R_{1234}}
	// $$

	const r12 = r1 + r2
	const r123 = (r12 * r3) / (r12 + r3)
	const r1234 = r123 + r4
	const u4 = u * (r4 / r1234)

	return roundTo(u4, PRECISION)
})

const displayResult = computed(() => {
	return displayFromBase("U_R4", resultValueBase.value, PRECISION)
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
					:label="`${t('units.voltage.symbol')}i [${t('units.voltage.unit')}]`"
					:model-value="values.U"
					:prefix="prefixes.U"
					@update:model-value="setValue('U', $event)"
					@update:prefix="setPrefix('U', $event)"
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
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 3 [${t('units.resistance.unit')}]`"
					:model-value="values.R3"
					:prefix="prefixes.R3"
					@update:model-value="setValue('R3', $event)"
					@update:prefix="setPrefix('R3', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 4 [${t('units.resistance.unit')}]`"
					:model-value="values.R4"
					:prefix="prefixes.R4"
					@update:model-value="setValue('R4', $event)"
					@update:prefix="setPrefix('R4', $event)"
				/>

				<USeparator />

				<PrefixedInput
					v-model:prefix="prefixes.U_R4"
					:leading-label="`${t('result')}:`"
					:label="`${t('units.voltage.symbol')} [${t('units.voltage.unit')}]`"
					:placeholder="t('units.voltage.unit')"
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
