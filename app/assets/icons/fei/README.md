# FEI custom icons

Place app-owned SVG icons in this directory to expose them through Nuxt UI and `@nuxt/icon`.

## Naming

- Use one icon per file.
- Use lowercase kebab-case filenames only.
- `resistor.svg` becomes `i-fei-resistor`.
- `capacitor.svg` becomes `i-fei-capacitor`.
- `inductor.svg` becomes `i-fei-inductor`.

Mixed-case or non-kebab-case filenames are not part of the supported contract.

## SVG authoring

- Build icons as monochrome UI glyphs.
- Prefer `stroke="currentColor"` and/or `fill="currentColor"`.
- Keep a clean `viewBox`.
- Omit fixed `width` and `height` when possible.
- Avoid gradients, embedded rasters, and hardcoded presentation attributes that block recoloring.

Multicolor artwork is intentionally unsupported for this collection unless explicitly approved later.

## Usage

Use the generated names anywhere the app already accepts Nuxt UI icon names.

```vue
<UIcon name="i-fei-resistor" class="size-5 text-primary" />
<UButton icon="i-fei-resistor" label="Sample" />
```

```ts
const items = [
	{ icon: "i-fei-resistor", label: "Resistance" }
]
```
