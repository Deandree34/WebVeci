<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Fila de negocio. `rail` (columna derecha, sección "Abierto ahora"): con el sistema tipográfico de
 * los posts y avisos (nombre y apoyo "Hasta 9 pm · 400 m" en Plus Jakarta Sans); sin texto ni punto
 * de "Abierto", porque el título de la sección ya lo dice.
 */
const props = withDefaults(defineProps<{ business: Business, compact?: boolean, rail?: boolean }>(), { compact: false, rail: false })

const now = useNow()
const status = computed(() => scheduleStatus(props.business, now.value))
/** "Abierto · hasta 9 pm" → "Hasta 9 pm" (el punto verde ya dice que está abierto). */
const until = computed(() => {
  const label = status.value.label.replace(/^Abierto · /, '')
  return label.charAt(0).toUpperCase() + label.slice(1)
})
</script>

<template>
  <!-- Columna derecha: misma rejilla que los avisos (columna de 40px + texto) -->
  <NuxtLink
    v-if="rail"
    :to="businessPath(business.slug)"
    class="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-sm rounded-control px-sm py-sm transition-colors hover:bg-surface-soft"
  >
    <span class="flex justify-center"><BusinessAvatar :icon="business.icon" size="sm" /></span>
    <span class="min-w-0 font-headline">
      <span class="flex items-center gap-xxs">
        <span class="truncate text-[14px] leading-[1.3] font-semibold text-ink">{{ business.name }}</span>
        <BusinessVerified v-if="business.verified" :size="14" />
      </span>
      <span class="mt-0.5 block truncate text-[13px] leading-[1.4] font-medium text-body [word-spacing:0.08em]">
        <span class="sr-only">{{ status.open ? 'Abierto' : '' }} · </span>{{ until }}<span class="mx-1 text-muted" aria-hidden="true">·</span>{{ formatDistance(business.distanceMeters) }}
      </span>
    </span>
  </NuxtLink>

  <NuxtLink
    v-else
    :to="businessPath(business.slug)"
    class="flex items-center gap-sm rounded-control transition-colors hover:bg-surface-soft"
    :class="compact ? 'px-xs py-xs' : 'p-sm'"
  >
    <BusinessAvatar :icon="business.icon" :size="compact ? 'sm' : 'md'" />
    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-xxs">
        <span class="truncate text-body-sm font-medium text-on-dark">{{ business.name }}</span>
        <BusinessVerified v-if="business.verified" />
      </span>
      <span class="flex flex-wrap items-center gap-x-xs text-body-xs text-muted">
        <BusinessOpenStatus :schedule="business" />
        <span aria-hidden="true">·</span>
        <span>{{ formatDistance(business.distanceMeters) }}</span>
        <template v-if="!compact">
          <span aria-hidden="true">·</span>
          <span>{{ business.subcategory }}</span>
        </template>
      </span>
    </span>
  </NuxtLink>
</template>
