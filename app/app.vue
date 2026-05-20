<script setup>
import { useLocalStorage } from "@vueuse/core"

const isSidebarOpen = useLocalStorage("isSidebarOpen", true)
</script>

<template>
	<UApp>
		<UMain>
			<div class="flex flex-1">
				<USidebar
					:open="isSidebarOpen"
					collapsible="icon"
				>
					<template #footer>
						<UButton
							:icon="
								isSidebarOpen
									? 'i-lucide-panel-left-close'
									: 'i-lucide-panel-left-open'
							"
							class="ml-auto"
							variant="ghost"
							color="neutral"
							@click="isSidebarOpen = !isSidebarOpen"
						/>
					</template>
				</USidebar>
				<NuxtPage />
			</div>
		</UMain>
	</UApp>
</template>
