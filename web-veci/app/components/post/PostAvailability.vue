<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Aviso de citas disponibles: franja del día y nivel de disponibilidad, calculados al
 * momento. Nunca horas exactas (se ocupan a cada rato): esas se ven al apartar.
 * Todo el bloque abre el negocio con la hoja de reserva (`?cita=1`).
 */
const props = defineProps<{ business: Business }>()

const now = useNow()
const summary = computed(() =>
  props.business.availability ? availabilitySummary(props.business.availability, colonyHour(now.value)) : undefined
)
const full = computed(() => summary.value?.level === 'full')

const partText = { morning: 'en la mañana', afternoon: 'en la tarde', night: 'en la noche' } as const
const title = computed(() => {
  const s = summary.value
  if (!s || full.value) return 'Por ahora sin lugar'
  if (s.day === 'tomorrow') return 'Agenda abierta para mañana'
  return `Hay lugar hoy ${s.parts.map((part) => partText[part]).join(' y ')}`
})

const levels = {
  available: { filled: 3, label: 'Disponible' },
  few: { filled: 2, label: 'Pocos lugares' },
  last: { filled: 1, label: 'Último lugar' }
} as const
const level = computed(() => (summary.value && !full.value ? levels[summary.value.level as keyof typeof levels] : undefined))

const services = computed(() =>
  (props.business.services ?? []).slice(0, 2).map((service) => `${service.name} ${formatMoney(service.price)}`).join(' · ')
)
</script>

<template>
  <div v-if="summary" class="mx-md pt-md pb-sm">
    <p class="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.06em] text-veci-purple-text uppercase">
      <Icon name="material-symbols:calendar-month" size="14" aria-hidden="true" />
      Citas disponibles
    </p>

    <NuxtLink
      :to="{ path: businessPath(business.slug), query: { cita: '1' } }"
      class="group block pt-xs transition-opacity"
      :class="{ 'opacity-45': full }"
    >
      <span class="block text-[24px] leading-[1.05] font-extrabold tracking-[-0.025em] text-ink group-hover:text-veci-gradient sm:text-[30px]">
        {{ title }}
      </span>
      <span v-if="services" class="mt-xxs block text-body-sm text-muted">{{ services }}</span>

      <span class="mt-sm flex items-center justify-between gap-sm">
        <span v-if="level" class="inline-flex items-center gap-xs">
          <span class="flex gap-1" aria-hidden="true">
            <span v-for="n in 3" :key="n" class="h-1.5 w-5 rounded-full" :class="n <= level.filled ? 'bg-veci-gradient' : 'bg-ink/7'" />
          </span>
          <span class="inline-block text-[12px] font-semibold text-veci-gradient">{{ level.label }}</span>
        </span>
        <span class="ml-auto inline-flex items-center text-body-xs text-muted transition-colors group-hover:text-ink">
          Ver horarios y apartar
          <Icon name="material-symbols:chevron-right" size="16" aria-hidden="true" />
        </span>
      </span>
    </NuxtLink>
  </div>
</template>
