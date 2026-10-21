let overlays = 0

/**
 * El botón "atrás" del teléfono (o del navegador) cierra una vista a pantalla completa en lugar de
 * salir de la página, como en Facebook. Al abrirse agrega una entrada al historial con la misma URL
 * (conservando el estado de Vue Router); "atrás" la quita y aquí se cierra la vista.
 * Si se cierra de otra forma (X, flecha, deslizar), se quita esa entrada para no dejar "atrás" de más.
 * Funciona apilado: con el visor encima de la vista del post, "atrás" cierra primero el visor.
 */
export function useBackToClose(isOpen: () => boolean, close: () => void) {
  const id = `overlay-${++overlays}`
  let pushed = false

  function onPopState() {
    // Se sacó nuestra entrada (ya no está arriba): cerrar. Si arriba quedó la de otra vista abierta
    // sobre esta (p. ej. el visor sobre la lista), esa es la que se cierra, no esta.
    if (!pushed || history.state?.overlay === id) return
    if (isAbove(history.state?.overlayStack, id)) return
    pushed = false
    close()
  }

  watch(isOpen, (open) => {
    if (!import.meta.client) return
    if (open && !pushed) {
      const stack: string[] = [...(history.state?.overlayStack ?? []), id]
      history.pushState({ ...history.state, overlay: id, overlayStack: stack }, '')
      pushed = true
    }
    else if (!open && pushed) {
      pushed = false
      if (history.state?.overlay === id) history.back()
    }
  })

  onMounted(() => window.addEventListener('popstate', onPopState))
  onBeforeUnmount(() => {
    window.removeEventListener('popstate', onPopState)
    if (pushed && history.state?.overlay === id) history.back()
  })
}

/** La entrada actual es de una vista abierta encima de `id` (su pila incluye a `id`). */
function isAbove(stack: string[] | undefined, id: string) {
  return !!stack?.includes(id)
}
