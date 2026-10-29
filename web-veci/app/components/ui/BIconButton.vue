<script setup lang="ts">
/** Botón circular de 40px con solo un ícono (slot); `label` es lo que se lee en voz alta. */
interface BIconButtonProps {
  label: string
}

defineProps<BIconButtonProps>()
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="inline-flex size-10 items-center justify-center rounded-full bg-transparent text-on-dark transition-colors hover:bg-surface-elevated"
  >
    <slot />
  </button>
</template>
