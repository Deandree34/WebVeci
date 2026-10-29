import type { Promo } from '~/api/types'

/**
 * Cuenta regresiva de una promoción: ms restantes, si ya terminó y % de tiempo que queda.
 * Usa la hora compartida (`useNow`), así el primer render coincide entre SSR y cliente.
 */
export function usePromoCountdown(promo: () => Promo) {
  const now = useNow(1000)
  const promoTime = computed(() => promoWindow(promo(), now.value))
  const left = computed(() => promoTime.value.endsAt - now.value)
  const expired = computed(() => left.value <= 0)
  const progress = computed(() => Math.max(0, Math.min(100, (left.value / promoTime.value.span) * 100)))

  return { left, expired, progress }
}
