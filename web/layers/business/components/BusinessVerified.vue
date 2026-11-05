<script setup lang="ts">
/**
 * Insignia de negocio verificado.
 *
 * Verde estándar (`success`) para reconocerlo de un vistazo, igual que el estado
 * "abierto". Fuente única del estilo: filas, cabeceras y visor de historias.
 * `size` del ícono: 16 por defecto.
 */
interface BusinessVerifiedProps {
  size?: number | string
}

const props = defineProps<BusinessVerifiedProps>()

const iconSize = computed(() => props.size ?? 16)
</script>

<template>
  <Icon name="material-symbols:verified" :size="iconSize" class="shrink-0 text-success" aria-label="Verificado" />
</template>
