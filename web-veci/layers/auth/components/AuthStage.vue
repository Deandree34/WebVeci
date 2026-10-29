<script setup lang="ts">
/**
 * Fondo de la pantalla de acceso: gotas líquidas que flotan, se juntan y se separan como mercurio,
 * y se desplazan apenas con el mouse. Dos masas, una blanca y una ocre, encajadas como las dos
 * piezas del logo; cada color va en su propia capa con el filtro "goo" para que sus gotas se fundan
 * con borde nítido (en una sola capa el ocre quedaría como una mancha borrosa dentro del blanco).
 * Define el filtro `#veci-goo`, que también usa el botón de `AuthSubmit`.
 * Decorativo: oculto a lectores de pantalla; sin animación con "reducir movimiento".
 */
interface Blob {
  size: number
  left: number
  top: number
  delay: number
  duration: number
  /** Solo desde tablet: en celular, menos gotas detrás del formulario. */
  wide?: boolean
}

/*
 * Valores fijos (no aleatorios): el HTML del servidor y el del navegador deben coincidir.
 * Las gotas parten encimadas en un grupo a la derecha (fuera del formulario cuando hay espacio):
 * así el filtro las funde en una masa, y la animación las separa y las vuelve a juntar.
 */
const INK_BLOBS: Blob[] = [
  { size: 300, left: 64, top: 30, delay: -3, duration: 22 },
  { size: 230, left: 74, top: 24, delay: -11, duration: 26 },
  { size: 250, left: 60, top: 48, delay: -7, duration: 30 },
  { size: 180, left: 80, top: 44, delay: -17, duration: 25, wide: true }
]

const BRAND_BLOBS: Blob[] = [
  { size: 190, left: 76, top: 62, delay: -15, duration: 19 },
  { size: 150, left: 70, top: 72, delay: -1, duration: 24 },
  { size: 130, left: 84, top: 70, delay: -9, duration: 21, wide: true }
]

const LAYERS = [
  { blobs: INK_BLOBS, tone: 'from-ink to-muted-soft' },
  { blobs: BRAND_BLOBS, tone: 'from-brand-hover to-brand' }
]

function blobStyle(blob: Blob) {
  return {
    width: `${blob.size}px`,
    height: `${blob.size}px`,
    left: `${blob.left}%`,
    top: `${blob.top}%`,
    animationDelay: `${blob.delay}s`,
    animationDuration: `${blob.duration}s`
  }
}

/*
 * Paralaje con el mouse: se mueve el margen (no `transform`, que ya lo usa la animación).
 * Solo con mouse y sin "reducir movimiento"; un frame por movimiento como máximo.
 */
const root = ref<HTMLElement>()
let blobEls: HTMLElement[] = []
let frame = 0

function onPointerMove(event: PointerEvent) {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const x = event.clientX / window.innerWidth
    const y = event.clientY / window.innerHeight
    blobEls.forEach((el, index) => {
      const speed = (index + 1) * 12
      el.style.marginLeft = `${x * speed}px`
      el.style.marginTop = `${y * speed}px`
    })
  })
}

onMounted(() => {
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!finePointer || reducedMotion || !root.value) return
  blobEls = Array.from(root.value.querySelectorAll<HTMLElement>('[data-blob]'))
  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="root" class="pointer-events-none absolute inset-0" aria-hidden="true">
    <svg class="absolute size-0">
      <defs>
        <filter id="veci-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>

    <!-- En celular el formulario ocupa todo el ancho: más tenue para que el texto se lea encima -->
    <div
      v-for="(layer, layerIndex) in LAYERS"
      :key="layerIndex"
      class="absolute inset-0 opacity-35 [filter:url(#veci-goo)] lg:opacity-60"
    >
      <!-- Sombra interior + brillo: el volumen de una gota de mercurio -->
      <div
        v-for="(blob, index) in layer.blobs"
        :key="index"
        data-blob
        class="absolute animate-auth-float rounded-full bg-linear-135 shadow-[inset_-10px_-10px_20px_rgb(0_0_0/0.5),10px_10px_30px_rgb(255_255_255/0.2)] blur-[20px] transition-[margin] duration-100 ease-out motion-reduce:animate-none"
        :class="[layer.tone, { 'hidden sm:block': blob.wide }]"
        :style="blobStyle(blob)"
      />
    </div>
  </div>
</template>
