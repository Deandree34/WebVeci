<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Fila de negocio. `rail` (columna derecha): punto verde en el avatar en lugar del texto
 * "Abierto", y segunda línea corta "Hasta 9 pm · 400 m".
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
  <NuxtLink
    :to="businessPath(business.slug)"
    class="flex items-center gap-sm rounded-control transition-colors hover:bg-surface-soft"
    :class="compact || rail ? 'px-xs py-xs' : 'p-sm'"
  >
    <BusinessAvatar :icon="business.icon" :size="compact || rail ? 'sm' : 'md'" :open="rail && status.open" />
    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-xxs">
        <span class="truncate text-body-sm font-medium text-on-dark">{{ business.name }}</span>
        <BusinessVerified v-if="business.verified" />
      </span>
      <span v-if="rail" class="block truncate text-body-xs text-muted">
        <span class="sr-only">{{ status.open ? 'Abierto' : '' }} · </span>{{ until }} · {{ formatDistance(business.distanceMeters) }}
      </span>
      <span v-else class="flex flex-wrap items-center gap-x-xs text-body-xs text-muted">
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
