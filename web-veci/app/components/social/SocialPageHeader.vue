<script setup lang="ts">
defineProps<{ title: string, description?: string, icon?: string }>()
</script>

<template>
  <header class="mb-lg flex items-center gap-sm">
    <span
      v-if="icon"
      class="inline-flex size-12 shrink-0 items-center justify-center rounded-card bg-surface-card text-on-dark"
      aria-hidden="true"
    >
      <Icon :name="icon" size="26" />
    </span>
    <div class="min-w-0">
      <h1 class="text-title-md font-medium normal-case tracking-normal text-ink">{{ title }}</h1>
      <p v-if="description" class="text-body-sm text-muted">{{ description }}</p>
    </div>
  </header>
</template>
