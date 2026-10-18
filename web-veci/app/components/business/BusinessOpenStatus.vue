<script setup lang="ts">
import type { HourRange } from '~/api/types'

const props = defineProps<{ hours: HourRange[] }>()

const now = useNow()
const status = computed(() => openStatus(props.hours, colonyHour(now.value)))
</script>

<template>
  <span class="inline-flex items-center gap-xxs" :class="status.open ? 'text-success' : 'text-muted'">
    <span class="size-1.5 rounded-full" :class="status.open ? 'bg-success' : 'bg-muted-soft'" aria-hidden="true" />
    {{ status.label }}
  </span>
</template>
