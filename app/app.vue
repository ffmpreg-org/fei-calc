<script setup>
import { useLocalStorage } from "@vueuse/core"
import * as uiLocales from "@nuxt/ui/locale"

const { locale, t } = useI18n()
const uiLocale = computed(() => uiLocales[locale.value])
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const isSidebarOpen = useLocalStorage("isSidebarOpen", true)

function handleSidebarOpenChange(value) {
	isSidebarOpen.value = value
}

function handleLocaleChange(value) {
	router.push(switchLocalePath(value))
}

const navMenuItems = computed(() => [
	{
		label: t("pages.home"),
		icon: "i-lucide-home",
		href: "/"
	},
	{
		label: t("pages.to"),
		icon: "i-lucide-book-text",
		href: "/to",
		children: [
			{
				label: t("pages.to-1"),
				href: "/to/to-1"
			},
			{
				label: t("pages.to-2"),
				href: "/to/to-2"
			}
		]
	},
	{
		label: t("pages.general"),
		icon: "i-lucide-calculator",
		href: "/general"
	}
])
</script>

<template>
	<UApp :locale="uiLocale">
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
								link: 'data-active:before:bg-primary-500/20 px-4 py-3 gap-2 min-w-14 overflow-hidden font-medium data-active:font-semibold',
								linkLeadingIcon: 'size-6',
								linkLabel: 'text-base'
							}"
							:popover="true"
							:arrow="true"
							:collapsed="!isSidebarOpen"
						/>
					</template>
					<template #footer>
						<UPopover
							:ui="{
								content: 'p-3 min-w-sm'
							}"
						>
							<UButton
								variant="ghost"
								color="neutral"
								icon="i-lucide-menu"
								class="px-4 py-3 gap-2 min-w-full overflow-hidden text-base"
								:ui="{
									leadingIcon: 'size-6'
								}"
							>
								<template v-if="isSidebarOpen">{{
									t("sidebar.options")
								}}</template>
							</UButton>
							<template #content>
								<div class="flex gap-3 flex-col">
									<div class="flex items-center gap-2">
										<USwitch
											v-model="isSidebarOpen"
											@update:model-value="
												handleSidebarOpenChange($event)
											"
										/>
										<p class="text-sm text-muted">
											{{ t("sidebar.showSidebar") }}
										</p>
									</div>

									<div class="flex items-center gap-2">
										<!-- <USelect
											v-model="theme"
											:items="themeOptions"
											icon="i-lucide-palette"
											@update:model-value="
												handleThemeChange($event)
											"
											class="min-w-52"
										/> -->
										<UColorModeSelect class="min-w-52" />
										<p class="text-sm text-muted">
											{{ t("sidebar.theme.label") }}
										</p>
									</div>

									<div class="flex items-center gap-2">
										<ULocaleSelect
											:model-value="locale"
											:locales="[
												uiLocales.en,
												uiLocales.cs
											]"
											class="min-w-52"
											@update:model-value="
												handleLocaleChange($event)
											"
										/>
										<p class="text-sm text-muted">
											{{ t("sidebar.language") }}
										</p>
									</div>
								</div>
							</template>
						</UPopover>
					</template>
				</USidebar>
				<NuxtPage />
			</div>
		</UMain>
	</UApp>
</template>
