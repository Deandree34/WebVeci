<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Story } from '~/api/types'
import { businessPath } from '#layers/social/nav'
import { useStoriesStore } from '../stores'

/**
 * Visor de historias a pantalla completa.
 *
 * - Avanza solo cuando termina la barra (animación CSS `animate-story-progress`, 6 s).
 * - Toque/clic en la mitad izquierda o derecha, deslizar a los lados, flechas ← → y Escape.
 * - Deslizar hacia abajo cierra: la historia sigue al dedo y, si no llega al umbral, regresa a su lugar.
 * - El botón "atrás" del teléfono también cierra (no sale de la página).
 * - En celular ocupa toda la pantalla, sin márgenes ni flechas (se cambia tocando o deslizando);
 *   desde sm va en un marco 9:16 con flechas a los lados.
 * - Mantener presionado pausa; también se pausa si la pestaña queda oculta.
 * - Con "reducir movimiento" no hay avance automático: se navega a mano.
 *
 * `index` (v-model) es la historia abierta (`null` = cerrado).
 */
interface StoryViewerProps {
  stories: Story[]
}

/** En qué va cada barra de progreso respecto a la historia abierta. */
type ProgressState = 'done' | 'current' | 'pending'

const props = defineProps<StoryViewerProps>()
const index = defineModel<number | null>('index', { default: null })

const store = useStoriesStore()
const isOpen = () => index.value !== null

const story = computed(() => {
  if (index.value === null) return undefined
  return props.stories[index.value]
})
const isFirst = computed(() => index.value === 0)

/* ---------- Abrir / cerrar ---------- */
const dialog = useModalDialog(isOpen)

watch(story, (value) => {
  if (value) store.markSeen(value.id)
}, { immediate: true })

function close() {
  index.value = null
}
useBackToClose(isOpen, close)

/** La última historia cierra el visor. */
function next() {
  if (index.value === null) return
  if (index.value < props.stories.length - 1) index.value += 1
  else close()
}

function prev() {
  if (index.value !== null && index.value > 0) index.value -= 1
}

function progressState(position: number): ProgressState {
  const current = index.value ?? 0
  if (position < current) return 'done'
  if (position === current) return 'current'
  return 'pending'
}

/* ---------- Pausa: mantener presionado o pestaña oculta ---------- */
const holding = ref(false)
const tabHidden = ref(false)
const playState = computed(() => (holding.value || tabHidden.value ? 'paused' : 'running'))

function onVisibility() {
  tabHidden.value = document.hidden
}
onMounted(() => document.addEventListener('visibilitychange', onVisibility))
onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisibility))

/* ---------- Gestos ---------- */
/** `dragY`: cuánto se ha arrastrado hacia abajo (px); mueve y encoge la historia mientras se arrastra. */
const { dragY, press, move: onMove, release, cancel } = useSwipeGesture({ tapSlop: 40 })
const dragStyle = computed(() => {
  if (!dragY.value) return undefined
  return {
    transform: `translateY(${dragY.value}px) scale(${1 - Math.min(dragY.value / 2000, 0.1)})`,
    opacity: 1 - Math.min(dragY.value / 600, 0.5)
  }
})

function onPress(event: PointerEvent) {
  holding.value = true
  press(event)
}

/** Abajo cierra; a los lados navega (a la izquierda = siguiente); un toque corto navega por zona; uno largo solo reanuda. */
function onRelease(zone: 'prev' | 'next', event: PointerEvent) {
  holding.value = false
  const result = release(event)
  if (result === 'close') close()
  if (result === 'next') next()
  if (result === 'prev') prev()
  if (result === 'tap' && zone === 'next') next()
  if (result === 'tap' && zone === 'prev') prev()
}

function onCancel() {
  holding.value = false
  cancel()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
}

/* ---------- Acción ---------- */
/** "Apartar" lleva al perfil con la cita abierta (`?cita=1`); lo demás, al perfil. */
const actionTo = computed<RouteLocationRaw>(() => {
  if (!story.value) return '/'
  const path = businessPath(story.value.business.slug)
  if (story.value.action.target === 'booking') return { path, query: { cita: '1' } }
  return path
})
</script>

