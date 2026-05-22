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
