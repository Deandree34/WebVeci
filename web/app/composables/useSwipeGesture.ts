/** Qué quiso hacer el vecino con el gesto, al soltar. */
export type SwipeResult = 'close' | 'next' | 'prev' | 'tap' | 'none'

export interface SwipeGestureOptions {
  /** Cuánto se puede mover el dedo (px) y que siga contando como toque. */
  tapSlop?: number
}

/** Arrastrar hacia abajo más de esto cierra la vista. */
const CLOSE_AT = 120
/** Deslizar a los lados más de esto cambia de elemento. */
const SWIPE_AT = 40
/** Un toque dura menos de esto (más es mantener presionado). */
const TAP_MS = 250

/**
 * Gestos de las vistas a pantalla completa (visor de fotos, historias): deslizar a los lados,
 * arrastrar hacia abajo para cerrar (`dragY` sigue al dedo) y tocar.
 * Se conecta a `@pointerdown` / `@pointermove` / `@pointerup` / `@pointercancel`; `release`
 * devuelve qué hacer (a la izquierda = siguiente, como en Facebook).
 */
export function useSwipeGesture(options: SwipeGestureOptions = {}) {
  const tapSlop = options.tapSlop ?? 10
  /** Cuánto se ha arrastrado hacia abajo (px). */
  const dragY = ref(0)
  let start: { x: number, y: number, at: number } | null = null

  function press(event: PointerEvent) {
    start = { x: event.clientX, y: event.clientY, at: Date.now() }
    // Los movimientos siguen llegando a esta zona aunque el dedo salga de ella
    const el = event.currentTarget as HTMLElement
    el.setPointerCapture(event.pointerId)
  }

  function move(event: PointerEvent) {
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (dy > 0 && dy > Math.abs(dx)) dragY.value = dy
    else dragY.value = 0
  }

  function release(event: PointerEvent): SwipeResult {
    if (!start) return 'none'
    const dx = event.clientX - start.x
    const quick = Date.now() - start.at < TAP_MS
    const dragged = dragY.value
    cancel()
    if (dragged > CLOSE_AT) return 'close'
    if (dragged > 10) return 'none'
    if (dx < -SWIPE_AT) return 'next'
    if (dx > SWIPE_AT) return 'prev'
    if (quick && Math.abs(dx) <= tapSlop) return 'tap'
    return 'none'
  }

  function cancel() {
    start = null
    dragY.value = 0
  }

  return { dragY, press, move, release, cancel }
}
