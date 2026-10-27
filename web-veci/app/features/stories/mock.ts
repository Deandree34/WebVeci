/**
 * Historias de 24 h de los negocios.
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend.
 */

import type { Story } from '~/api/types'
import { findBusiness, toSummary } from '~/features/businesses/mock'

export function makeMockStories(): Story[] {
  return [
    {
      id: 's1',
      business: toSummary(findBusiness('guero')!),
      kind: 'Oferta de hoy',
      headline: 'Corte + barba $150',
      text: 'Antes $180 · quedan 4 lugares',
      action: { label: 'Apartar lugar', target: 'booking' },
      promo: findBusiness('guero')!.promo,
      seen: false
    },
    {
      id: 's2',
      business: toSummary(findBusiness('bellaluz')!),
      kind: 'Horarios libres',
      headline: 'Manicure desde $180',
      text: '20% de descuento martes y miércoles',
      action: { label: 'Apartar cita', target: 'booking' },
      seen: false
    }
  ]
}
