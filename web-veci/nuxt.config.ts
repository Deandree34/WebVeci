// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Puerto del servidor de desarrollo (`npm run dev`).
  // `nuxi preview` no lo usa: acepta `--port` o la variable `PORT`.
  devServer: { port: 3001 },

  modules: ['@nuxt/fonts', '@nuxt/icon', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  // Auto-import de componentes:
  //   components/ui  -> <BButton>, <BCard>…  (design system, sin prefijo de carpeta)
  //   components/<x> -> <XPepito>            (componentes de dominio/compartidos)
  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/components', pathPrefix: true, ignore: ['ui/**'] }
  ],

  vite: {
    plugins: [tailwindcss()],
    // TanStack Query se importa desde plugins/layouts, fuera del grafo inicial:
    // pre-bundlearlo evita una recarga de página en la primera visita en dev.
    optimizeDeps: { include: ['@tanstack/vue-query'] }
  },

  // Tipografía:
  //   Display + Texto -> fuente del sistema, como Facebook (ver --font-text en bugatti-theme.css)
  //   Titular y línea de apoyo de los posts -> Plus Jakarta Sans 700 / 500 (--font-headline)
  //   Cita de las reseñas -> Lora cursiva (--font-quote)
  //   Mono -> Roboto Mono
  // @nuxt/fonts las descarga al compilar y las sirve desde /_nuxt/fonts (self-hosted)
  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', weights: [500, 700], styles: ['normal'], global: true },
      { name: 'Lora', weights: [500], styles: ['italic'], global: true },
      { name: 'Roboto Mono', weights: [400], styles: ['normal'], global: true }
    ]
  },

  // Iconos: Material Symbols (set de Google), servidos localmente desde
  // @iconify-json/material-symbols. Uso: <Icon name="material-symbols:home" />.
  //   - serverBundle: el set se sirve desde el endpoint local (sin API externa).
  //   - clientBundle.scan: pre-incluye los iconos usados literalmente en el bundle
  //     de cliente, evitando una petición de red en el primer render.
  icon: {
    serverBundle: { collections: ['material-symbols'] },
    clientBundle: { scan: true }
  },

  // `/home` fue la ruta original del shell social; ahora vive en `/`.
  routeRules: {
    '/home': { redirect: '/' }
  },

  runtimeConfig: {
    public: {
      // URL base del backend FastAPI (API v1). El backend vive en un proyecto aparte.
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/v1'
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'VECI',
      meta: [{ name: 'theme-color', content: '#121212' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48 64x64' },
        { rel: 'preload', as: 'image', href: '/veci_logo_claro.webp', type: 'image/webp' }
      ]
    }
  }
})
