/**
 * Utilidades de horario (auto-importadas por Nuxt).
 *
 * Las horas se expresan como número decimal (`17.5` = 5:30 pm) en la zona horaria
 * de la colonia, no en la del navegador ni la del servidor: así SSR y cliente
 * calculan lo mismo. Obtener "ahora" con `useNow()` y pasarlo por `colonyHour()`.
 */

import type { Availability, HourRange, Promo } from '~/api/types'

/** Zona horaria de la colonia (una por ahora; luego vendrá de la colonia elegida). */
export const COLONY_TIME_ZONE = 'America/Mexico_City'

const DAY_MS = 86_400_000

/** Partes de fecha/hora de un instante en la zona de la colonia. */
function colonyParts(now: number) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: COLONY_TIME_ZONE,
    hourCycle: 'h23',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric'
  }).formatToParts(new Date(now))
  const get = (type: string) => parts.find((part) => part.type === type)!.value
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { hour: Number(get('hour')), minute: Number(get('minute')), weekday }
}

/** Hora decimal actual en la colonia, p. ej. `17.5`. */
export function colonyHour(now: number): number {
  const { hour, minute } = colonyParts(now)
  return hour + minute / 60
}

/** Hora decimal → texto corto, p. ej. `21` → "9 pm", `25` → "1 am". */
export function formatHour(hour: number): string {
  const h = Math.floor(hour % 24)
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${display} ${h < 12 ? 'am' : 'pm'}`
}

/** Rango que contiene la hora (considera rangos que cruzan la medianoche). */
function rangeAt(hours: HourRange[], hour: number): HourRange | undefined {
  return hours.find(([open, close]) => (hour >= open && hour < close) || (hour + 24 >= open && hour + 24 < close))
}

export function isOpenAt(hours: HourRange[], hour: number): boolean {
  return rangeAt(hours, hour) !== undefined
}

export function isOpen24h(hours: HourRange[]): boolean {
  return hours.length === 1 && hours[0]![0] === 0 && hours[0]![1] === 24
}

/** Estado legible, p. ej. "Abierto · hasta 9 pm" o "Cerrado · abre 10 am". */
export function openStatus(hours: HourRange[], hour: number): { open: boolean, label: string } {
  const range = rangeAt(hours, hour)
  if (range) {
    return { open: true, label: isOpen24h(hours) ? 'Abierto 24 h' : `Abierto · hasta ${formatHour(range[1])}` }
  }
  const next = hours.map(([open]) => open).find((open) => open > hour) ?? hours[0]![0]
  return { open: false, label: `Cerrado · abre ${formatHour(next)}` }
}

/** Horario completo, p. ej. "9 am – 2 pm y 4 pm – 8 pm". */
export function hoursText(hours: HourRange[]): string {
  if (isOpen24h(hours)) return 'Abierto 24 horas'
  return hours.map(([open, close]) => `${formatHour(open)} – ${formatHour(close)}`).join(' y ')
}

/** Horarios libres que aún no pasan; si hoy ya no hay, los de mañana. */
export function freeSlots(availability: Availability, hour: number): { day: 'today' | 'tomorrow', slots: string[] } {
  const left = availability.today.filter((slot) => {
    const [h, m] = slot.split(':').map(Number)
    return h! + m! / 60 > hour
  })
  return left.length ? { day: 'today', slots: left } : { day: 'tomorrow', slots: availability.tomorrow }
}

export type AvailabilityLevel = 'available' | 'few' | 'last' | 'full'

/**
 * Resumen de disponibilidad para el feed: qué día y en qué franjas hay lugar, y qué tanto.
 * No expone horas exactas (cambian a cada rato); esas se ven al apartar en el negocio.
 */
export function availabilitySummary(
  availability: Availability,
  hour: number
): { day: 'today' | 'tomorrow' | null, parts: DayPart[], level: AvailabilityLevel } {
  const free = freeSlots(availability, hour)
  if (!free.slots.length) return { day: null, parts: [], level: 'full' }

  const parts: DayPart[] = []
  for (const slot of free.slots) {
    const [h, m] = slot.split(':').map(Number)
    const part = dayPart(h! + m! / 60)
    if (!parts.includes(part)) parts.push(part)
  }
  const count = free.slots.length
  const level = count >= 4 ? 'available' : count >= 2 ? 'few' : 'last'
  return { day: free.day, parts, level }
}

/**
 * Fin de una promoción y duración total de su ventana (para la barra de progreso).
 * `today`: termina hoy a `endsAtHour` (o medianoche); `week`: el domingo a medianoche.
 */
export function promoWindow(promo: Promo, now: number): { endsAt: number, span: number } {
  const { hour, minute, weekday } = colonyParts(now)
  const startOfDay = now - (hour * 60 + minute) * 60_000 - (now % 60_000)

  if (promo.until === 'today') {
    return { endsAt: startOfDay + (promo.endsAtHour ?? 24) * 3_600_000, span: DAY_MS }
  }
  const daysToSunday = (7 - weekday) % 7
  return { endsAt: startOfDay + (daysToSunday + 1) * DAY_MS, span: 7 * DAY_MS }
}

export type DayPart = 'morning' | 'afternoon' | 'night'

/** Franja del día: mañana (5–12), tarde (12–19) o noche. */
export function dayPart(hour: number): DayPart {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 19) return 'afternoon'
  return 'night'
}
