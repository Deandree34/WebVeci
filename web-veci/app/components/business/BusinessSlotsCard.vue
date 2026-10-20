<script setup lang="ts">
import type { Availability, BookingRequest } from '~/api/types'
import type { DayPart } from '~/utils/hours'

/**
 * "¿Cuándo me pueden atender?": Hoy / Mañana con cuántos lugares hay, y los horarios
 * agrupados por franja (mañana, tarde, noche). Tocar un horario abre "Apartar cita" con él.
 */
const props = defineProps<{ availability: Availability }>()
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
</script>

<template>
  <BusinessProfileCard id="horarios" title="Horarios libres" icon="material-symbols:event-available-outline" subtitle="Toca un horario para apartar tu cita">
    <!-- Selector Hoy / Mañana con cuántos lugares quedan -->
    <div class="grid grid-cols-2 gap-xxs rounded-control bg-surface-soft p-xxs" role="tablist" aria-label="Día">
      <button
        v-for="option in days"
        :key="option.id"
        type="button"
        role="tab"
        :aria-selected="day === option.id"
        class="rounded-sm py-xs text-body-sm font-medium transition-colors"
        :class="day === option.id ? 'bg-surface-elevated text-ink' : 'text-muted hover:text-body'"
        @click="day = option.id"
      >
        {{ option.label }}
        <span class="ml-xxs text-body-xs tabular-nums" :class="byDay[option.id].length ? 'text-veci-purple-text' : 'text-muted-soft'">
          {{ byDay[option.id].length ? `${byDay[option.id].length} libres` : 'lleno' }}
        </span>
      </button>
    </div>

    <div v-if="groups.length" class="mt-md flex flex-col gap-md">
      <div v-for="group in groups" :key="group.part">
        <p class="mb-xs text-body-xs font-medium text-muted">{{ partLabels[group.part] }}</p>
        <div class="grid grid-cols-3 gap-xs sm:grid-cols-4">
          <button
            v-for="slot in group.slots"
            :key="slot"
            type="button"
            class="rounded-control border border-hairline-strong py-xs text-body-sm font-medium tabular-nums text-ink transition-colors hover:border-veci-purple hover:bg-surface-elevated"
            @click="$emit('pick', day, slot)"
          >
            {{ slot }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="mt-md flex flex-col items-center gap-xs py-md text-center">
      <Icon name="material-symbols:event-busy-outline" size="28" class="text-muted" aria-hidden="true" />
      <p class="text-body-sm text-body">{{ day === 'today' ? 'Hoy ya no hay lugares' : 'Mañana aún no hay horarios' }}</p>
      <button v-if="day === 'today' && byDay.tomorrow.length" type="button" class="text-body-sm font-medium text-link" @click="day = 'tomorrow'">
        Ver mañana
      </button>
    </div>
  </BusinessProfileCard>
</template>
