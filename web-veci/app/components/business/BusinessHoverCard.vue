<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Tarjeta flotante con el resumen del negocio al pasar el cursor por el trigger (como Facebook).
 *
 * Solo en dispositivos con cursor; en táctil el trigger (un enlace) lleva al negocio.
 * Usa la Popover API: vive en la capa superior, así que no la recorta el
 * `overflow-hidden` de la tarjeta del post.
 */
const props = defineProps<{ business: Business }>()

const now = useNow()
const status = computed(() => scheduleStatus(props.business, now.value))

const trigger = ref<HTMLElement>()
const card = ref<HTMLElement>()
const position = ref({ top: '0px', left: '0px' })

const OPEN_DELAY = 400
const CLOSE_DELAY = 200
const GAP = 8
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
  const top = below + height > window.innerHeight ? anchor.top - GAP - height : below
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
  timer = setTimeout(action === 'open' ? open : close, action === 'open' ? OPEN_DELAY : CLOSE_DELAY)
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
    <div class="flex items-center gap-sm">
      <BusinessAvatar :icon="business.icon" size="lg" :open="status.open" />
      <div class="min-w-0">
        <p class="flex items-center gap-xxs text-body-md font-medium text-ink">
          <span class="truncate">{{ business.name }}</span>
          <BusinessVerified v-if="business.verified" />
        </p>
        <p class="text-body-xs text-muted">{{ business.subcategory }}</p>
      </div>
    </div>

    <BusinessFacts :business="business" class="mt-md" />

    <PostAction :to="businessPath(business.slug)" variant="primary" class="mt-md w-full">Ver negocio</PostAction>
  </div>
</template>
