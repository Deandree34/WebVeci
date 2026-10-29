<script setup lang="ts">
import type { Availability, BookingRequest } from '~/api/types'
import type { DayPart, WeekSchedule } from '~/utils/hours'

/**
 * "¿Cuándo me pueden atender?": Hoy / Mañana con cuántos lugares hay, y los horarios
 * agrupados por franja (mañana, tarde, noche). Tocar un horario abre "Apartar cita" con él.
 * `schedule`: horario del negocio; si aún no abre hoy, se aclara a qué hora (los horarios de
 * hoy siguen siendo apartables aunque la cabecera diga "Cerrado").
 */
interface BusinessSlotsCardProps {
  availability: Availability
  schedule?: WeekSchedule
}

interface BusinessSlotsCardEmits {
  pick: [day: BookingRequest['day'], time: string]
}

const PART_LABELS: Record<DayPart, string> = { morning: 'Mañana', afternoon: 'Tarde', night: 'Noche' }

function freeText(count: number) {
  if (count) return `${count} libres`
  return 'lleno'
}

const props = defineProps<BusinessSlotsCardProps>()
defineEmits<BusinessSlotsCardEmits>()

const now = useNow()

/** Los de hoy que ya pasaron no se muestran. */
const byDay = computed(() => {
  const free = freeSlots(props.availability, colonyHour(now.value))
  const today = free.day === 'today' ? free.slots : []
  return { today, tomorrow: props.availability.tomorrow }
})

const day = ref<BookingRequest['day']>('today')
// Si hoy ya no hay lugares, se abre en mañana
watchEffect(() => {
  if (!byDay.value.today.length && day.value === 'today') day.value = 'tomorrow'
})

/** Hoy / Mañana con cuántos lugares quedan. */
const dayOptions = computed(() => [
  { value: 'today' as const, label: 'Hoy', hint: freeText(byDay.value.today.length) },
  { value: 'tomorrow' as const, label: 'Mañana', hint: freeText(byDay.value.tomorrow.length) }
])

/** Horarios del día elegido, agrupados por franja. */
const groups = computed(() => {
  const result: { part: DayPart, label: string, slots: string[] }[] = []
  for (const slot of byDay.value[day.value]) {
    const [hours, minutes] = slot.split(':').map(Number)
    const part = dayPart(hours! + minutes! / 60)
    const group = result.find((item) => item.part === part)
    if (group) group.slots.push(slot)
    else result.push({ part, label: PART_LABELS[part], slots: [slot] })
  }
  return result
})

/** Hora a la que abre hoy, si todavía no abre y hay horarios libres hoy ("10 am"). */
const opensToday = computed(() => {
  const schedule = props.schedule
  if (!schedule || day.value !== 'today' || !byDay.value.today.length) return undefined
  if (scheduleStatus(schedule, now.value).open) return undefined
  const hour = colonyHour(now.value)
  const next = hoursForDay(schedule, colonyWeekday(now.value)).find(([open]) => open > hour)
  if (!next) return undefined
  return formatHour(next[0])
})

const emptyText = computed(() => (day.value === 'today' ? 'Hoy ya no hay lugares' : 'Mañana aún no hay horarios'))
const canSeeTomorrow = computed(() => day.value === 'today' && byDay.value.tomorrow.length > 0)

function showTomorrow() {
  day.value = 'tomorrow'
}
</script>

<template>
  <BusinessProfileCard id="horarios" title="Horarios libres" subtitle="Toca un horario para apartar tu cita">
    <!-- Selector Hoy / Mañana con cuántos lugares quedan (el elegido en blanco) -->
    <BSegmented v-model="day" :options="dayOptions" label="Día" variant="track" />

    <!-- Aún cerrado pero con lugares hoy: se aclara para que no choque con el "Cerrado" de arriba -->
    <p v-if="opensToday && groups.length" class="mt-sm flex items-center gap-xs text-support leading-[1.4] text-body">
      <Icon name="material-symbols:schedule-outline" size="16" class="shrink-0 text-muted" aria-hidden="true" />
      <span>Abre hoy a las {{ opensToday }}<BDot />ya puedes apartar tu lugar</span>
    </p>

    <div v-if="groups.length" class="mt-md flex flex-col gap-md">
      <div v-for="group in groups" :key="group.part">
        <!-- Franja en Lora cursiva, como los rótulos de la ventana de apartar -->
        <p class="mb-xs font-quote text-copy font-medium text-body italic">{{ group.label }}</p>
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
      <p class="text-label font-medium text-body">{{ emptyText }}</p>
      <BButton v-if="canSeeTomorrow" size="md" @click="showTomorrow">
        Ver mañana
      </BButton>
    </div>
  </BusinessProfileCard>
</template>
