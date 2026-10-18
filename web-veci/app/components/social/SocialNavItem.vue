<script setup lang="ts">
const props = defineProps<{
  icon: string
  label: string
  to: string
  active?: boolean
  badge?: string | number
}>()

const route = useRoute()
const isActive = computed(() =>
  props.active ?? (props.to === '/' ? route.path === '/' : route.path.startsWith(props.to))
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex items-center justify-center gap-md rounded-control px-sm py-sm transition-colors hover:bg-surface-soft lg:justify-start"
    :class="isActive ? 'bg-surface-card text-on-dark' : 'text-body'"
    :aria-current="isActive ? 'page' : undefined"
    :title="label"
  >
    <Icon :name="icon" size="24" class="shrink-0" aria-hidden="true" />
    <span class="hidden truncate text-body-sm font-medium lg:inline">{{ label }}</span>
    <span
      v-if="badge"
      class="ml-auto hidden min-w-5 rounded-pill bg-veci-pink px-xxs text-center text-body-xs font-medium text-on-accent lg:inline"
    >
      {{ badge }}
    </span>
  </NuxtLink>
</template>
