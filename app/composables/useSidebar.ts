import { useLocalStorage } from "@vueuse/core"

const isSidebarOpen = useLocalStorage("isSidebarOpen", true)

export function useSidebar() {
	function toggleSidebar() {
		isSidebarOpen.value = !isSidebarOpen.value
	}

	return {
		isSidebarOpen,
		toggleSidebar
	}
}
