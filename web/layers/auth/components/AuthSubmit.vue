<script setup lang="ts">
/**
 * Botón principal de la pantalla de acceso (uno por paso): píldora ocre con una gota detrás que, al
 * pasar el mouse, se estira y se funde con el botón (filtro `#veci-goo` de `AuthStage`).
 * Mismo alto y letra que `BButton` xl (48px, `text-copy` seminegrita).
 * `loading` muestra el giro, desactiva el botón y lo marca como ocupado.
 */
interface AuthSubmitProps {
  loading?: boolean
  disabled?: boolean
}

defineProps<AuthSubmitProps>()
</script>

<template>
  <div class="group relative [filter:url(#veci-goo)]">
    <span
      class="absolute inset-0 rounded-pill bg-brand transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-x-105 group-hover:scale-y-[1.2] motion-reduce:transition-none"
      aria-hidden="true"
    />
    <button
      type="submit"
      :disabled="disabled || loading"
      :aria-busy="loading ? true : undefined"
      class="relative flex h-12 w-full items-center justify-center gap-xs rounded-pill bg-brand text-copy font-semibold text-on-brand transition-[letter-spacing] duration-300 hover:tracking-[0.04em] disabled:opacity-60 disabled:hover:tracking-normal motion-reduce:transition-none"
    >
      <Icon v-if="loading" name="material-symbols:progress-activity" size="20" class="animate-spin" aria-hidden="true" />
      <slot />
    </button>
  </div>
</template>
