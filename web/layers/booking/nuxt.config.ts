// Layer del dominio booking. Desde fuera se importa con `#layers/booking/…`; ver docs/architecture.md §3.1.
export default defineNuxtConfig({
  // El nombre sale solo del archivo. Ruta relativa al layer: aquí `~` apuntaría a `app/` de la raíz.
  components: [
    { path: 'components', pathPrefix: false, extensions: ['vue'] }
  ]
})
