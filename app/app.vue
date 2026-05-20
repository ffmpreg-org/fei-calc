<script setup>
import { useLocalStorage } from "@vueuse/core"

const isSidebarOpen = useLocalStorage("isSidebarOpen", true)

const navMenuItems = [
	{
		label: "Home",
		icon: "i-lucide-home",
		href: "/"
	},
	{
		label: "TO",
		icon: "i-lucide-book-text",
		children: [
			{
				label: "TO I",
				href: "/to-1"
			},
			{
				label: "TO II",
				href: "/to-2"
			}
		]
	},
	{
		label: "General",
		icon: "i-lucide-calculator",
		href: "/general"
	}
]
</script>

<template>
	<UApp>
		<UMain>
			<div class="flex flex-1">
				<USidebar
					v-model:open="isSidebarOpen"
					collapsible="icon"
					:style="{
						'--sidebar-width-icon': '5.5rem'
					}"
					:rail="true"
					:ui="{}"
				>
					<template #default>
						<UNavigationMenu
							:items="navMenuItems"
							orientation="vertical"
							size="lg"
							:ui="{
								link: 'data-active:before:bg-primary-500/20 px-4 py-3 gap-2 min-w-14 overflow-hidden',
								linkLeadingIcon: 'size-6',
								linkLabel: 'text-base font-medium'
							}"
							:popover="true"
							:arrow="true"
							:collapsed="!isSidebarOpen"
						/>
					</template>
					<!-- <template #footer>
						<UButton
							:icon="
								isSidebarOpen
									? 'i-lucide-panel-left-close'
									: 'i-lucide-panel-left-open'
							"
							size="lg"
							variant="ghost"
							color="neutral"
							@click="isSidebarOpen = !isSidebarOpen"
						/>
					</template> -->
				</USidebar>
				<NuxtPage />
			</div>
		</UMain>
	</UApp>
</template>
