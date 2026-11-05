<script setup lang="ts">
import { useSavedStore } from '../stores'

/** Guardar un negocio: el marcador relleno va en ocre (lo que tú hiciste). `size` del ícono: 22 por defecto. */
interface BusinessSaveButtonProps {
  businessId: string
  businessName: string
  size?: number | string
}

const props = defineProps<BusinessSaveButtonProps>()

const saved = useSavedStore()
const isSaved = computed(() => saved.isSaved(props.businessId))
const iconSize = computed(() => props.size ?? 22)

const label = computed(() => {
  if (isSaved.value) return `Quitar ${props.businessName} de guardados`
  return `Guardar ${props.businessName}`
})

function toggle() {
  saved.toggle(props.businessId)
}
</script>

<template>
  <BIconButton
    :label="label"
    :aria-pressed="isSaved"
    @click="toggle"
  >
    <Icon
      :name="isSaved ? 'material-symbols:bookmark' : 'material-symbols:bookmark-outline'"
      :size="iconSize"
      :class="isSaved ? 'text-brand' : 'text-muted'"
    />
  </BIconButton>
</template>
