<script setup>
import { cs, en } from "@nuxt/ui/locale"

const appConfig = useAppConfig()
const colorMode = useColorMode()

useHead({
	meta: computed(() => [
		{
			name: "theme-color",
			content:
				colorMode.value === "dark"
					? appConfig.app.themeColor.dark
					: appConfig.app.themeColor.light
		}
	])
})

const { locale, t } = useI18n()
const uiLocales = { cs, en }
const uiLocale = computed(() => uiLocales[locale.value])
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const { isSidebarOpen } = useSidebar()

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
		<NuxtPwaManifest />

		<UMain>
			<div class="flex flex-1">
				<USidebar
					v-model:open="isSidebarOpen"
					collapsible="icon"
					:style="{
						'--sidebar-width-icon': '4rem',
						'--sidebar-width': '18rem'
					}"
					:rail="true"
					:ui="{
						body: 'px-2',
						footer: 'p-2'
					}"
				>
					<template #default>
						<UNavigationMenu
							:items="navMenuItems"
							orientation="vertical"
							size="lg"
							:ui="{
								link: 'data-active:before:bg-primary-500/20 px-3 py-3 gap-2 overflow-hidden font-medium data-active:font-semibold',
								linkLeadingIcon: 'size-6',
								linkLabel: 'text-base',
								linkTrailing:
									'size-4 scale-200 items-center justify-center data-active:hover:bg-primary-400/10 hover:bg-neutral-400/10 rounded-sm',
								linkTrailingIcon: 'size-2'
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
								class="px-3 py-3 gap-2 min-w-full overflow-hidden text-base"
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
									<!-- <div class="flex items-center gap-2">
										<USwitch
											v-model="isSidebarOpen"
											@update:model-value="
												handleSidebarOpenChange($event)
											"
										/>
										<p class="text-sm text-muted">
											{{ t("sidebar.showSidebar") }}
										</p>
									</div> -->

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
