<script setup lang="ts">
/**
 * Encabezado de página (Explorar, Mis cosas, Guardados, categorías): título en Lora cursiva
 * (la voz de la app, como el nombre del negocio en su perfil) y descripción en Plus Jakarta Sans.
 */
defineProps<{ title: string, description?: string, icon?: string }>()
</script>

<template>
  <header class="mb-lg flex items-center gap-sm">
    <span
      v-if="icon"
      class="inline-flex size-12 shrink-0 items-center justify-center rounded-card bg-surface-card text-on-dark"
      aria-hidden="true"
    >
      <Icon :name="icon" size="26" />
    </span>
    <div class="min-w-0">
      <h1 class="font-quote text-[28px] leading-[1.2] font-medium tracking-normal text-ink normal-case italic">{{ title }}</h1>
      <p v-if="description" class="mt-0.5 font-headline text-[14px] leading-[1.4] font-medium text-body">{{ description }}</p>
    </div>
  </header>
</template>
