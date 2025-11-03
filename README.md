# AccountPlus Frontend (Vue 3 + Vite + Tailwind + DaisyUI, RTL)

A clean starter to clone the public-facing experience of **accountplus.ir**:
- Vue 3 + TypeScript + Vite
- TailwindCSS + DaisyUI (custom theme) + RTL
- Vue Router + Pinia
- Mock data & services (no backend required)

## Quick start

```bash
# 1) install
npm i

# 2) run dev
npm run dev

# 3) build
npm run build
npm run preview
```

## Folder structure

```
accountplus-vue/
├─ src/
│  ├─ assets/           # logo, fonts
│  ├─ components/       # UI building blocks
│  ├─ layouts/          # Default layout (navbar/footer)
│  ├─ mocks/            # JSON data for catalog/blog
│  ├─ pages/            # Route pages
│  ├─ router/           # Vue Router
│  ├─ services/         # API wrappers, utils, types
│  ├─ stores/           # Pinia stores (cart, ui, products)
│  ├─ styles/           # Tailwind entry
│  ├─ App.vue
│  └─ main.ts
├─ index.html
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ vite.config.ts
└─ package.json
```

## Notes
- The site is configured **RTL** with Persian fonts (`Vazirmatn`). 
- Theme: `accountplus` (DaisyUI). Toggle theme from the header.
- Replace mock data with your API later in `services/api.ts` and Pinia stores.
