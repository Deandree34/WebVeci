<script setup lang="ts">
/**
 * Menú flotante bajo un botón (el "···" de los posts, el de la cuenta en el encabezado).
 * Mismo fondo, borde y sombra que la ventana flotante del negocio. Se pinta en `body` con
 * posición fija, alineado a la derecha del botón (así no lo recorta la tarjeta que lo contiene),
 * y se cierra al elegir una opción (`BMenuItem`), al tocar fuera, con Escape o al hacer scroll.
 * Dentro de una vista a pantalla completa (`<dialog>` abierto) se pinta en ese dialog, porque lo
 * que está en `body` queda detrás; y si abajo no cabe (p. ej. el pie del visor de fotos), se abre hacia arriba.
 *
 * Slot `trigger`: el botón, que recibe `toggle` y `open`. Slot por defecto: las opciones.
 */
withDefaults(defineProps<{ width?: string }>(), { width: 'w-[min(300px,calc(100vw-32px))]' })

const open = ref(false)
const trigger = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const target = ref<string | HTMLElement>('body')
const position = ref<{ top?: string, bottom?: string, right: string }>({ right: '0px' })
/** Alto aproximado del menú para decidir si cabe abajo. */
const ROOM_BELOW = 260

function toggle() {
  if (open.value) return close()
  const el = trigger.value!
  const rect = el.getBoundingClientRect()
  target.value = el.closest<HTMLElement>('dialog[open]') ?? 'body'
  const right = `${window.innerWidth - rect.right}px`
  position.value = window.innerHeight - rect.bottom < ROOM_BELOW && rect.top > ROOM_BELOW
    ? { bottom: `${window.innerHeight - rect.top + 4}px`, right }
    : { top: `${rect.bottom + 4}px`, right }
  open.value = true
  nextTick(() => panel.value?.querySelector<HTMLElement>('[role="menuitem"]')?.focus())
}
function close() {
  open.value = false
}
/** Tras elegir una opción: se cierra y el foco vuelve al botón que lo abrió. */
function closeAfterSelect() {
  close()
  trigger.value?.querySelector('button')?.focus()
}
provide('closeMenu', closeAfterSelect)

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (!panel.value?.contains(target) && !trigger.value?.contains(target)) close()
}
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  // Que Escape cierre solo el menú, no también la vista a pantalla completa que lo contiene
  event.preventDefault()
  closeAfterSelect()
}
watch(open, (isOpen) => {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  document[method]('pointerdown', onPointerDown)
  document[method]('keydown', onKeydown)
  // En captura: también el scroll dentro de una vista a pantalla completa, no solo el de la página
  document[method]('scroll', close, { passive: true, capture: true } as AddEventListenerOptions)
  window[method]('resize', close)
})
onBeforeUnmount(() => (open.value = false))
</script>

<template>
  <span ref="trigger" class="inline-flex">
    <slot name="trigger" :toggle="toggle" :open="open" />

    <Teleport :to="target">
      <div
        v-if="open"
        ref="panel"
        role="menu"
        class="fixed z-50 rounded-card border border-hairline-strong bg-surface-card p-xs shadow-lg"
        :class="width"
        :style="position"
      >
        <slot />
      </div>
    </Teleport>
  </span>
</template>
