<script setup lang="ts">
/**
 * Acción del encabezado al estilo de Facebook: círculo gris de 40px con solo el ícono.
 * Al pasar el cursor (o al llegar con el teclado) aparece debajo una etiqueta que dice qué es.
 * Con `to` es un enlace; sin él, un botón.
 */
interface SocialTopBarActionProps {
  label: string
  to?: string
}

const props = defineProps<SocialTopBarActionProps>()

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  return 'button'
})
</script>

<template>
  <span class="group relative inline-flex shrink-0">
    <component
      :is="tag"
      :to="to"
      :type="to ? undefined : 'button'"
      :aria-label="label"
      class="inline-flex size-10 items-center justify-center rounded-full bg-surface-elevated text-ink transition-colors hover:bg-hairline-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <slot />
    </component>
    <!-- Etiqueta: solo en dispositivos con cursor (hover) o con foco de teclado. Alineada al borde derecho
         del botón (no centrada): en el borde de la pantalla, centrada se saldría y daría scroll horizontal. -->
    <span
      class="pointer-events-none absolute top-full right-0 z-40 mt-xs rounded-control bg-surface-elevated px-xs py-xxs text-meta font-semibold whitespace-nowrap text-ink opacity-0 shadow-[0_2px_8px_rgb(0_0_0/0.5)] transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
      aria-hidden="true"
    >
      {{ label }}
    </span>
  </span>
</template>
