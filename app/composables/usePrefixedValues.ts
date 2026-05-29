import { roundTo } from "~/utils/equations"
import { fromBase, toBase } from "~/utils/prefixes"

export function usePrefixedValues<const Field extends string>(
	fields: readonly Field[],
	options?: {
		defaultPrefix?: string
	}
): {
	values: Record<Field, number | undefined>
	prefixes: Record<Field, string>
	setValue: (field: Field, value: number | undefined) => void
	setPrefix: (field: Field, prefix: string | undefined) => void
	baseValue: (field: Field) => number | undefined
	displayFromBase: (
		field: Field,
		base: number | undefined,
		precision?: number
	) => number | undefined
} {
	const defaultPrefix = options?.defaultPrefix ?? "-"
	const values = reactive(
		Object.fromEntries(fields.map((field) => [field, undefined]))
	) as Record<Field, number | undefined>
	const prefixes = reactive(
		Object.fromEntries(fields.map((field) => [field, defaultPrefix]))
	) as Record<Field, string>

	function setValue(field: Field, value: number | undefined) {
		values[field] = value
	}

	function setPrefix(field: Field, prefix: string | undefined) {
		if (!prefix || prefixes[field] === prefix) return
		prefixes[field] = prefix
	}

	function baseValue(field: Field): number | undefined {
		const value = values[field]
		return value == null ? undefined : toBase(value, prefixes[field])
	}

	function displayFromBase(
		field: Field,
		base: number | undefined,
		precision = 4
	): number | undefined {
		return base == null
			? undefined
			: roundTo(fromBase(base, prefixes[field]), precision)
	}

	return {
		values,
		prefixes,
		setValue,
		setPrefix,
		baseValue,
		displayFromBase
	}
}
