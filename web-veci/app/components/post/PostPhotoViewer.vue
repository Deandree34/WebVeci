<script setup lang="ts">
import type { PostPhoto } from '~/api/types'

/**
 * Visor de fotos de una publicación a pantalla completa, como el de Facebook:
 * la foto completa al centro, flechas a los lados, "2 de 4" arriba y su descripción abajo.
 * Flechas ← → del teclado, deslizar en celular y Escape (o la X) para cerrar.
 * `index` es la foto abierta (`null` = cerrado). Solo neutros.
 */
const props = defineProps<{ photos: PostPhoto[] }>()
const index = defineModel<number | null>('index', { default: null })

const dialog = ref<HTMLDialogElement>()
const photo = computed(() => (index.value === null ? undefined : props.photos[index.value]))
const hasPrev = computed(() => index.value !== null && index.value > 0)
const hasNext = computed(() => index.value !== null && index.value < props.photos.length - 1)

/* ---------- Abrir / cerrar ---------- */
watch(index, (value) => {
  const el = dialog.value
  if (!el) return
  if (value !== null && !el.open) el.showModal()
  if (value === null && el.open) el.close()
  document.documentElement.style.overflow = value === null ? '' : 'hidden'
})
onBeforeUnmount(() => (document.documentElement.style.overflow = ''))

function close() {
  index.value = null
}
function next() {
  if (hasNext.value) index.value! += 1
}
function prev() {
  if (hasPrev.value) index.value! -= 1
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
}

/* ---------- Deslizar en celular: más de 40px en horizontal cambia de foto ---------- */
let startX: number | null = null
function onPointerDown(event: PointerEvent) {
  startX = event.clientX
}
function onPointerUp(event: PointerEvent) {
  if (startX === null) return
  const dx = event.clientX - startX
  startX = null
  if (dx < -40) next()
  else if (dx > 40) prev()
}

const arrow = 'absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-surface-elevated/80 text-ink backdrop-blur transition-colors hover:bg-hairline-strong sm:inline-flex'
</script>

<template>
  <dialog
    ref="dialog"
    class="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-canvas/95 backdrop:backdrop-blur"
    aria-label="Fotos de la publicación"
    @close="close"
    @keydown="onKeydown"
  >
    <div
      v-if="photo"
      class="relative flex h-full w-full touch-pan-y flex-col select-none"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
    >
      <!-- Arriba: cerrar a la izquierda (como Facebook) y "2 de 4" al centro -->
      <header class="relative z-10 flex h-14 shrink-0 items-center px-xs">
        <BIconButton label="Cerrar fotos" @click="close">
          <Icon name="material-symbols:close" size="26" />
        </BIconButton>
        <p class="pointer-events-none absolute inset-x-0 text-center font-headline text-label font-semibold text-ink tabular-nums">
          {{ index! + 1 }} de {{ photos.length }}
        </p>
      </header>

      <!-- Foto completa (sin recortar) -->
      <div class="relative flex min-h-0 flex-1 items-center justify-center px-0 sm:px-xxl">
        <img
          :key="photo.src"
          :src="photo.src"
          :alt="photo.alt"
          class="max-h-full max-w-full object-contain"
          draggable="false"
        >

        <button v-if="hasPrev" type="button" aria-label="Foto anterior" :class="[arrow, 'left-md']" @click="prev">
          <Icon name="material-symbols:chevron-left-rounded" size="32" aria-hidden="true" />
        </button>
        <button v-if="hasNext" type="button" aria-label="Foto siguiente" :class="[arrow, 'right-md']" @click="next">
          <Icon name="material-symbols:chevron-right-rounded" size="32" aria-hidden="true" />
        </button>
      </div>

      <!-- Abajo: qué muestra la foto (su descripción) -->
      <p class="shrink-0 px-md py-md text-center font-reading text-reading leading-[1.5] text-body">{{ photo.alt }}</p>
    </div>
  </dialog>
</template>
