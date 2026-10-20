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
    <div class="mx-auto flex h-14 w-full max-w-app items-center gap-md px-md sm:grid sm:grid-cols-[1fr_minmax(0,560px)_1fr]">
      <BWordmark to="/" class="justify-self-start" />

      <!-- La búsqueda por intención llega más adelante; por ahora es visual -->
      <form class="hidden min-w-0 sm:block" role="search" @submit.prevent>
        <SocialSearch v-model="search" placeholder="¿Qué necesitas hoy, vecino?">
          <template #end>
            <SocialColonyButton />
          </template>
        </SocialSearch>
      </form>

      <div class="ml-auto flex items-center gap-xs justify-self-end">
        <!-- En celular, Explorar vive aquí (la barra de abajo es para el feed y "Tú") -->
        <NuxtLink
          to="/explorar"
          aria-label="Buscar"
          class="inline-flex size-10 items-center justify-center rounded-full text-on-dark transition-colors hover:bg-surface-elevated sm:hidden"
        >
          <Icon name="material-symbols:search" size="22" />
        </NuxtLink>
        <SocialColonyButton class="sm:hidden" />

        <button
          type="button"
          title="Ofrezco un servicio"
          class="hidden h-9 items-center gap-xxs rounded-pill border border-hairline-strong px-md font-headline text-[14px] font-semibold whitespace-nowrap text-body-strong transition-colors hover:bg-surface-elevated lg:inline-flex"
        >
          <Icon name="material-symbols:add-business" size="20" aria-hidden="true" />
          Para negocios
        </button>

        <button type="button" aria-label="Tu perfil" class="shrink-0 transition-opacity hover:opacity-80">
          <SocialAvatar :name="me?.name ?? '?'" size="sm" />
        </button>
      </div>
    </div>
  </header>
</template>
