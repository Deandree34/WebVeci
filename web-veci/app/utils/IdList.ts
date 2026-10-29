import type { Ref } from 'vue'

/**
 * Lista de IDs en memoria con las operaciones que comparten los stores del vecino
 * (guardar, recomendar, marcar como visto o leído). Auto-importada por Nuxt.
 *
 * Los IDs viven en un `ref` para que el store los exponga y Pinia los serialice en SSR:
 * el store devuelve `list.ids` y envuelve los métodos que necesite.
 */
export class IdList {
  readonly ids: Ref<string[]> = ref([])

  has(id: string): boolean {
    return this.ids.value.includes(id)
  }

  /** Agrega al final (si no está). */
  add(id: string): void {
    if (!this.has(id)) this.ids.value = [...this.ids.value, id]
  }

  /** Agrega varios a la vez, sin repetir. */
  addMany(ids: string[]): void {
    this.ids.value = [...new Set([...this.ids.value, ...ids])]
  }

  remove(id: string): void {
    this.ids.value = this.ids.value.filter((item) => item !== id)
  }

  /** Lo quita si ya está; si no, lo pone al principio (lo más reciente primero). */
  toggle(id: string): void {
    if (this.has(id)) {
      this.remove(id)
      return
    }
    this.ids.value = [id, ...this.ids.value]
  }
}
