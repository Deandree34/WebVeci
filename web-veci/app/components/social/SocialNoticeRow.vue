<script setup lang="ts">
import type { Notice } from '~/api/types'

/**
 * Aviso de la colonia con el sistema tipográfico de los posts: ficha de fecha (día grande y,
 * debajo, el día de la semana o "Hoy"/"Mañana" resaltado en blanco), título y una línea de apoyo
 * (hora · lugar) en Plus Jakarta Sans. Solo neutros: la urgencia se marca con contraste, no con color.
 */
const props = defineProps<{ notice: Notice }>()

const now = useNow()
const days = computed(() => daysUntil(props.notice.date, now.value))
const soon = computed(() => days.value <= 1)
const label = computed(() => (days.value === 0 ? 'Hoy' : days.value === 1 ? 'Mañana' : weekdayShort(props.notice.date)))
</script>

<template>
  <div class="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-sm px-sm py-sm">
    <time :datetime="notice.date" class="text-center leading-none">
      <span class="block font-headline text-[22px] font-bold tracking-[-0.02em] text-ink">{{ Number(notice.date.slice(8)) }}</span>
      <span class="mt-0.5 block text-[10px] font-bold tracking-[0.08em] uppercase" :class="soon ? 'text-ink' : 'text-muted'">{{ label }}</span>
    </time>
    <div class="min-w-0 font-headline">
      <p class="truncate text-[14px] leading-[1.3] font-semibold text-ink">{{ notice.title }}</p>
      <p class="mt-0.5 line-clamp-2 text-[13px] leading-[1.4] font-medium text-body [word-spacing:0.08em]">{{ notice.detail }}</p>
    </div>
  </div>
</template>
