<script setup lang="ts">
import type { Business } from '~/api/types'

defineProps<{ business: Business }>()
</script>

<template>
  <footer class="mx-md flex flex-wrap items-center justify-between gap-sm border-t border-hairline-strong py-sm">
    <p class="flex flex-wrap items-center gap-x-xs text-body-xs text-muted">
      <BusinessOpenStatus :hours="business.hours" />
      <span aria-hidden="true">·</span>
      <span class="inline-flex items-center gap-xxs">
        <Icon name="material-symbols:star" size="14" class="text-warning" aria-hidden="true" />
        {{ business.rating.toFixed(1) }}
      </span>
      <span aria-hidden="true">·</span>
      <span>{{ business.recommendations }} vecinos lo recomiendan</span>
    </p>
    <div class="flex items-center gap-xs"><slot /></div>
  </footer>
</template>
