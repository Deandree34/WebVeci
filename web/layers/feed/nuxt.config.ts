// Layer del dominio feed: componentes, datos (api/queries) y estado de cliente (stores).
// Nuxt registra automáticamente cada carpeta de `layers/`; desde fuera se importa con `#layers/feed/…`.
// Ver docs/architecture.md §3.1.
export default defineNuxtConfig({
  // El nombre sale solo del archivo (<FeedPostCard>). Ruta relativa al layer: aquí `~` apuntaría a `app/` de la raíz.
  components: [
    { path: 'components', pathPrefix: false, extensions: ['vue'] }
  ]
})
