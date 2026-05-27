<script setup>
// /home/vitroid/Documents/GitHub/fei-calc/app/assets/schematics/section-1-1.svg
import Schematic1 from "~/assets/schematics/section-1-1.svg"

const { t } = useI18n()
</script>

<template>
	<PageWrapper
		:title="`${t('section')} 1`"
		:breadcrumbs="[
			{ to: '/', icon: 'i-lucide-home' },
			{ to: '/to', icon: 'i-lucide-book-text', label: t('pages.to') },
			{ to: '/to/1', label: t('pages.to-1') }
		]"
	>
		<CalcWrapper :title="`${t('task')} 1`">
			<div class="flex">
				<div class="flex-1 flex flex-col gap-2">
					<PrefixedInput
						:label="`I o1 [${t('units.current.unit')}]`"
						:model-value="10"
					/>
					<PrefixedInput
						:label="`I o2 [${t('units.current.unit')}]`"
						:model-value="10"
					/>
					<PrefixedInput
						:label="`I o3 [${t('units.current.unit')}]`"
						:model-value="10"
					/>
					<PrefixedInput
						:label="`${t('units.resistance.symbol')} [${t('units.resistance.unit')}]`"
						:model-value="10"
					/>
					<USeparator />
					<PrefixedInput
						:leading-label="`${t('result')}:`"
						:label="`${t('units.voltage.symbol')} [${t('units.voltage.unit')}]`"
						:model-value="10"
						readonly
					/>
				</div>
				<Schematic1 class="max-w-96" />
			</div>
		</CalcWrapper>
	</PageWrapper>
</template>
