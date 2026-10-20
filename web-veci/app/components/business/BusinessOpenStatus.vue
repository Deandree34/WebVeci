<script setup lang="ts">
import type { WeekSchedule } from '~/utils/hours'

/** Estado con el horario de la semana (`weekHours`), o el general si no hay. */
const props = defineProps<{ schedule: WeekSchedule }>()

const now = useNow()
const status = computed(() => scheduleStatus(props.schedule, now.value))
</script>

<template>
  <span class="inline-flex items-center gap-xxs" :class="status.open ? 'text-success' : 'text-muted'">
    <span class="size-1.5 rounded-full" :class="status.open ? 'bg-success' : 'bg-muted-soft'" aria-hidden="true" />
    {{ status.label }}
  </span>
</template>
