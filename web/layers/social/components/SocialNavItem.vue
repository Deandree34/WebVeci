<script setup lang="ts">
/**
 * Ítem del menú lateral (fuente del sistema, como Facebook): activo = ícono relleno y negritas;
 * inactivo = contorno y gris. Está activo si la ruta actual es `to` (o empieza con él).
 * `badge`: contador ocre a la derecha (desde lg).
 */
interface SocialNavItemProps {
  icon: string
  activeIcon?: string
  label: string
  to: string
  badge?: string | number
}

const props = defineProps<SocialNavItemProps>()

const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/') return route.path === '/'
  return route.path.startsWith(props.to)
})

const currentIcon = computed(() => {
  if (isActive.value && props.activeIcon) return props.activeIcon
  return props.icon
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex items-center justify-center gap-md rounded-control px-sm py-sm transition-colors hover:bg-surface-soft lg:justify-start"
    :class="isActive ? 'text-on-dark' : 'text-muted hover:text-on-dark'"
    :aria-current="isActive ? 'page' : undefined"
    :title="label"
  >
    <Icon :name="currentIcon" size="24" class="shrink-0" aria-hidden="true" />
    <span class="hidden truncate text-copy lg:inline" :class="isActive ? 'font-semibold' : 'font-medium'">{{ label }}</span>
    <!-- Contador en blanco (solo neutros) -->
    <BCounter v-if="badge" :value="badge" size="md" class="ml-auto hidden lg:inline" />
  </NuxtLink>
</template>
