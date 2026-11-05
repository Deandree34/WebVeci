<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '#layers/social/nav'

/**
 * "Ver reseñas" sin salir del feed: ventana con todas las reseñas del negocio del post
 * (resumen de calificaciones y cada reseña en Lora cursiva) y "Ver negocio" para ir a su página.
 */
interface FeedReviewsSheetProps {
  business?: Business
}

const props = defineProps<FeedReviewsSheetProps>()
const open = defineModel<boolean>('open', { default: false })

const profilePath = computed(() => (props.business ? businessPath(props.business.slug) : '/'))

function close() {
  open.value = false
}
</script>

<template>
  <BSheet
    v-model:open="open"
    title="Reseñas de vecinos"
    :subtitle="business?.name"
    quote
  >
    <template v-if="business">
      <BusinessReviews :business="business" />

      <BButton :to="profilePath" block class="mt-xs" @click="close">Ver negocio</BButton>
    </template>
  </BSheet>
</template>
