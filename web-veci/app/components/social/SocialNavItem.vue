<script setup lang="ts">
/** Ítem del menú lateral (fuente del sistema, como Facebook): activo = ícono relleno y negritas; inactivo = contorno y gris. */
// `active: undefined` explícito: si no, Vue convierte la prop booleana ausente en `false`
// y el `??` de abajo nunca consulta la ruta (ningún ítem se marcaba activo).
const props = withDefaults(defineProps<{
  icon: string
  activeIcon?: string
  label: string
  to: string
  active?: boolean
  badge?: string | number
}>(), { active: undefined })

const route = useRoute()
const isActive = computed(() =>
  props.active ?? (props.to === '/' ? route.path === '/' : route.path.startsWith(props.to))
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex items-center justify-center gap-md rounded-control px-sm py-sm transition-colors hover:bg-surface-soft lg:justify-start"
    :class="isActive ? 'text-on-dark' : 'text-muted hover:text-on-dark'"
    :aria-current="isActive ? 'page' : undefined"
    :title="label"
  >
    <Icon :name="isActive && activeIcon ? activeIcon : icon" size="24" class="shrink-0" aria-hidden="true" />
    <span class="hidden truncate text-copy lg:inline" :class="isActive ? 'font-semibold' : 'font-medium'">{{ label }}</span>
    <!-- Contador en blanco (solo neutros) -->
    <span
      v-if="badge"
      class="ml-auto hidden min-w-5 rounded-pill bg-ink px-xxs text-center font-headline text-meta leading-5 font-bold text-canvas lg:inline"
    >
      {{ badge }}
    </span>
  </NuxtLink>
</template>
