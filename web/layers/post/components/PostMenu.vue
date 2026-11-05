<script setup lang="ts">
import type { FeedItem } from '~/api/types'
import { useSavedStore } from '#layers/business/stores'
import { useFeedPrefsStore } from '#layers/feed/stores'

/**
 * Menú "···" de una publicación, como el de Facebook: Me interesa · No me interesa · Guardar.
 * Cada opción con su ícono, qué hace y una línea de apoyo; solo neutros (menú: `BPopover`).
 */
interface PostMenuProps {
  item: FeedItem
}

/** Lo que pinta un `BMenuItem`. */
interface MenuOption {
  icon: string
  label: string
  support: string
  active: boolean
}

const props = defineProps<PostMenuProps>()

const prefs = useFeedPrefsStore()
const saved = useSavedStore()
const business = computed(() => props.item.business)
const triggerLabel = computed(() => `Opciones de la publicación de ${business.value.name}`)

const interested = computed<MenuOption>(() => {
  if (prefs.isInterested(props.item.id)) {
    return { icon: 'material-symbols:check-circle', label: 'Te interesa', support: 'Toca para deshacer', active: true }
  }
  return { icon: 'material-symbols:add-circle-outline', label: 'Me interesa', support: 'Verás más publicaciones como esta', active: false }
})

const save = computed<MenuOption>(() => {
  const name = business.value.name
  if (saved.isSaved(business.value.id)) {
    return { icon: 'material-symbols:bookmark', label: 'Quitar de guardados', support: `${name} ya está en Guardados`, active: true }
  }
  return { icon: 'material-symbols:bookmark-outline', label: 'Guardar negocio', support: `${name} aparecerá en Guardados`, active: false }
})

function toggleInterested() {
  prefs.toggleInterested(props.item.id)
}

function hide() {
  prefs.hide(props.item.id)
}

function toggleSaved() {
  saved.toggle(business.value.id)
}
</script>

<template>
  <BPopover>
    <template #trigger="{ toggle, open }">
      <BIconButton :label="triggerLabel" aria-haspopup="menu" :aria-expanded="open" @click="toggle">
        <Icon name="material-symbols:more-horiz" size="24" class="text-muted" />
      </BIconButton>
    </template>

    <BMenuItem
      :icon="interested.icon"
      :active="interested.active"
      :label="interested.label"
      :support="interested.support"
      @select="toggleInterested"
    />
    <BMenuItem
      icon="material-symbols:do-not-disturb-on-outline"
      label="No me interesa"
      support="Verás menos publicaciones como esta"
      @select="hide"
    />
    <BMenuItem
      :icon="save.icon"
      :active="save.active"
      :label="save.label"
      :support="save.support"
      @select="toggleSaved"
    />
  </BPopover>
</template>
