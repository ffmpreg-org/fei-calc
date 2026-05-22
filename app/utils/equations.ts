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
