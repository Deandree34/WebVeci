/** Cuántas vistas tienen bloqueado el scroll ahora (p. ej. el visor de fotos sobre la vista del post). */
let locks = 0
/** `overflow` que tenía la página antes del primer bloqueo, para dejarlo como estaba. */
let previousOverflow = ''

/**
 * Bloquea el scroll de la página de fondo mientras `isLocked()` sea verdadero (ventanas y vistas a
 * pantalla completa). Funciona apilado: la página vuelve a hacer scroll cuando se cierra la última.
 */
export function useScrollLock(isLocked: () => boolean) {
  let holding = false

  function lock() {
    if (holding) return
    holding = true
    if (locks === 0) {
      previousOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
    }
    locks += 1
  }

  function unlock() {
    if (!holding) return
    holding = false
    locks -= 1
    if (locks === 0) document.documentElement.style.overflow = previousOverflow
  }

  watch(isLocked, (locked) => {
    if (!import.meta.client) return
    if (locked) lock()
    else unlock()
  })
  onMounted(() => {
    if (isLocked()) lock()
  })
  onBeforeUnmount(unlock)
}
