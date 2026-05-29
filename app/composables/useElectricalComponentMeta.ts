import type { ComputedRef } from "vue"

export type ElectricalComponent = "resistor" | "capacitor" | "inductor"

const componentMeta = {
	resistor: {
		labelKey: "components.resistor",
		symbolKey: "units.resistance.symbol",
		unitKey: "units.resistance.unit",
		icon: "i-fei-resistor"
	},
	capacitor: {
		labelKey: "components.capacitor",
		symbolKey: "units.capacitance.symbol",
		unitKey: "units.capacitance.unit",
		icon: "i-fei-capacitor"
	},
	inductor: {
		labelKey: "components.inductor",
		symbolKey: "units.inductance.symbol",
		unitKey: "units.inductance.unit",
		icon: "i-fei-inductor"
	}
} as const

export function useElectricalComponentMeta<
	const Component extends ElectricalComponent
>(
	components: readonly Component[]
): {
	options: ComputedRef<
		Array<{
			value: Component
			label: string
			icon: string
		}>
	>
	labelOf: (component: Component) => string
	symbolOf: (component: Component) => string
	unitOf: (component: Component) => string
	iconOf: (component: Component) => string
} {
	const { t } = useI18n()

	function meta(component: Component) {
		return componentMeta[component]
	}

	function labelOf(component: Component) {
		return t(meta(component).labelKey)
	}

	function symbolOf(component: Component) {
		return t(meta(component).symbolKey)
	}

	function unitOf(component: Component) {
		return t(meta(component).unitKey)
	}

	function iconOf(component: Component) {
		return meta(component).icon
	}

	const options = computed(() =>
		components.map((component) => ({
			value: component,
			label: labelOf(component),
			icon: iconOf(component)
		}))
	)

	return {
		options,
		labelOf,
		symbolOf,
		unitOf,
		iconOf
	}
}
