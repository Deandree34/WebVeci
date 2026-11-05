<script setup lang="ts">
/**
 * Estado vacío: ícono gris, título en Lora cursiva (la app le habla al vecino) y explicación en la
 * fuente del sistema (slot por defecto). Slot `actions`: botones debajo.
 */
interface BEmptyStateProps {
  icon: string
  title: string
}

defineProps<BEmptyStateProps>()
</script>

<template>
  <div class="flex flex-col items-center rounded-card bg-surface-card px-lg py-xl text-center">
    <Icon :name="icon" size="40" class="mb-sm text-muted" aria-hidden="true" />
    <p class="font-quote text-heading leading-[1.3] font-medium text-ink italic">{{ title }}</p>
    <p v-if="$slots.default" class="mt-xxs max-w-copy text-copy leading-[1.45] text-body"><slot /></p>
    <div v-if="$slots.actions" class="mt-md"><slot name="actions" /></div>
  </div>
</template>
