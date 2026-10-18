<script setup lang="ts">
import type { FeedTab } from '~/api/types'

/** Pestañas del feed; `undefined` = "Para ti" (todo). */
const tab = defineModel<FeedTab | undefined>()

const tabs: { value: FeedTab | undefined, label: string, icon: string }[] = [
  { value: undefined, label: 'Para ti', icon: 'material-symbols:home' },
  { value: 'ofertas', label: 'Ofertas', icon: 'material-symbols:sell' },
  { value: 'citas', label: 'Citas', icon: 'material-symbols:calendar-month' }
]
</script>

<template>
  <div class="mb-md flex gap-xs overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Filtrar el feed">
    <button
      v-for="option in tabs"
      :key="option.label"
      type="button"
      role="tab"
      :aria-selected="tab === option.value"
      class="inline-flex shrink-0 items-center gap-xxs rounded-pill px-md py-xs text-body-sm font-medium transition-colors"
      :class="tab === option.value ? 'bg-on-dark text-canvas' : 'bg-surface-card text-muted hover:text-on-dark'"
      @click="tab = option.value"
    >
      <Icon :name="option.icon" size="18" aria-hidden="true" />
      {{ option.label }}
    </button>
  </div>
</template>
