/**
 * Notificaciones del vecino.
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend.
 * Se arman con los negocios de prueba para que el texto y el enlace coincidan con su página.
 */

import type { AppNotification } from '../../app/api/types'
import { findBusiness } from './business'

const MINUTE = 60_000

/** Notificaciones de la más reciente a la más antigua, relativas a `now`. */
export function makeMockNotifications(now: number): AppNotification[] {
  const guero = findBusiness('guero')!
  const bellaluz = findBusiness('bellaluz')!
  const at = (minutesAgo: number) => new Date(now - minutesAgo * MINUTE).toISOString()

  return [
    {
      id: 'n1',
      kind: 'cita',
      businessId: guero.id,
      actor: guero.name,
      text: 'liberó un lugar hoy a las 19:45. Apártalo antes de que se ocupe.',
      to: `/negocio/${guero.slug}?cita=1`,
      createdAt: at(20)
    },
    {
      id: 'n2',
      kind: 'publicacion',
      businessId: guero.id,
      actor: guero.name,
      text: 'publicó una novedad: “Estrenamos local en Calle Hidalgo 56”.',
      to: `/negocio/${guero.slug}`,
      createdAt: at(120)
    },
    {
      id: 'n3',
      kind: 'oferta',
      businessId: bellaluz.id,
      actor: bellaluz.name,
      text: 'tiene 20% en manicure martes y miércoles.',
      to: `/negocio/${bellaluz.slug}`,
      createdAt: at(240)
    },
    {
      id: 'n4',
      kind: 'recomendacion',
      businessId: guero.id,
      actor: 'Ana, Carlos y 3 vecinos más',
      text: `recomendaron ${guero.name}.`,
      to: `/negocio/${guero.slug}`,
      createdAt: at(60 * 26)
    },
    {
      id: 'n5',
      kind: 'aviso',
      actor: 'Aviso de la colonia',
      text: 'el sábado hay tianguis de 9 am a 2 pm, de Hidalgo a Juárez.',
      to: '/',
      createdAt: at(60 * 30)
    }
  ]
}
