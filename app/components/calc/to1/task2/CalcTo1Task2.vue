<script setup lang="ts">
import Schematic from "~/assets/schematics/section-1-2.svg"
import { roundTo } from "~/utils/equations"

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { t } = useI18n()

const { currentContent, title } = useLocalizedMarkdown({ cs, en })

const PRECISION = 4

type Field = "U_o1" | "U_o2" | "U_o3" | "R" | "I"
const fields: Field[] = ["U_o1", "U_o2", "U_o3", "R", "I"]
const { values, prefixes, setValue, setPrefix, baseValue, displayFromBase } =
	usePrefixedValues(fields)

const resultValueBase = computed((): number | undefined => {
	const u1 = baseValue("U_o1")
	const u2 = baseValue("U_o2")
	const u3 = baseValue("U_o3")
	const r = baseValue("R")
	if (u1 == null || u2 == null || u3 == null || r == null) return undefined
	return roundTo(Math.abs(u2 + u3 - u1) / r, PRECISION)
})

const displayResult = computed(() => {
	return displayFromBase("I", resultValueBase.value, PRECISION)
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
					:label="`U o1 [${t('units.voltage.unit')}]`"
					:model-value="values.U_o1"
					:prefix="prefixes.U_o1"
					@update:model-value="setValue('U_o1', $event)"
					@update:prefix="setPrefix('U_o1', $event)"
				/>
				<PrefixedInput
					:label="`U o2 [${t('units.voltage.unit')}]`"
					:model-value="values.U_o2"
					:prefix="prefixes.U_o2"
					@update:model-value="setValue('U_o2', $event)"
					@update:prefix="setPrefix('U_o2', $event)"
				/>
				<PrefixedInput
					:label="`U o3 [${t('units.voltage.unit')}]`"
					:model-value="values.U_o3"
					:prefix="prefixes.U_o3"
					@update:model-value="setValue('U_o3', $event)"
					@update:prefix="setPrefix('U_o3', $event)"
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
					v-model:prefix="prefixes.I"
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
