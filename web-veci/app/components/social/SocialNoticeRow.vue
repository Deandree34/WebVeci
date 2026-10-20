<script setup lang="ts">
import type { Notice } from '~/api/types'

/** Aviso de la colonia con bloque de fecha (prototipo `veci-feed`: día grande + día de la semana). */
const props = defineProps<{ notice: Notice }>()

const now = useNow()
const days = computed(() => daysUntil(props.notice.date, now.value))
const when = computed(() => (days.value === 0 ? 'Hoy' : days.value === 1 ? 'Mañana' : `En ${days.value} días`))
</script>

<template>
  <div class="grid grid-cols-[40px_1fr] items-center gap-sm rounded-control px-sm py-xs">
    <time :datetime="notice.date" class="text-center leading-none">
      <span class="block text-[22px] font-extrabold tracking-[-0.02em] text-ink">{{ Number(notice.date.slice(8)) }}</span>
      <span class="text-[10px] font-bold tracking-[0.12em] text-veci-purple-text">{{ weekdayShort(notice.date) }}</span>
    </time>
    <div class="min-w-0">
      <p class="flex items-center gap-xxs text-body-sm leading-[1.3] text-on-dark">
        <Icon :name="notice.icon" size="16" class="shrink-0 text-muted" aria-hidden="true" />
        <span class="truncate">{{ notice.title }}</span>
      </p>
      <p class="truncate text-body-xs text-muted">
        <span :class="days <= 1 ? 'font-medium text-veci-purple-text' : ''">{{ when }}</span> · {{ notice.detail }}
      </p>
    </div>
  </div>
</template>
