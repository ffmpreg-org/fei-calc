<script setup lang="ts">
import Schematic1 from "~/assets/schematics/section-1-1.svg"
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
	I_o1: undefined,
	I_o2: undefined,
	I_o3: undefined,
	R: undefined
})

const prefixes = reactive<Record<string, string>>({
	I_o1: "-",
	I_o2: "-",
	I_o3: "-",
	R: "-"
})

const resultPrefix = ref("-")

function baseValue(field: keyof typeof values): number | undefined {
	const value = values[field]
	return value == null ? undefined : toBase(value, prefixes[field] ?? "-")
}

const resultValueBase = computed((): number | undefined => {
	const i1 = baseValue("I_o1")
	const i2 = baseValue("I_o2")
	const i3 = baseValue("I_o3")
	const r = baseValue("R")
	if (i1 == null || i2 == null || i3 == null || r == null) return undefined
	return roundTo((i1 + i2 + i3) * r, PRECISION)
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
					:label="`I o1 [${t('units.current.unit')}]`"
					:model-value="values.I_o1"
					:prefix="prefixes.I_o1"
					@update:model-value="values.I_o1 = $event"
					@update:prefix="setPrefix('I_o1', $event)"
				/>
				<PrefixedInput
					:label="`I o2 [${t('units.current.unit')}]`"
					:model-value="values.I_o2"
					:prefix="prefixes.I_o2"
					@update:model-value="values.I_o2 = $event"
					@update:prefix="setPrefix('I_o2', $event)"
				/>
				<PrefixedInput
					:label="`I o3 [${t('units.current.unit')}]`"
					:model-value="values.I_o3"
					:prefix="prefixes.I_o3"
					@update:model-value="values.I_o3 = $event"
					@update:prefix="setPrefix('I_o3', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} [${t('units.resistance.unit')}]`"
					:model-value="values.R"
					:prefix="prefixes.R"
					@update:model-value="values.R = $event"
					@update:prefix="setPrefix('R', $event)"
				/>
				<USeparator />
				<PrefixedInput
					v-model:prefix="resultPrefix"
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
