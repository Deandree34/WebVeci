/**
 * Avisos de la colonia (datos tomados del prototipo `veci-feed.html`).
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend.
 * Las fechas se calculan desde hoy en la colonia para que siempre sean próximas.
 */

import type { Notice } from '../types'
import { addDays, colonyToday, weekdayOf } from '../../utils/hours'

/** Próximo `weekday` (0 = domingo) desde `today`, más `extraWeeks` semanas. */
function next(today: string, weekday: number, extraWeeks = 0): string {
  return addDays(today, ((weekday - weekdayOf(today) + 7) % 7) + extraWeeks * 7)
}

export function makeMockNotices(now: number): Notice[] {
  const today = colonyToday(now)
  return [
    {
      id: 'agua',
      title: 'Corte de agua programado',
      detail: '9 am a 2 pm · De Hidalgo a Juárez',
      date: next(today, 6),
      icon: 'material-symbols:water-drop-outline'
    },
    {
      id: 'tianguis',
      title: 'Tianguis del jueves',
      detail: 'Calle Morelos · 8 am a 4 pm',
      date: next(today, 4),
      icon: 'material-symbols:storefront-outline'
    },
    {
      id: 'feria',
      title: 'Feria de emprendedores',
      detail: 'Parque central · entrada libre',
      date: next(today, 0, 1),
      icon: 'material-symbols:celebration-outline'
    }
  ].sort((a, z) => a.date.localeCompare(z.date))
}