<template>
  <dialog
    ref="dialog"
    class="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-canvas/90 backdrop:backdrop-blur"
    aria-label="Historias"
    @close="close"
    @keydown="onKeydown"
  >
    <div v-if="story" class="flex h-full items-center justify-center sm:gap-md" @click.self="close">
      <!-- Flechas solo desde sm (en un span: el `inline-flex` de BIconButton anularía el `hidden`) -->
      <span class="hidden sm:inline-flex">
        <BIconButton label="Historia anterior" :disabled="isFirst" @click="prev">
          <Icon name="material-symbols:chevron-left" size="28" />
        </BIconButton>
      </span>

      <article
        class="relative flex h-full w-full flex-col overflow-hidden bg-surface-card sm:aspect-[9/16] sm:h-[min(90dvh,760px)] sm:w-auto sm:rounded-3xl"
        :class="[dragY ? 'rounded-3xl' : 'transition-[transform,opacity] duration-200']"
        :style="dragStyle"
        :aria-label="`${story.business.name}: ${story.kind}`"
      >
        <span class="pointer-events-none absolute inset-0 bg-brand opacity-40" aria-hidden="true" />
        <span class="pointer-events-none absolute inset-0 bg-story-veil" aria-hidden="true" />

        <!-- Barras de progreso -->
        <div class="relative z-10 flex gap-xxs px-sm pt-sm" aria-hidden="true">
          <span v-for="(item, position) in stories" :key="item.id" class="h-[3px] flex-1 overflow-hidden rounded-pill bg-on-dark/30">
            <span v-if="progressState(position) === 'done'" class="block h-full w-full bg-on-dark" />
            <span
              v-else-if="progressState(position) === 'current'"
              :key="`progress-${index}`"
              class="block h-full animate-story-progress bg-on-dark motion-reduce:w-full motion-reduce:animate-none"
              :style="{ animationPlayState: playState }"
              @animationend="next"
            />
          </span>
        </div>

        <!-- Cabecera -->
        <header class="relative z-10 flex items-center gap-xs px-sm py-sm">
          <StoryAvatar :icon="story.business.icon" size="sm" class="ring-2 ring-on-dark/60" />
          <span class="truncate text-label font-semibold text-on-dark">{{ story.business.name }}</span>
          <BusinessVerified v-if="story.business.verified" />
          <span class="text-support text-on-dark/70">hoy</span>
          <BIconButton class="ml-auto" label="Cerrar historias" @click="close">
            <Icon name="material-symbols:close" size="24" />
          </BIconButton>
        </header>

        <!-- Zonas de toque: izquierda = anterior, derecha = siguiente; mantener = pausa; deslizar = cambiar.
             `touch-none` para que el navegador no se quede el gesto de deslizar. -->
        <button
          type="button"
          class="absolute inset-y-0 left-0 w-1/3 touch-none"
          aria-label="Historia anterior"
          tabindex="-1"
          @pointerdown="onPress"
          @pointermove="onMove"
          @pointerup="onRelease('prev', $event)"
          @pointercancel="onCancel"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 w-2/3 touch-none"
          aria-label="Historia siguiente"
          tabindex="-1"
          @pointerdown="onPress"
          @pointermove="onMove"
          @pointerup="onRelease('next', $event)"
          @pointercancel="onCancel"
        />

        <!-- Contenido -->
        <div class="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center px-lg text-center">
          <Icon
            :name="story.business.icon"
            size="104"
            class="mb-md text-on-dark drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
            aria-hidden="true"
          />
          <!-- Tipo en Lora cursiva (la voz de la app); titular y apoyo en Plus Jakarta Sans, como en los posts -->
          <p class="font-quote text-section font-medium text-on-dark/85 italic">{{ story.kind }}</p>
          <p class="mt-xxs font-headline text-story leading-[1.15] font-bold tracking-[-0.01em] text-on-dark normal-case">{{ story.headline }}</p>
          <p class="mt-xs font-headline text-lead leading-[1.45] font-medium text-on-dark/90">{{ story.text }}</p>
          <div v-if="story.promo" class="mt-md rounded-pill bg-canvas/35 px-md py-xs">
            <BusinessPromoCountdown :promo="story.promo" hide-bar />
          </div>
        </div>

        <!-- Acción -->
        <footer class="relative z-10 p-md">
          <BButton :to="actionTo" variant="primary" size="xl" block @click="close">
            {{ story.action.label }}
          </BButton>
        </footer>
      </article>

      <span class="hidden sm:inline-flex">
        <BIconButton label="Historia siguiente" @click="next">
          <Icon name="material-symbols:chevron-right" size="28" />
        </BIconButton>
      </span>
    </div>
  </dialog>
</template>
