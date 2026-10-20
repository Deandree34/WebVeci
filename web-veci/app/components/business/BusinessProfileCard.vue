<script setup lang="ts">
/**
 * Tarjeta de sección del perfil: título que responde una pregunta ("¿Cuándo abre?", "¿Cuánto cuesta?")
 * en Lora cursiva (la voz con la que la app le habla al vecino), subtítulo opcional en la fuente del sistema
 * y una acción a la derecha. `scroll-mt` deja ver el título bajo la barra superior y las pestañas fijas.
 * `icon` se acepta por compatibilidad pero ya no se pinta (solo neutros, sin burbuja de color).
 */
defineProps<{ id: string, title: string, icon?: string, subtitle?: string }>()
</script>

<template>
  <section :id="id" class="scroll-mt-[120px] rounded-card bg-surface-card p-md" :aria-labelledby="`${id}-title`">
    <header class="mb-md flex items-start gap-sm">
      <div class="min-w-0 flex-1">
        <h2 :id="`${id}-title`" class="font-quote text-heading leading-[1.3] font-medium tracking-normal text-ink normal-case italic">{{ title }}</h2>
        <p v-if="subtitle" class="mt-0.5 text-support leading-[1.4] text-body">{{ subtitle }}</p>
      </div>
      <slot name="action" />
    </header>
    <slot />
  </section>
</template>
