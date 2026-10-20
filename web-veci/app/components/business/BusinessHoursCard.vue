<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * "¿Cuándo abre?": estado grande arriba y la semana completa debajo, de lunes a domingo,
 * con el día de hoy resaltado y los días de descanso en gris.
 */
const props = defineProps<{ business: Business }>()

const now = useNow()
const status = computed(() => scheduleStatus(props.business, now.value))
const today = computed(() => colonyWeekday(now.value))

/** Lunes primero, como se lee un horario en México. */
const week = computed(() =>
  [1, 2, 3, 4, 5, 6, 0].map((weekday) => {
    const hours = hoursForDay(props.business, weekday)
    return { weekday, name: weekdayLong(weekday), text: dayHoursText(hours), closed: !hours.length }
  })
)
</script>

<template>
  <BusinessProfileCard id="horario" title="Horario">
    <!-- Estado de ahora: lo primero que se busca (abierto en blanco, cerrado en gris; sin verde) -->
    <p
      class="flex items-center gap-xs rounded-control border border-hairline px-sm py-xs font-headline text-[14px] font-semibold"
      :class="status.open ? 'text-ink' : 'text-body'"
    >
      <span class="size-2 shrink-0 rounded-full" :class="status.open ? 'bg-ink' : 'bg-muted-soft'" aria-hidden="true" />
      {{ status.label }}
    </p>

    <dl class="mt-sm flex flex-col font-headline">
      <div
        v-for="day in week"
        :key="day.weekday"
        class="flex items-center justify-between rounded-sm px-sm py-xs text-[14px]"
        :class="day.weekday === today ? 'bg-surface-soft font-semibold text-ink' : 'font-medium text-body'"
      >
        <dt class="flex items-center gap-xs">
          {{ day.name }}
          <span v-if="day.weekday === today" class="rounded-pill border border-hairline-strong px-xs text-[11px] leading-[1.6] font-semibold text-ink">Hoy</span>
        </dt>
        <dd class="tabular-nums" :class="{ 'text-muted-soft': day.closed }">{{ day.text }}</dd>
      </div>
    </dl>
  </BusinessProfileCard>
</template>
