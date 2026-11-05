<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '#layers/social/nav'

/**
 * Tarjeta flotante con el resumen del negocio al pasar el cursor por el trigger (como Facebook).
 *
 * Solo en dispositivos con cursor; en táctil el trigger (un enlace) lleva al negocio.
 * Usa la Popover API: vive en la capa superior, así que no la recorta el
 * `overflow-hidden` de la tarjeta del post.
 */
interface BusinessHoverCardProps {
  business: Business
}

const OPEN_DELAY = 400

const CLOSE_DELAY = 200

const GAP = 8

const props = defineProps<BusinessHoverCardProps>()

const trigger = ref<HTMLElement>()
const card = ref<HTMLElement>()
const position = ref({ top: '0px', left: '0px' })
const profilePath = computed(() => businessPath(props.business.slug))

let timer: ReturnType<typeof setTimeout> | undefined
let canHover = false

onMounted(() => {
  canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('scroll', close, true)
})

/** Debajo del trigger; arriba si no cabe; sin salirse del ancho de la ventana. */
function place() {
  const anchor = trigger.value!.getBoundingClientRect()
  const { offsetWidth: width, offsetHeight: height } = card.value!
  const below = anchor.bottom + GAP
  let top = below
  if (below + height > window.innerHeight) top = anchor.top - GAP - height
  const left = Math.min(Math.max(GAP, anchor.left), window.innerWidth - width - GAP)
  position.value = { top: `${Math.max(GAP, top)}px`, left: `${left}px` }
}

function open() {
  const el = card.value
  if (!el || el.matches(':popover-open')) return
  el.showPopover()
  place()
  window.addEventListener('scroll', close, true)
}

function close() {
  clearTimeout(timer)
  window.removeEventListener('scroll', close, true)
  if (card.value?.matches(':popover-open')) card.value.hidePopover()
}

function schedule(action: 'open' | 'close') {
  if (!canHover) return
  clearTimeout(timer)
  if (action === 'open') timer = setTimeout(open, OPEN_DELAY)
  else timer = setTimeout(close, CLOSE_DELAY)
}

/** Con teclado se abre al instante; se cierra al salir el foco del trigger y de la tarjeta. */
function onFocusIn() {
  if (!canHover) return
  clearTimeout(timer)
  open()
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && (trigger.value?.contains(next) || card.value?.contains(next))) return
  close()
}
</script>

<template>
  <span
    ref="trigger"
    class="inline-flex min-w-0"
    @mouseenter="schedule('open')"
    @mouseleave="schedule('close')"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="close"
  >
    <slot />
  </span>

  <div
    ref="card"
    popover="manual"
    class="fixed inset-auto m-0 w-80 rounded-card border border-hairline-strong bg-surface-card p-md text-body shadow-lg"
    :style="position"
    @mouseenter="schedule('open')"
    @mouseleave="schedule('close')"
    @focusout="onFocusOut"
    @keydown.esc="close"
  >
    <!-- Identidad con el sistema de los posts: nombre y giro en la fuente del sistema -->
    <div class="flex items-center gap-sm">
      <BusinessAvatar :icon="business.icon" size="lg" />
      <div class="min-w-0">
        <p class="flex items-center gap-xxs">
          <span class="truncate text-emphasis leading-[1.25] font-semibold text-ink">{{ business.name }}</span>
          <BusinessVerified v-if="business.verified" />
        </p>
        <p class="mt-0.5 truncate text-support leading-[1.4] text-body">{{ business.subcategory }}</p>
      </div>
    </div>

    <BusinessFacts :business="business" class="mt-md" />

    <!-- Mismo botón de contorno que los adjuntos de los posts -->
    <BButton :to="profilePath" size="md" block class="mt-md">Ver negocio</BButton>
  </div>
</template>
