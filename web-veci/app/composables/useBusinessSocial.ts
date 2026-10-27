import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'
import { useRecommendedStore } from '~/features/businesses/stores'

/**
 * Lo social de un negocio, compartido por el pie de los posts y la cabecera del perfil:
 * recomendar (suma al "N vecinos lo recomiendan", no es un "me gusta") y compartir el enlace.
 */
export function useBusinessSocial(business: MaybeRefOrGetter<Business>) {
  const recommended = useRecommendedStore()
  const isRecommended = computed(() => recommended.isRecommended(toValue(business).id))
  const total = computed(() => toValue(business).recommendations + (isRecommended.value ? 1 : 0))

  function toggleRecommend() {
    recommended.toggle(toValue(business).id)
  }

  const copied = ref(false)
  async function share() {
    const { name, slug } = toValue(business)
    const url = new URL(businessPath(slug), window.location.origin).href
    if (navigator.share) {
      // Cancelar el menú nativo lanza AbortError: no es un error para el vecino
      await navigator.share({ title: name, url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }

  return { isRecommended, total, toggleRecommend, copied, share }
}
