import type { Ref } from 'vue'

export interface ClampedTextOptions {
  /** Volver a medir al cambiar el tamaño de la ventana (el corte depende del ancho). */
  remeasureOnResize?: boolean
}

/**
 * Texto cortado a N líneas (con `line-clamp-*` en el template) con "Ver más" / "Ver menos".
 * `clipped` se mide en el navegador: solo es verdadero si el corte de verdad esconde algo.
 * `target` es el elemento del texto (ref de template).
 */
export function useClampedText(target: Ref<HTMLElement | undefined>, options: ClampedTextOptions = {}) {
  const expanded = ref(false)
  const clipped = ref(false)

  async function measure() {
    await nextTick()
    const el = target.value
    if (el && !expanded.value) clipped.value = el.scrollHeight > el.clientHeight + 1
  }

  /** Desplegar o volver a cortar (solo si hay algo escondido). */
  function toggle() {
    if (clipped.value) expanded.value = !expanded.value
  }

  /** Volver a cortar y medir de nuevo (p. ej. al cambiar el texto). */
  function collapse() {
    expanded.value = false
    measure()
  }

  onMounted(() => {
    measure()
    if (options.remeasureOnResize) window.addEventListener('resize', measure, { passive: true })
  })
  onBeforeUnmount(() => {
    if (options.remeasureOnResize) window.removeEventListener('resize', measure)
  })

  return { expanded, clipped, measure, toggle, collapse }
}
