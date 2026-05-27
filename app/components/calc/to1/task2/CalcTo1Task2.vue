<script setup lang="ts">
import Schematic from "~/assets/schematics/section-1-2.svg"
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
	U_o1: undefined,
	U_o2: undefined,
	U_o3: undefined,
	R: undefined
})

const prefixes = reactive<Record<string, string>>({
	U_o1: "-",
	U_o2: "-",
	U_o3: "-",
	R: "-"
})

const resultPrefix = ref("-")

function baseValue(field: keyof typeof values): number | undefined {
	const value = values[field]
	return value == null ? undefined : toBase(value, prefixes[field] ?? "-")
}

const resultValueBase = computed((): number | undefined => {
	const u1 = baseValue("U_o1")
	const u2 = baseValue("U_o2")
	const u3 = baseValue("U_o3")
	const r = baseValue("R")
	if (u1 == null || u2 == null || u3 == null || r == null) return undefined
	return roundTo(Math.abs(u2 + u3 - u1) / r, PRECISION)
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
					:label="`U o1 [${t('units.voltage.unit')}]`"
					:model-value="values.U_o1"
					:prefix="prefixes.U_o1"
					@update:model-value="values.U_o1 = $event"
					@update:prefix="setPrefix('U_o1', $event)"
				/>
				<PrefixedInput
					:label="`U o2 [${t('units.voltage.unit')}]`"
					:model-value="values.U_o2"
					:prefix="prefixes.U_o2"
					@update:model-value="values.U_o2 = $event"
					@update:prefix="setPrefix('U_o2', $event)"
				/>
				<PrefixedInput
					:label="`U o3 [${t('units.voltage.unit')}]`"
					:model-value="values.U_o3"
					:prefix="prefixes.U_o3"
					@update:model-value="values.U_o3 = $event"
					@update:prefix="setPrefix('U_o3', $event)"
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
