<script setup lang="ts">
import type { Business, PostPhoto } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'
import { usePhotoLikesStore } from '~/features/feed/stores'

/**
 * Pie de cada foto en la vista del post en lista, como en Facebook: la reacción de esa foto (con
 * su número) y compartirla. Misma reacción y estilo que `PostReactions` (el apretón de manos, la de
 * toda la app), pero con su propio contador por foto; si ya reaccionaste, relleno y en ocre (lo tuyo).
 */
const props = defineProps<{ photo: PostPhoto, business: Business }>()

const likes = usePhotoLikesStore()
const liked = computed(() => likes.isLiked(props.photo.id))
const total = computed(() => props.photo.likes + (liked.value ? 1 : 0))

const copied = ref(false)
async function share() {
  const url = new URL(businessPath(props.business.slug), window.location.origin).href
  const text = props.photo.caption ?? props.photo.alt
  if (navigator.share) {
    // Cancelar el menú nativo lanza AbortError: no es un error para el vecino
    await navigator.share({ title: `Foto de ${props.business.name}`, text, url }).catch(() => {})
    return
  }
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const action = '-mx-xs inline-flex h-9 items-center gap-xs rounded-control px-xs text-post-body tabular-nums transition-colors hover:bg-surface-elevated'
</script>

<template>
  <footer class="flex items-center gap-lg px-md py-xs">
    <button
      type="button"
      :aria-pressed="liked"
      :aria-label="liked ? 'Quitar tu reacción a esta foto' : 'Reaccionar a esta foto'"
      :class="[action, liked ? 'text-brand' : 'text-muted']"
      @click="likes.toggle(photo.id)"
    >
      <Icon :name="liked ? 'material-symbols:handshake' : 'material-symbols:handshake-outline'" size="20" aria-hidden="true" />
      <span v-if="total">{{ total }}</span>
    </button>

    <button
      type="button"
      :aria-label="copied ? 'Enlace copiado' : 'Compartir esta foto'"
      :class="[action, copied ? 'text-ink' : 'text-muted']"
      @click="share"
    >
      <Icon :name="copied ? 'material-symbols:check' : 'material-symbols:forward-outline'" size="20" aria-hidden="true" />
    </button>
  </footer>
</template>
