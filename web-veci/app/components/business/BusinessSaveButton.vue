<script setup lang="ts">
import { useSavedStore } from '~/stores/saved'

const props = defineProps<{ businessId: string, businessName: string }>()

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
      size="22"
      :class="isSaved ? 'text-veci-purple-text' : 'text-muted'"
    />
  </BIconButton>
</template>
