<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

withDefaults(defineProps<{ business: Business, compact?: boolean }>(), { compact: false })
</script>

<template>
  <NuxtLink
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
        <BusinessOpenStatus :hours="business.hours" />
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
