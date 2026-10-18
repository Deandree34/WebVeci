import { useMineStore } from '~/stores/mine'
import { useSavedStore } from '~/stores/saved'

/** Contadores del vecino que muestra la navegación (Mis cosas, Guardados). */
export function useNavCounters() {
  const mine = useMineStore()
  const saved = useSavedStore()

  return reactive({
    mine: computed(() => mine.count),
    saved: computed(() => saved.count)
  })
}
