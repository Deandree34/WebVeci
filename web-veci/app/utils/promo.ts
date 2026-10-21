import type { Business, Promo } from '~/api/types'
import { promoWindow } from './hours'

/** Todas las ofertas del negocio: la destacada (la del feed) primero y luego las demás. */
export function businessPromos(business: Business): Promo[] {
  return [business.promo, ...(business.extraPromos ?? [])].filter((promo): promo is Promo => !!promo)
}

/** Ofertas del negocio que siguen vigentes en `now`. */
export function activePromos(business: Business, now: number): Promo[] {
  return businessPromos(business).filter((promo) => promoWindow(promo, now).endsAt > now)
}

/**
 * Servicio de una oferta (por defecto la destacada): el de nombre más largo que aparece en su
 * texto ("Corte + barba $150" marca "Corte + barba", no también "Corte"). Sin coincidencia, `undefined`.
 */
export function promoService(business: Business, promo = business.promo): string | undefined {
  const text = promo?.text.toLowerCase()
  if (!text) return undefined
  return (business.services ?? [])
    .filter((service) => text.includes(service.name.toLowerCase()))
    .sort((a, b) => b.name.length - a.name.length)[0]?.name
}
