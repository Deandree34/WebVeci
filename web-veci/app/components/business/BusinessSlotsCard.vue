<script setup lang="ts">
import type { Availability, BookingRequest } from '~/api/types'
import type { DayPart, WeekSchedule } from '~/utils/hours'

/**
 * "¿Cuándo me pueden atender?": Hoy / Mañana con cuántos lugares hay, y los horarios
 * agrupados por franja (mañana, tarde, noche). Tocar un horario abre "Apartar cita" con él.
 * `schedule`: horario del negocio; si aún no abre hoy, se aclara a qué hora (los horarios de
 * hoy siguen siendo apartables aunque la cabecera diga "Cerrado").
 */
const props = defineProps<{ availability: Availability, schedule?: WeekSchedule }>()
defineEmits<{ pick: [day: BookingRequest['day'], time: string] }>()

const now = useNow()
/** Los de hoy que ya pasaron no se muestran. */
const byDay = computed(() => {
  const free = freeSlots(props.availability, colonyHour(now.value))
  return { today: free.day === 'today' ? free.slots : [], tomorrow: props.availability.tomorrow }
})

const day = ref<BookingRequest['day']>('today')
// Si hoy ya no hay lugares, se abre en mañana
watchEffect(() => {
  if (!byDay.value.today.length && day.value === 'today') day.value = 'tomorrow'
})

const partLabels: Record<DayPart, string> = { morning: 'Mañana', afternoon: 'Tarde', night: 'Noche' }
const groups = computed(() => {
  const result: { part: DayPart, slots: string[] }[] = []
  for (const slot of byDay.value[day.value]) {
    const [h, m] = slot.split(':').map(Number)
    const part = dayPart(h! + m! / 60)
    const group = result.find((item) => item.part === part)
    if (group) group.slots.push(slot)
    else result.push({ part, slots: [slot] })
  }
  return result
})

const days = [{ id: 'today', label: 'Hoy' }, { id: 'tomorrow', label: 'Mañana' }] as const

/** Hora a la que abre hoy, si todavía no abre y hay horarios libres hoy ("10 am"). */
const opensToday = computed(() => {
  const schedule = props.schedule
  if (!schedule || day.value !== 'today' || !byDay.value.today.length) return undefined
  if (scheduleStatus(schedule, now.value).open) return undefined
  const hour = colonyHour(now.value)
  const next = hoursForDay(schedule, colonyWeekday(now.value)).find(([open]) => open > hour)
  return next ? formatHour(next[0]) : undefined
})
</script>

<template>
  <BusinessProfileCard id="horarios" title="Horarios libres" subtitle="Toca un horario para apartar tu cita">
    <!-- Selector Hoy / Mañana con cuántos lugares quedan (el elegido en blanco) -->
    <div class="grid grid-cols-2 gap-xxs rounded-pill border border-hairline p-xxs" role="tablist" aria-label="Día">
      <button
        v-for="option in days"
        :key="option.id"
        type="button"
        role="tab"
        :aria-selected="day === option.id"
        class="h-9 rounded-pill text-label font-semibold transition-colors"
        :class="day === option.id ? 'bg-ink text-canvas' : 'text-body hover:text-ink'"
        @click="day = option.id"
      >
        {{ option.label }}
        <span class="ml-xxs text-support font-medium tabular-nums" :class="day === option.id ? 'text-canvas/70' : 'text-muted'">
          {{ byDay[option.id].length ? `${byDay[option.id].length} libres` : 'lleno' }}
        </span>
      </button>
    </div>

    <!-- Aún cerrado pero con lugares hoy: se aclara para que no choque con el "Cerrado" de arriba -->
    <p v-if="opensToday && groups.length" class="mt-sm flex items-center gap-xs text-support leading-[1.4] text-body">
      <Icon name="material-symbols:schedule-outline" size="16" class="shrink-0 text-muted" aria-hidden="true" />
      <span>Abre hoy a las {{ opensToday }}<span class="mx-1 text-muted" aria-hidden="true">·</span>ya puedes apartar tu lugar</span>
    </p>

    <div v-if="groups.length" class="mt-md flex flex-col gap-md">
      <div v-for="group in groups" :key="group.part">
        <!-- Franja en Lora cursiva, como los rótulos de la ventana de apartar -->
        <p class="mb-xs font-quote text-copy font-medium text-body italic">{{ partLabels[group.part] }}</p>
        <div class="grid grid-cols-3 gap-xs sm:grid-cols-4">
          <button
            v-for="slot in group.slots"
            :key="slot"
            type="button"
            class="h-10 rounded-control border border-hairline-strong font-headline text-label font-semibold text-ink tabular-nums transition-colors hover:bg-surface-soft"
            @click="$emit('pick', day, slot)"
          >
            {{ slot }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="mt-md flex flex-col items-center gap-sm py-md text-center">
      <Icon name="material-symbols:event-busy-outline" size="28" class="text-muted" aria-hidden="true" />
      <p class="text-label font-medium text-body">{{ day === 'today' ? 'Hoy ya no hay lugares' : 'Mañana aún no hay horarios' }}</p>
      <button
        v-if="day === 'today' && byDay.tomorrow.length"
        type="button"
        class="h-9 rounded-pill border border-hairline-strong px-md text-label font-semibold text-body-strong transition-colors hover:bg-surface-elevated"
        @click="day = 'tomorrow'"
      >
        Ver mañana
      </button>
    </div>
  </BusinessProfileCard>
</template>
