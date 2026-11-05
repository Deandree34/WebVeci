import type { Business } from '~/api/types'
import { businessPath } from '#layers/social/nav'
import { useRecommendedStore } from '../stores'

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

  const { copied, share: shareLink } = useShare()
  function share() {
    const { name, slug } = toValue(business)
    return shareLink({ title: name, path: businessPath(slug) })
  }

  return { isRecommended, total, toggleRecommend, copied, share }
}
