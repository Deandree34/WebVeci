<script setup lang="ts">
import { useSavedStore } from '~/stores/saved'

/** `neutral`: guardado en blanco en lugar de violeta (posts del feed, que van solo en neutros). */
const props = withDefaults(
  defineProps<{ businessId: string, businessName: string, neutral?: boolean, size?: number | string }>(),
  { neutral: false, size: 22 }
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
      :class="isSaved ? (neutral ? 'text-ink' : 'text-brand') : 'text-muted'"
    />
  </BIconButton>
</template>
