/**
 * `<dialog>` nativo abierto con `showModal()` mientras `isOpen()` sea verdadero: el navegador atrapa
 * el foco, cierra con Escape y lo pinta encima de todo. También bloquea el scroll de la página.
 * `onOpen` corre cada vez que se abre (p. ej. para volver arriba o reiniciar el estado de la vista).
 *
 * Devuelve el ref del dialog: se enlaza en el template con `ref="dialog"`.
 */
export function useModalDialog(isOpen: () => boolean, onOpen?: (el: HTMLDialogElement) => void) {
  const dialog = ref<HTMLDialogElement>()

  function sync(open: boolean) {
    const el = dialog.value
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      if (onOpen) onOpen(el)
    }
    if (!open && el.open) el.close()
  }

  watch(isOpen, sync)
  onMounted(() => sync(isOpen()))
  useScrollLock(isOpen)

  return dialog
}
