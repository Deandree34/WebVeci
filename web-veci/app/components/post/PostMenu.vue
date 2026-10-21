<script setup lang="ts">
import type { FeedItem } from '~/api/types'
import { useFeedPrefsStore } from '~/stores/feedPrefs'
import { useSavedStore } from '~/stores/saved'

/**
 * Menú "···" de una publicación, como el de Facebook: Me interesa · No me interesa · Guardar.
 * Cada opción con su ícono, qué hace y una línea de apoyo; solo neutros (menú: `BPopover`).
 */
const props = defineProps<{ item: FeedItem }>()

const prefs = useFeedPrefsStore()
const saved = useSavedStore()
const business = computed(() => props.item.business)
const interested = computed(() => prefs.isInterested(props.item.id))
const isSaved = computed(() => saved.isSaved(business.value.id))
</script>

<template>
  <BPopover>
    <template #trigger="{ toggle, open }">
      <BIconButton :label="`Opciones de la publicación de ${business.name}`" aria-haspopup="menu" :aria-expanded="open" @click="toggle">
        <Icon name="material-symbols:more-horiz" size="24" class="text-muted" />
      </BIconButton>
    </template>

    <BMenuItem
      :icon="interested ? 'material-symbols:check-circle' : 'material-symbols:add-circle-outline'"
      :active="interested"
      :label="interested ? 'Te interesa' : 'Me interesa'"
      :support="interested ? 'Toca para deshacer' : 'Verás más publicaciones como esta'"
      @select="prefs.toggleInterested(item.id)"
    />
    <BMenuItem
      icon="material-symbols:do-not-disturb-on-outline"
      label="No me interesa"
      support="Verás menos publicaciones como esta"
      @select="prefs.hide(item.id)"
    />
    <BMenuItem
      :icon="isSaved ? 'material-symbols:bookmark' : 'material-symbols:bookmark-outline'"
      :active="isSaved"
      :label="isSaved ? 'Quitar de guardados' : 'Guardar negocio'"
      :support="isSaved ? `${business.name} ya está en Guardados` : `${business.name} aparecerá en Guardados`"
      @select="saved.toggle(business.id)"
    />
  </BPopover>
</template>
