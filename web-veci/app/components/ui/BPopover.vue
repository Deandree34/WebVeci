<script setup lang="ts">
/**
 * Menú flotante bajo un botón (el "···" de los posts, el de la cuenta en el encabezado).
 * Mismo fondo, borde y sombra que la ventana flotante del negocio. Se pinta en `body` con
 * posición fija, alineado a la derecha del botón (así no lo recorta la tarjeta que lo contiene),
 * y se cierra al elegir una opción (`BMenuItem`), al tocar fuera, con Escape o al hacer scroll.
 *
 * Slot `trigger`: el botón, que recibe `toggle` y `open`. Slot por defecto: las opciones.
 */
withDefaults(defineProps<{ width?: string }>(), { width: 'w-[min(300px,calc(100vw-32px))]' })

const open = ref(false)
const trigger = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const position = ref({ top: 0, right: 0 })

function toggle() {
  if (open.value) return close()
  const rect = trigger.value!.getBoundingClientRect()
  position.value = { top: rect.bottom + 4, right: window.innerWidth - rect.right }
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
  if (event.key === 'Escape') closeAfterSelect()
}
watch(open, (isOpen) => {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  document[method]('pointerdown', onPointerDown)
  document[method]('keydown', onKeydown)
  window[method]('scroll', close, { passive: true } as AddEventListenerOptions)
  window[method]('resize', close)
})
onBeforeUnmount(() => (open.value = false))
</script>

<template>
  <span ref="trigger" class="inline-flex">
    <slot name="trigger" :toggle="toggle" :open="open" />

    <Teleport to="body">
      <div
        v-if="open"
        ref="panel"
        role="menu"
        class="fixed z-50 rounded-card border border-hairline-strong bg-surface-card p-xs shadow-lg"
        :class="width"
        :style="{ top: `${position.top}px`, right: `${position.right}px` }"
      >
        <slot />
      </div>
    </Teleport>
  </span>
</template>
