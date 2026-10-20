<script setup lang="ts">
import type { WeekSchedule } from '~/utils/hours'

/** Estado con el horario de la semana (`weekHours`), o el general si no hay. Solo neutros: abierto en blanco, cerrado en gris. */
const props = defineProps<{ schedule: WeekSchedule }>()

const now = useNow()
const status = computed(() => scheduleStatus(props.schedule, now.value))
</script>

<template>
  <span class="inline-flex items-center gap-xxs" :class="status.open ? 'text-ink' : 'text-body'">
    <span class="size-1.5 rounded-full" :class="status.open ? 'bg-ink' : 'bg-muted-soft'" aria-hidden="true" />
    {{ status.label }}
  </span>
</template>
