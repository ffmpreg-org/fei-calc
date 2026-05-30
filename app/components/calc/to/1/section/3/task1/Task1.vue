<script setup lang="ts">
import Schematic1 from "~/assets/schematics/section-2-1.svg"
import Schematic2 from "~/assets/schematics/section-2-2.svg"
import { roundTo } from "~/utils/equations"

import cs from "./cs.md?raw"
import en from "./en.md?raw"
import task1Cs from "../../2/task1/cs.md?raw"
import task1En from "../../2/task1/en.md?raw"
import task2Cs from "../../2/task2/cs.md?raw"
import task2En from "../../2/task2/en.md?raw"

const { t } = useI18n()

const { title } = useLocalizedMarkdown({ cs, en })
const { currentContent: task1Content } = useLocalizedMarkdown({
	cs: task1Cs,
	en: task1En
})
const { currentContent: task2Content } = useLocalizedMarkdown({
	cs: task2Cs,
	en: task2En
})

const PRECISION = 4
const selectedVariant = ref<string | number>("task-1")

type VoltageField = "R1" | "R2" | "R3" | "R4" | "U" | "U_R4"
const voltageFields: VoltageField[] = ["R1", "R2", "R3", "R4", "U", "U_R4"]
const {
	values: voltageValues,
	prefixes: voltagePrefixes,
	setValue: setVoltageValue,
	setPrefix: setVoltagePrefix,
	baseValue: voltageBaseValue,
	displayFromBase: displayVoltageFromBase
} = usePrefixedValues(voltageFields)

const voltageResultValueBase = computed((): number | undefined => {
	const r1 = voltageBaseValue("R1")
	const r2 = voltageBaseValue("R2")
	const r3 = voltageBaseValue("R3")
	const r4 = voltageBaseValue("R4")
	const u = voltageBaseValue("U")
	if (r1 == null || r2 == null || r3 == null || r4 == null || u == null)
		return undefined

	const r12 = r1 + r2
	const r123 = (r12 * r3) / (r12 + r3)
	const r1234 = r123 + r4
	const u4 = u * (r4 / r1234)

	return roundTo(u4, PRECISION)
})

const displayVoltageResult = computed(() => {
	return displayVoltageFromBase(
		"U_R4",
		voltageResultValueBase.value,
		PRECISION
	)
})

type CurrentField = "R1" | "R2" | "R3" | "R4" | "I" | "I_R4"
const currentFields: CurrentField[] = ["R1", "R2", "R3", "R4", "I", "I_R4"]
const {
	values: currentValues,
	prefixes: currentPrefixes,
	setValue: setCurrentValue,
	setPrefix: setCurrentPrefix,
	baseValue: currentBaseValue,
	displayFromBase: displayCurrentFromBase
} = usePrefixedValues(currentFields)

const currentResultValueBase = computed((): number | undefined => {
	const r1 = currentBaseValue("R1")
	const r2 = currentBaseValue("R2")
	const r3 = currentBaseValue("R3")
	const r4 = currentBaseValue("R4")
	const i = currentBaseValue("I")
	if (r1 == null || r2 == null || r3 == null || r4 == null || i == null)
		return undefined

	const r23 = (r2 * r3) / (r2 + r3)
	const r123 = r1 + r23
	const i4 = i * (r123 / (r123 + r4))

	return roundTo(i4, PRECISION)
})

const displayCurrentResult = computed(() => {
	return displayCurrentFromBase(
		"I_R4",
		currentResultValueBase.value,
		PRECISION
	)
})
</script>

