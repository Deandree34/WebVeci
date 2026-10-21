<script setup lang="ts">
const search = ref('')

/* En tablet (md a lg) el buscador es una lupa, como en Facebook: al tocarla se abre completo sobre la
   izquierda del encabezado. Se cierra con la flecha, con Esc, al tocar fuera o al cambiar de página. */
const searchOpen = ref(false)
const searchForm = useTemplateRef<HTMLFormElement>('searchForm')
async function openSearch() {
  searchOpen.value = true
  await nextTick()
  searchForm.value?.querySelector('input')?.focus()
}
function closeSearch() {
  searchOpen.value = false
}
function onPointerDown(event: PointerEvent) {
  if (searchOpen.value && !searchForm.value?.contains(event.target as Node)) closeSearch()
}
const route = useRoute()
watch(() => route.fullPath, closeSearch)

/* En celular se esconde al bajar y reaparece al subir (umbral para no temblar con scrolls cortos) */
const hidden = useTopBarHidden()
let lastY = 0
function onScroll() {
  const y = window.scrollY
  if (!mobile?.matches || y < 56) hidden.value = false
  else if (y > lastY + 6) hidden.value = true
  else if (y < lastY - 6) hidden.value = false
  if (Math.abs(y - lastY) > 6) lastY = y
}
let mobile: MediaQueryList | undefined
onMounted(() => {
  mobile = window.matchMedia('(max-width: 767px)')
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('pointerdown', onPointerDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('pointerdown', onPointerDown)
  hidden.value = false
})
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur transition-transform duration-200"
    :class="{ '-translate-y-full': hidden }"
  >
    <!-- Como Facebook desde tablet: logo + buscador | pestañas del inicio | acciones.
         Rejilla 1fr | auto | 1fr: los lados miden igual y las pestañas quedan centradas en la pantalla.
         A todo el ancho (sin max-w-app), como Facebook: logo y buscador pegados a la izquierda de la pantalla. -->
    <!-- En tablet el buscador es una lupa (no cabe completo junto a las pestañas). -->
    <!-- En celular: menú ⋮ (con la colonia dentro) | buscador (ocupa el resto) | para negocios -->
    <div class="relative flex h-14 w-full items-center gap-xs px-md sm:gap-md md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <div class="-ml-xs flex min-w-0 flex-1 items-center gap-xs sm:ml-0">
        <!-- En celular sin logo: el buscador gana el espacio e "Inicio" ya está en la barra de abajo -->
        <span class="hidden shrink-0 sm:inline-flex"><BWordmark to="/" /></span>
        <!-- Menú ⋮ (con la colonia) solo en celular: desde tablet sus opciones están en la columna izquierda
             y la colonia en el buscador -->
        <span class="inline-flex md:hidden"><SocialMenuButton /></span>

        <!-- Tablet: lupa que abre el buscador -->
        <span v-if="!searchOpen" class="hidden md:max-lg:inline-flex">
          <SocialTopBarAction label="Buscar" @click="openSearch">
            <Icon name="material-symbols:search" size="22" aria-hidden="true" />
          </SocialTopBarAction>
        </span>

        <!-- La búsqueda por intención llega más adelante; por ahora es visual.
             En tablet solo se ve abierta: cubre el encabezado hasta las acciones (pestañas incluidas), con flecha para cerrar. -->
        <form
          ref="searchForm"
          class="min-w-0 flex-1 items-center gap-xs lg:max-w-[520px]"
          :class="searchOpen
            ? 'md:max-lg:absolute md:max-lg:inset-y-0 md:max-lg:left-0 md:max-lg:right-[120px] md:max-lg:z-50 md:max-lg:flex md:max-lg:bg-canvas md:max-lg:px-md'
            : 'md:max-lg:hidden'"
          role="search"
          @submit.prevent
          @keydown.esc="closeSearch"
        >
          <span v-if="searchOpen" class="hidden shrink-0 md:max-lg:inline-flex">
            <BIconButton label="Cerrar búsqueda" @click="closeSearch">
              <Icon name="material-symbols:arrow-back-rounded" size="24" class="text-ink" />
            </BIconButton>
          </span>
          <!-- La colonia va en el buscador desde tablet (en celular, en el menú ⋮); entre lg y xl el buscador
               va justo y solo se ve el pin -->
          <SocialSearch v-model="search" placeholder="¿Qué necesitas, vecino?" end-class="hidden md:flex" class="min-w-0 flex-1">
            <template #end>
              <SocialColonyButton label-class="lg:max-xl:hidden" />
            </template>
          </SocialSearch>
        </form>
      </div>

      <!-- Inicio, Ofertas, Citas y Notificaciones al centro (en celular van en la barra inferior) -->
      <SocialNavTabs class="hidden md:flex" />

      <!-- Acciones como en Facebook: círculos grises de 40px con solo el ícono y su etiqueta al pasar el cursor -->
      <div class="flex shrink-0 items-center gap-xs justify-self-end">
        <SocialTopBarAction label="Para negocios">
          <Icon name="material-symbols:add-business" size="22" aria-hidden="true" />
        </SocialTopBarAction>

        <!-- En celular lo del vecino vive en el menú ⋮ -->
        <!-- Tu cuenta: avatar con flecha que despliega editar perfil, configuración, ayuda y cerrar sesión -->
        <span class="hidden sm:inline-flex"><SocialAccountMenu /></span>
      </div>
    </div>
  </header>
</template>
