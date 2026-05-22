/** Ohm's Law: voltage = resistance * current */
export function ohmsLaw(voltage: number | undefined, resistance: number | undefined, current: number | undefined) {
	if (voltage && resistance) {
		return voltage / resistance
	} else if (voltage && current) {
		return voltage / current
	} else if (resistance && current) {
		return resistance * current
	} else {
		return undefined
	}
}

export function roundTo(value: number, precision: number): number {
	return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
}

const TAU = 2 * Math.PI

export type FrequencyTriple = {
	frequency: number
	period: number
	angularFrequency: number
}

/** f = 1/T, ω = 2πf — pass base-unit values; omit unknowns (priority: f, then T, then ω). */
export function frequencyTriple(
	frequency: number | undefined,
	period: number | undefined,
	angularFrequency: number | undefined
): FrequencyTriple | undefined {
	if (
		frequency == null &&
		period == null &&
		angularFrequency == null
	) {
		return undefined
	}

	const f =
		frequency != null
			? frequency
			: period != null
				? 1 / period
				: angularFrequency! / TAU

	return {
		frequency: f,
		period: 1 / f,
		angularFrequency: TAU * f
	}
}

/** Sum of part values in base units; missing parts count as 0. */
export function sumBaseParts(baseValues: (number | undefined)[]): number {
	return baseValues.reduce<number>((acc, v) => acc + (v ?? 0), 0)
}

/** Sum of 1/value for each defined part in base units; missing parts contribute 0. */
export function sumBaseReciprocals(
	baseValues: (number | undefined)[]
): number {
	return baseValues.reduce<number>(
		(acc, v) => acc + (v != null ? 1 / v : 0),
		0
	)
}

export function reactance(
	frequency: number | undefined,
	inductance: number | undefined,
	capacitance: number | undefined
): number | undefined {

	if (frequency && inductance) {
		return 2 * Math.PI * frequency * inductance
	} else if (frequency && capacitance) {
		return 1 / (2 * Math.PI * frequency * capacitance)
	} else {
		return undefined
	}
}
