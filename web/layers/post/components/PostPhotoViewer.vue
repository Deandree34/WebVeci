<script setup lang="ts">
import type { PostItem } from '~/api/types'

/**
 * Visor de fotos de una publicación a pantalla completa, como el de Facebook:
 * la foto completa al centro, la X y "2 de 4" arriba, y abajo el post como en el feed: cabecera
 * (avatar, hace cuánto, tipo), texto y pie de reacciones. Al cambiar de foto, el texto pasa al de
 * esa foto si tiene uno propio (si no, se queda el del post); cabecera y pie no cambian.
 * "Ver más", o tocar el texto, despliega el texto completo.
 * - Deslizar a los lados cambia de foto; en dispositivos con cursor también hay flechas a los lados,
 *   en celular y tablet no (como las historias). Flechas ← → del teclado.
 * - Tocar la foto oculta o muestra lo de arriba y lo de abajo, para verla limpia.
 * - Deslizar hacia abajo cierra (la foto sigue al dedo); también Escape, la X o el botón "atrás" del teléfono.
 * - Con una sola foto, en pantallas táctiles no hay barra de arriba (ni X ni "1 de 1"): se vuelve al
 *   post deslizando hacia abajo o con "atrás". Con cursor se deja la X.
 * `index` (v-model) es la foto abierta (`null` = cerrado).
 */
interface PostPhotoViewerProps {
  post: PostItem
}

// Flechas solo con cursor: en pantallas táctiles se cambia deslizando
const ARROW_CLASS = 'absolute top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-surface-elevated/80 text-ink backdrop-blur transition-colors hover:bg-hairline-strong [@media(hover:hover)]:inline-flex'

const props = defineProps<PostPhotoViewerProps>()
const index = defineModel<number | null>('index', { default: null })

const photos = computed(() => props.post.photos)
const isOpen = () => index.value !== null

const photo = computed(() => {
  if (index.value === null) return undefined
  return photos.value[index.value]
})
const hasPrev = computed(() => index.value !== null && index.value > 0)
const hasNext = computed(() => index.value !== null && index.value < photos.value.length - 1)
const single = computed(() => photos.value.length === 1)
/** "2 de 4". */
const counter = computed(() => `${(index.value ?? 0) + 1} de ${photos.value.length}`)
/** Texto de abajo: el de la foto si tiene uno propio; si no, el del post. */
const text = computed(() => photo.value?.caption || props.post.text)

/** Cabecera y texto de abajo visibles (tocar la foto los oculta). */
const chrome = ref(true)
const fade = computed(() => (chrome.value ? 'opacity-100' : 'pointer-events-none opacity-0'))
const headerClass = computed(() => {
  // Con una sola foto, la barra solo con cursor: en táctil se cierra deslizando o con "atrás"
  if (single.value) return [fade.value, 'hidden [@media(hover:hover)]:flex']
  return [fade.value, 'flex']
})

/** "Ver más" solo si el corte a 2 líneas de verdad esconde algo (se mide en el navegador). */
const textEl = ref<HTMLParagraphElement>()
const { expanded, clipped, toggle: toggleText, collapse: collapseText } = useClampedText(textEl)

/* ---------- Abrir / cerrar ---------- */
// El bloqueo de scroll es apilado: puede abrirse encima de la vista del post, que también lo bloquea
const dialog = useModalDialog(isOpen, () => {
  chrome.value = true
  collapseText()
})

// Al cambiar a una foto con otro texto, se vuelve a cortar a 2 líneas y se mide de nuevo
watch(text, () => {
  if (isOpen()) collapseText()
})

function close() {
  index.value = null
}
useBackToClose(isOpen, close)

function next() {
  if (hasNext.value && index.value !== null) index.value += 1
}

function prev() {
  if (hasPrev.value && index.value !== null) index.value -= 1
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
}

