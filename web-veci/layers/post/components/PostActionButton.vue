<script setup lang="ts">
/**
 * Botón del pie de un post o de una foto (Recomendar, Compartir): ícono de 20px y, si hay, su número.
 * `tone`: `muted` (gris, por defecto), `brand` (ocre: ya lo hiciste tú) o `ink` (blanco: enlace copiado).
 * `label` es lo que se lee en voz alta; `aria-pressed` se pasa directo si el botón es de activar/desactivar.
 */
interface PostActionButtonProps {
  icon: string
  label: string
  count?: number
  tone?: 'muted' | 'brand' | 'ink'
}

const TONES = { muted: 'text-muted', brand: 'text-brand', ink: 'text-ink' }

const props = defineProps<PostActionButtonProps>()

const toneClass = computed(() => TONES[props.tone ?? 'muted'])
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="-mx-xs inline-flex h-9 items-center gap-xs rounded-control px-xs text-post-body tabular-nums transition-colors hover:bg-surface-elevated"
    :class="toneClass"
  >
    <Icon :name="icon" size="20" aria-hidden="true" />
    <span v-if="count">{{ count }}</span>
  </button>
</template>
