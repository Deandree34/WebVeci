<script setup lang="ts">
import { useCurrentUser } from '~/features/people/queries'

const search = ref('')
const { data: me } = useCurrentUser()

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
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  hidden.value = false
})
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur transition-transform duration-200"
    :class="{ '-translate-y-full': hidden }"
  >
    <!-- Desde sm, rejilla 1fr | buscador | 1fr: las columnas laterales miden igual y el buscador
         queda centrado en la pantalla, sin importar el ancho del logo o de las acciones -->
    <!-- En celular: menú ⋮ (con la colonia dentro) | buscador (ocupa el resto) | para negocios -->
    <!-- Entre sm y md la columna 1fr quedaría de ~40px: ahí los lados miden lo que su contenido -->
    <div class="mx-auto flex h-14 w-full max-w-app items-center gap-xs px-md sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-md md:grid-cols-[1fr_minmax(0,560px)_1fr]">
      <div class="-ml-xs flex shrink-0 items-center gap-xs sm:ml-0">
        <!-- En celular sin logo: el buscador gana el espacio e "Inicio" ya está en la barra de abajo -->
        <span class="hidden shrink-0 sm:inline-flex"><BWordmark to="/" /></span>
        <!-- Menú ⋮ mientras no hay columna izquierda (hasta md), pegado al buscador -->
        <span class="inline-flex md:hidden"><SocialMenuButton /></span>
      </div>

      <!-- La búsqueda por intención llega más adelante; por ahora es visual -->
      <form class="min-w-0 flex-1" role="search" @submit.prevent>
        <!-- La colonia va en el buscador desde md; antes, en el menú ⋮ -->
        <SocialSearch v-model="search" placeholder="¿Qué necesitas hoy, vecino?" end-class="hidden md:flex">
          <template #end>
            <SocialColonyButton />
          </template>
        </SocialSearch>
      </form>

      <!-- Acciones como en Facebook: círculos grises de 40px con solo el ícono y su etiqueta al pasar el cursor -->
      <div class="flex shrink-0 items-center gap-xs justify-self-end">
        <SocialTopBarAction label="Para negocios">
          <Icon name="material-symbols:add-business" size="22" aria-hidden="true" />
        </SocialTopBarAction>

        <!-- En celular lo del vecino vive en el menú ⋮ -->
        <button type="button" aria-label="Tu perfil" class="hidden shrink-0 rounded-full transition-opacity hover:opacity-80 sm:block">
          <SocialAvatar :name="me?.name ?? '?'" size="md" />
        </button>
      </div>
    </div>
  </header>
</template>