/* ---------- Gestos sobre la foto: deslizar a los lados, hacia abajo o tocar ---------- */
/** `dragY`: cuánto se ha arrastrado hacia abajo (px); la foto sigue al dedo. */
const { dragY, press: onPointerDown, move: onPointerMove, release, cancel: onPointerCancel } = useSwipeGesture()
const dragStyle = computed(() => {
  if (!dragY.value) return undefined
  return { transform: `translateY(${dragY.value}px) scale(${1 - Math.min(dragY.value / 2000, 0.1)})` }
})

function onPointerUp(event: PointerEvent) {
  const result = release(event)
  if (result === 'close') close()
  if (result === 'next') next()
  if (result === 'prev') prev()
  if (result === 'tap') chrome.value = !chrome.value
}

const arrow = ARROW_CLASS
</script>

<template>
  <dialog
    ref="dialog"
    class="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-canvas backdrop:backdrop-blur"
    aria-label="Fotos de la publicación"
    @close="close"
    @keydown="onKeydown"
  >
    <div v-if="photo" class="relative h-full w-full bg-canvas select-none">
      <!-- Foto completa (sin recortar); aquí van los gestos -->
      <div
        class="absolute inset-0 flex touch-none items-center justify-center sm:px-xxl"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      >
        <img
          :key="photo.src"
          :src="photo.src"
          :alt="photo.alt"
          class="max-h-full max-w-full object-contain"
          :class="{ 'transition-transform duration-200': !dragY }"
          :style="dragStyle"
          draggable="false"
        >
      </div>

      <button v-if="hasPrev" type="button" aria-label="Foto anterior" :class="[arrow, 'left-md']" @click="prev">
        <Icon name="material-symbols:chevron-left-rounded" size="32" aria-hidden="true" />
      </button>
      <button v-if="hasNext" type="button" aria-label="Foto siguiente" :class="[arrow, 'right-md']" @click="next">
        <Icon name="material-symbols:chevron-right-rounded" size="32" aria-hidden="true" />
      </button>

      <!-- Arriba: cerrar a la izquierda (como Facebook) y "2 de 4" al centro.
           Con una sola foto solo con cursor: en táctil se cierra deslizando o con "atrás" -->
      <header
        class="absolute inset-x-0 top-0 z-10 h-14 items-center bg-gradient-to-b from-canvas/80 to-transparent px-xs transition-opacity duration-200"
        :class="headerClass"
      >
        <BIconButton label="Cerrar fotos" @click="close">
          <Icon name="material-symbols:close" size="26" />
        </BIconButton>
        <p v-if="!single" class="pointer-events-none absolute inset-x-0 text-center font-headline text-label font-semibold text-ink tabular-nums">
          {{ counter }}
        </p>
      </header>

      <!-- Abajo, como en el feed: cabecera del post (avatar, hace cuánto, tipo), el texto (el de la
           foto si tiene, si no el del post) y el pie (recomendar, compartir, vecinos) y el menú "···" -->
      <footer
        class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-canvas via-canvas/85 to-transparent pt-xl pb-xs transition-opacity duration-200"
        :class="fade"
      >
        <PostHeader :item="post" look="social" />
        <div v-if="text" class="px-md" :class="{ 'max-h-[40dvh] overflow-y-auto overscroll-contain': expanded }">
          <!-- Tocar el texto hace lo mismo que "Ver más" / "Ver menos" -->
          <p
            ref="textEl"
            class="font-reading text-reading leading-[1.5] whitespace-pre-line text-body"
            :class="{ 'line-clamp-2': !expanded, 'cursor-pointer': clipped }"
            @click="toggleText"
          >{{ text }}</p>
          <button
            v-if="clipped"
            type="button"
            class="font-reading text-reading font-semibold text-muted hover:underline"
            @click="toggleText"
          >
            {{ expanded ? 'Ver menos' : 'Ver más' }}
          </button>
        </div>
        <PostReactions :business="post.business" />
      </footer>
    </div>
  </dialog>
</template>
