<script setup lang="ts">
/**
 * Tarjeta de sección del perfil: título con ícono (responde una pregunta: "¿Cuándo abre?",
 * "¿Cuánto cuesta?"), subtítulo opcional y una acción a la derecha. `scroll-mt` deja ver
 * el título bajo la barra superior y las pestañas fijas al saltar a la sección.
 */
defineProps<{ id: string, title: string, icon: string, subtitle?: string }>()
</script>

<template>
  <section :id="id" class="scroll-mt-[120px] rounded-card bg-surface-card p-md" :aria-labelledby="`${id}-title`">
    <header class="mb-md flex items-start gap-sm">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-veci-purple-text" aria-hidden="true">
        <Icon :name="icon" size="20" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 :id="`${id}-title`" class="text-[18px] leading-tight font-bold normal-case tracking-normal text-ink">{{ title }}</h2>
        <p v-if="subtitle" class="mt-0.5 text-body-xs text-muted">{{ subtitle }}</p>
      </div>
      <slot name="action" />
    </header>
    <slot />
  </section>
</template>
