<script setup lang="ts">
import type { Business, PostPhoto } from '~/api/types'
import { usePhotoLikesStore } from '#layers/feed/stores'
import { businessPath } from '#layers/social/nav'

/**
 * Pie de cada foto en la vista del post en lista, como en Facebook: la reacción de esa foto (con
 * su número) y compartirla. Misma reacción y estilo que `PostReactions` (el apretón de manos, la de
 * toda la app), pero con su propio contador por foto; si ya reaccionaste, relleno y en ocre (lo tuyo).
 */
interface PostPhotoReactionsProps {
  photo: PostPhoto
  business: Business
}

const props = defineProps<PostPhotoReactionsProps>()

const likes = usePhotoLikesStore()
const liked = computed(() => likes.isLiked(props.photo.id))
const total = computed(() => props.photo.likes + (liked.value ? 1 : 0))
const { copied, share: shareLink } = useShare()

function toggleLike() {
  likes.toggle(props.photo.id)
}

function share() {
  return shareLink({
    title: `Foto de ${props.business.name}`,
    text: props.photo.caption ?? props.photo.alt,
    path: businessPath(props.business.slug)
  })
}
</script>

<template>
  <footer class="flex items-center gap-lg px-md py-xs">
    <PostActionButton
      :icon="liked ? 'material-symbols:handshake' : 'material-symbols:handshake-outline'"
      :label="liked ? 'Quitar tu reacción a esta foto' : 'Reaccionar a esta foto'"
      :count="total"
      :tone="liked ? 'brand' : 'muted'"
      :aria-pressed="liked"
      @click="toggleLike"
    />

    <PostActionButton
      :icon="copied ? 'material-symbols:check' : 'material-symbols:forward-outline'"
      :label="copied ? 'Enlace copiado' : 'Compartir esta foto'"
      :tone="copied ? 'ink' : 'muted'"
      @click="share"
    />
  </footer>
</template>
