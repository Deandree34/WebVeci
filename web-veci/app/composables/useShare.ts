export interface ShareData {
  title: string
  text?: string
  /** Ruta dentro de la app (p. ej. `/negocio/el-guero`); se comparte como URL completa. */
  path: string
}

/**
 * Compartir un enlace: el menú nativo del teléfono si existe; si no, se copia al portapapeles y
 * `copied` queda en verdadero 2 s (para cambiar el ícono a una palomita).
 */
export function useShare() {
  const copied = ref(false)

  async function share(data: ShareData) {
    const url = new URL(data.path, window.location.origin).href
    if (navigator.share) {
      // Cancelar el menú nativo lanza AbortError: no es un error para el vecino
      await navigator.share({ title: data.title, text: data.text, url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  return { copied, share }
}
