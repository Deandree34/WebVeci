<script setup lang="ts">
import { useSavedStore } from '~/features/businesses/stores'

/** Guardar un negocio: el marcador relleno va en ocre (lo que tú hiciste). */
const props = withDefaults(
  defineProps<{ businessId: string, businessName: string, size?: number | string }>(),
  { size: 22 }
)

const saved = useSavedStore()
const isSaved = computed(() => saved.isSaved(props.businessId))
</script>

<template>
  <BIconButton
    :label="isSaved ? `Quitar ${businessName} de guardados` : `Guardar ${businessName}`"
    :aria-pressed="isSaved"
    @click="saved.toggle(businessId)"
  >
    <Icon
      :name="isSaved ? 'material-symbols:bookmark' : 'material-symbols:bookmark-outline'"
      :size="size"
      :class="isSaved ? 'text-brand' : 'text-muted'"
    />
  </BIconButton>
</template>
