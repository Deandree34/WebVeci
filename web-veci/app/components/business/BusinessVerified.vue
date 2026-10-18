<script setup lang="ts">
/**
 * Insignia de negocio verificado.
 *
 * Verde estándar (`success`) para reconocerlo de un vistazo, igual que el estado
 * "abierto". Fuente única del estilo: filas, cabeceras y visor de historias.
 */
withDefaults(defineProps<{ size?: number | string }>(), { size: 16 })
</script>

<template>
  <Icon name="material-symbols:verified" :size="size" class="shrink-0 text-success" aria-label="Verificado" />
</template>
