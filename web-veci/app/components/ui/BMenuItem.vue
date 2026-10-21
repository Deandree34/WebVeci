<script setup lang="ts">
/**
 * Opción de un `BPopover`: ícono, qué hace y (opcional) una línea de apoyo. Al elegirla emite
 * `select` y cierra el menú. Con `to` es un enlace (p. ej. a una página); sin él, un botón.
 * `active`: la opción ya está hecha por ti (p. ej. guardado): su ícono va en ocre.
 */
const props = defineProps<{ icon: string, label: string, support?: string, to?: string, active?: boolean }>()
const emit = defineEmits<{ select: [] }>()

const closeMenu = inject<() => void>('closeMenu', () => {})
const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'button'))

function onSelect() {
  emit('select')
  closeMenu()
}
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :type="to ? undefined : 'button'"
    role="menuitem"
    class="flex w-full items-start gap-sm rounded-control px-sm py-xs text-left transition-colors hover:bg-surface-elevated focus-visible:bg-surface-elevated focus-visible:outline-none"
    @click="onSelect"
  >
    <Icon :name="icon" size="22" class="mt-0.5 shrink-0" :class="active ? 'text-brand' : 'text-ink'" aria-hidden="true" />
    <span class="min-w-0 self-center">
      <span class="block text-copy leading-[1.3] font-semibold text-ink">{{ label }}</span>
      <span v-if="support" class="mt-0.5 block text-support leading-[1.4] text-body">{{ support }}</span>
    </span>
  </component>
</template>
