<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

const props = defineProps<{ business: Business }>()

const now = useNow()
const free = computed(() =>
  props.business.availability ? freeSlots(props.business.availability, colonyHour(now.value)) : undefined
)
const firstService = computed(() => props.business.services?.[0])
</script>

<template>
  <div v-if="free" class="px-md py-sm">
    <p class="text-body-md text-body-strong">
      {{ free.day === 'today' ? 'Todavía tengo lugar hoy' : 'Para mañana tengo estos horarios' }}.
      <template v-if="firstService">{{ firstService.name }} desde {{ formatMoney(firstService.price) }}.</template>
    </p>

    <!-- Cada horario lleva al negocio con el horario preseleccionado (apartar cita: Fase 4) -->
    <div class="mt-sm flex flex-wrap items-center gap-xs">
      <span class="text-body-xs font-medium text-muted">{{ free.day === 'today' ? 'Hoy' : 'Mañana' }}</span>
      <NuxtLink
        v-for="slot in free.slots"
        :key="slot"
        :to="{ path: businessPath(business.slug), query: { dia: free.day, hora: slot } }"
        class="rounded-control border border-hairline-strong px-sm py-xxs text-body-sm font-medium tabular-nums text-on-dark transition-colors hover:border-primary hover:bg-surface-elevated"
      >
        {{ slot }}
      </NuxtLink>
    </div>
  </div>
</template>
