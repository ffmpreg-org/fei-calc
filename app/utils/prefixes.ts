export const PREFIXES = ["p", "n", "µ", "m", "-", "k", "M", "G"]

export const PREFIX_FACTORS: Record<string, number> = {
	"-": 1,
	p: 1e-12,
	n: 1e-9,
	"µ": 1e-6,
	m: 1e-3,
	k: 1e3,
	M: 1e6,
	G: 1e9,
}

export function prefixFactor(prefix: string): number {
	return PREFIX_FACTORS[prefix] ?? 1
}

export function toBase(value: number, prefix: string): number {
	return value * prefixFactor(prefix)
}

export function fromBase(value: number, prefix: string): number {
	return value / prefixFactor(prefix)
}
