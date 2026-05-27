<script setup lang="ts">
import Schematic from "~/assets/schematics/section-1-3.svg"
import { roundTo } from "~/utils/equations"
import { fromBase, toBase } from "~/utils/prefixes"
import { parseFrontmatter } from "comark"

import cs from "./cs.md?raw"
import en from "./en.md?raw"

const { locale, t } = useI18n()

const currentContent = computed(() => (locale.value === "cs" ? cs : en))
const title = computed(() =>
	String(parseFrontmatter(currentContent.value).data.title ?? "")
)

const PRECISION = 4

const values = reactive<Record<string, number | undefined>>({
	R1: undefined,
	R2: undefined,
	R3: undefined,
	R4: undefined,
	U: undefined
})

const prefixes = reactive<Record<string, string>>({
	R1: "-",
	R2: "-",
	R3: "-",
	R4: "-",
	U: "-"
})

const resultPrefix = ref("-")

function baseValue(field: keyof typeof values): number | undefined {
	const value = values[field]
	return value == null ? undefined : toBase(value, prefixes[field] ?? "-")
}

const resultValueBase = computed((): number | undefined => {
	const r1 = baseValue("R1")
	const r2 = baseValue("R2")
	const r3 = baseValue("R3")
	const r4 = baseValue("R4")
	const u = baseValue("U")
	if (r1 == null || r2 == null || r3 == null || r4 == null || u == null)
		return undefined
	// I = U / (R1 + (R2 * (R3 + R4))/(R2 + R3 + R4)))
	return roundTo(u / (r1 + (r2 * (r3 + r4)) / (r2 + r3 + r4)), PRECISION)
})

const displayResult = computed(() => {
	const base = resultValueBase.value
	return base == null
		? undefined
		: roundTo(fromBase(base, resultPrefix.value), PRECISION)
})

function setPrefix(field: string, prefix: string | undefined) {
	if (!prefix || prefixes[field] === prefix) return
	prefixes[field] = prefix
}
</script>

<template>
	<div class="flex gap-8 h-fit flex-col xl:flex-row">
		<CalcWrapper
			:title="title"
			:description="currentContent"
		>
			<div class="flex flex-col gap-4">
				<PrefixedInput
					:label="`${t('units.voltage.symbol')} O1 [${t('units.voltage.unit')}]`"
					:model-value="values.U"
					:prefix="prefixes.U"
					@update:model-value="values.U = $event"
					@update:prefix="setPrefix('U', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 1 [${t('units.resistance.unit')}]`"
					:model-value="values.R1"
					:prefix="prefixes.R1"
					@update:model-value="values.R1 = $event"
					@update:prefix="setPrefix('R1', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 2 [${t('units.resistance.unit')}]`"
					:model-value="values.R2"
					:prefix="prefixes.R2"
					@update:model-value="values.R2 = $event"
					@update:prefix="setPrefix('R2', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 3 [${t('units.resistance.unit')}]`"
					:model-value="values.R3"
					:prefix="prefixes.R3"
					@update:model-value="values.R3 = $event"
					@update:prefix="setPrefix('R3', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 4 [${t('units.resistance.unit')}]`"
					:model-value="values.R4"
					:prefix="prefixes.R4"
					@update:model-value="values.R4 = $event"
					@update:prefix="setPrefix('R4', $event)"
				/>

				<USeparator />

				<PrefixedInput
					v-model:prefix="resultPrefix"
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
