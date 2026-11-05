<script setup lang="ts">
/**
 * Colonia actual dentro del buscador (desde tablet); al tocarla se podrá cambiar (por ahora es visual).
 * `labelClass` permite dejar solo el pin cuando el buscador va justo, p. ej. "lg:max-xl:hidden".
 */
interface SocialColonyButtonProps {
  labelClass?: string
}

const props = defineProps<SocialColonyButtonProps>()

const colony = useColony()
const label = computed(() => `Cambiar colonia (${colony.value})`)

const labelClasses = computed(() => {
  if (props.labelClass) return `flex ${props.labelClass}`
  return 'flex'
})
</script>

<template>
  <button
    type="button"
    :title="label"
    :aria-label="label"
    class="inline-flex h-8 shrink-0 items-center gap-xxs rounded-pill px-xs text-label font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hairline-strong sm:px-sm"
  >
    <!-- Pin en blanco (solo neutros) -->
    <Icon name="material-symbols:location-on" size="18" aria-hidden="true" />
    <span class="items-center gap-xxs" :class="labelClasses">
      {{ colony }}
      <span class="inline-flex text-muted" aria-hidden="true"><Icon name="material-symbols:expand-more" size="18" /></span>
    </span>
  </button>
</template>