<template>
	<div class="flex gap-8 h-fit flex-col xl:flex-row">
		<CalcWrapper
			v-model="selectedVariant"
			:title="title"
			:tabs="[
				{
					label: `${t('variant')} 1`,
					value: 'task-1',
					description: task1Content
				},
				{
					label: `${t('variant')} 2`,
					value: 'task-2',
					description: task2Content,
					slot: 'task-2'
				}
			]"
		>
			<div class="flex flex-col gap-4">
				<PrefixedInput
					:label="`${t('units.voltage.symbol')}i [${t('units.voltage.unit')}]`"
					:model-value="voltageValues.U"
					:prefix="voltagePrefixes.U"
					@update:model-value="setVoltageValue('U', $event)"
					@update:prefix="setVoltagePrefix('U', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 1 [${t('units.resistance.unit')}]`"
					:model-value="voltageValues.R1"
					:prefix="voltagePrefixes.R1"
					@update:model-value="setVoltageValue('R1', $event)"
					@update:prefix="setVoltagePrefix('R1', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 2 [${t('units.resistance.unit')}]`"
					:model-value="voltageValues.R2"
					:prefix="voltagePrefixes.R2"
					@update:model-value="setVoltageValue('R2', $event)"
					@update:prefix="setVoltagePrefix('R2', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 3 [${t('units.resistance.unit')}]`"
					:model-value="voltageValues.R3"
					:prefix="voltagePrefixes.R3"
					@update:model-value="setVoltageValue('R3', $event)"
					@update:prefix="setVoltagePrefix('R3', $event)"
				/>
				<PrefixedInput
					:label="`${t('units.resistance.symbol')} 4 [${t('units.resistance.unit')}]`"
					:model-value="voltageValues.R4"
					:prefix="voltagePrefixes.R4"
					@update:model-value="setVoltageValue('R4', $event)"
					@update:prefix="setVoltagePrefix('R4', $event)"
				/>

				<USeparator />

				<PrefixedInput
					v-model:prefix="voltagePrefixes.U_R4"
					:leading-label="`${t('result')}:`"
					:label="`${t('units.voltage.symbol')} [${t('units.voltage.unit')}]`"
					:placeholder="t('units.voltage.unit')"
					:model-value="displayVoltageResult"
					readonly
					variant="subtle"
				/>
			</div>

			<template #task-2>
				<div class="flex flex-col gap-4">
					<PrefixedInput
						:label="`${t('units.current.symbol')}i [${t('units.current.unit')}]`"
						:model-value="currentValues.I"
						:prefix="currentPrefixes.I"
						@update:model-value="setCurrentValue('I', $event)"
						@update:prefix="setCurrentPrefix('I', $event)"
					/>
					<PrefixedInput
						:label="`${t('units.resistance.symbol')} 1 [${t('units.resistance.unit')}]`"
						:model-value="currentValues.R1"
						:prefix="currentPrefixes.R1"
						@update:model-value="setCurrentValue('R1', $event)"
						@update:prefix="setCurrentPrefix('R1', $event)"
					/>
					<PrefixedInput
						:label="`${t('units.resistance.symbol')} 2 [${t('units.resistance.unit')}]`"
						:model-value="currentValues.R2"
						:prefix="currentPrefixes.R2"
						@update:model-value="setCurrentValue('R2', $event)"
						@update:prefix="setCurrentPrefix('R2', $event)"
					/>
					<PrefixedInput
						:label="`${t('units.resistance.symbol')} 3 [${t('units.resistance.unit')}]`"
						:model-value="currentValues.R3"
						:prefix="currentPrefixes.R3"
						@update:model-value="setCurrentValue('R3', $event)"
						@update:prefix="setCurrentPrefix('R3', $event)"
					/>
					<PrefixedInput
						:label="`${t('units.resistance.symbol')} 4 [${t('units.resistance.unit')}]`"
						:model-value="currentValues.R4"
						:prefix="currentPrefixes.R4"
						@update:model-value="setCurrentValue('R4', $event)"
						@update:prefix="setCurrentPrefix('R4', $event)"
					/>

					<USeparator />

					<PrefixedInput
						v-model:prefix="currentPrefixes.I_R4"
						:leading-label="`${t('result')}:`"
						:label="`${t('units.current.symbol')} [${t('units.current.unit')}]`"
						:placeholder="t('units.current.unit')"
						:model-value="displayCurrentResult"
						readonly
						variant="subtle"
					/>
				</div>
			</template>

			<template #trailing>
				<Schematic1
					v-if="selectedVariant === 'task-1'"
					class="xl:max-w-1/3 max-w-2/3 md:max-w-1/2 max-h-80"
				/>
				<Schematic2
					v-else
					class="xl:max-w-1/3 max-w-2/3 md:max-w-1/2 max-h-80"
				/>
			</template>
		</CalcWrapper>
	</div>
</template>
