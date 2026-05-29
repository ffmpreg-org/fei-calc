<script setup lang="ts">
import Schematic1 from "~/assets/schematics/section-1-1.svg"
import { roundTo } from "~/utils/equations"

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { t } = useI18n()

const { currentContent, title } = useLocalizedMarkdown({ cs, en })

const PRECISION = 4

type Field = "I_o1" | "I_o2" | "I_o3" | "R" | "U"
const fields: Field[] = ["I_o1", "I_o2", "I_o3", "R", "U"]
const { values, prefixes, setValue, setPrefix, baseValue, displayFromBase } =
	usePrefixedValues(fields)

const resultValueBase = computed((): number | undefined => {
	const i1 = baseValue("I_o1")
	const i2 = baseValue("I_o2")
	const i3 = baseValue("I_o3")
	const r = baseValue("R")
	if (i1 == null || i2 == null || i3 == null || r == null) return undefined
	return roundTo((i1 + i2 + i3) * r, PRECISION)
})

const displayResult = computed(() => {
	return displayFromBase("U", resultValueBase.value, PRECISION)
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
					:label="`I o1 [${t('units.current.unit')}]`"
					:model-value="values.I_o1"
					:prefix="prefixes.I_o1"
					@update:model-value="setValue('I_o1', $event)"
					@update:prefix="setPrefix('I_o1', $event)"
				/>
				<PrefixedInput
					:label="`I o2 [${t('units.current.unit')}]`"
					:model-value="values.I_o2"
					:prefix="prefixes.I_o2"
					@update:model-value="setValue('I_o2', $event)"
					@update:prefix="setPrefix('I_o2', $event)"
				/>
				<PrefixedInput
					:label="`I o3 [${t('units.current.unit')}]`"
					:model-value="values.I_o3"
					:prefix="prefixes.I_o3"
					@update:model-value="setValue('I_o3', $event)"
					@update:prefix="setPrefix('I_o3', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} [${t('units.resistance.unit')}]`"
					:model-value="values.R"
					:prefix="prefixes.R"
					@update:model-value="setValue('R', $event)"
					@update:prefix="setPrefix('R', $event)"
				/>
				<USeparator />
				<PrefixedInput
					v-model:prefix="prefixes.U"
					:leading-label="`${t('result')}:`"
					:label="`${t('units.voltage.symbol')} [${t('units.voltage.unit')}]`"
					:placeholder="t('units.voltage.unit')"
					:model-value="displayResult"
					readonly
					variant="subtle"
				/>
			</div>
			<template #trailing>
				<Schematic1
					class="xl:max-w-1/3 max-w-2/3 md:max-w-1/2 max-h-80"
				/>
			</template>
		</CalcWrapper>
	</div>
</template>
