import type { Business } from '~/api/types'

const partText = { morning: 'en la mañana', afternoon: 'en la tarde', night: 'en la noche' } as const

const levels = {
  available: { filled: 3, label: 'Disponible' },
  few: { filled: 2, label: 'Pocos lugares' },
  last: { filled: 1, label: 'Último lugar' }
} as const

/**
 * Disponibilidad de citas de un negocio, calculada al momento (nunca horas exactas):
 * título, fecha con lugar (hoja de calendario) y nivel.
 */
export function useAvailability(business: () => Business) {
  const now = useNow()

  const summary = computed(() => {
    const availability = business().availability
    return availability ? availabilitySummary(availability, colonyHour(now.value)) : undefined
  })
  const full = computed(() => summary.value?.level === 'full')

  const title = computed(() => {
    const s = summary.value
    if (!s || full.value) return 'Por ahora sin lugar'
    if (s.day === 'tomorrow') return 'Agenda abierta para mañana'
    return `Hay lugar hoy ${s.parts.map((part) => partText[part]).join(' y ')}`
  })

  /** Fecha con lugar en la colonia, para la hoja de calendario ("OCT · 19 · LUN"). */
  const day = computed(() => {
    const s = summary.value
    if (!s || full.value || !s.day) return undefined
    const today = colonyToday(now.value)
    const date = s.day === 'today' ? today : addDays(today, 1)
    return { date, number: Number(date.slice(8)), month: monthShort(date), weekday: weekdayShort(date), isToday: s.day === 'today' }
  })

  const level = computed(() => (summary.value && !full.value ? levels[summary.value.level as keyof typeof levels] : undefined))

  return { summary, full, title, day, level }
}
