import type { Ref } from "vue"

export function useRecentFields<const Field extends string>(
	initial: readonly [Field, Field]
): {
	lastEdited: Ref<[Field, Field]>
	markEdited: (field: Field) => void
} {
	const lastEdited: Ref<[Field, Field]> = shallowRef([initial[0], initial[1]])

	function markEdited(field: Field) {
		const [a, b] = lastEdited.value
		if (field === a) return
		lastEdited.value = field === b ? [b, a] : [field, a]
	}

	return {
		lastEdited,
		markEdited
	}
}
