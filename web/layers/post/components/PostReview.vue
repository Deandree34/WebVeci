<script setup lang="ts">
import type { Business, Review } from '~/api/types'

/**
 * Reseña como post: la mejor calificada es el protagonista, como cita en Lora cursiva (con
 * "Ver más" si es larga) y la firma de quien la escribió; el adjunto resume la calificación
 * (las estrellas solo van ahí) y `@action` ("Ver reseñas") abre todas en una ventana sin salir del feed.
 */
interface PostReviewProps {
  business: Business
  reviews: Review[]
  onAction?: () => void
}

/** Aproximado a 5 líneas de 20px en el ancho del feed: más largo se corta con "Ver más". */
const LONG_TEXT = 220

const props = defineProps<PostReviewProps>()

/** La reseña mejor calificada. */
const review = computed(() => props.reviews.reduce((best, item) => (item.rating > best.rating ? item : best)))
const long = computed(() => review.value.text.length > LONG_TEXT)
const expanded = ref(false)
const clamped = computed(() => long.value && !expanded.value)

const support = computed(() => {
  const count = props.reviews.length
  return [`${count} ${count === 1 ? 'reseña' : 'reseñas'}`, `${props.business.recommendations} lo recomiendan`]
})

function expand() {
  expanded.value = true
}
</script>

<template>
  <figure class="px-md pt-xs pb-md">
    <!-- Serif cursiva: es lo que dijo un vecino, no texto del negocio -->
    <blockquote class="font-quote text-heading leading-[1.45] font-medium text-ink italic" :class="{ 'line-clamp-5': clamped }">“{{ review.text }}”</blockquote>
    <button
      v-if="clamped"
      type="button"
      class="text-post-body font-semibold text-muted hover:underline"
      @click="expand"
    >
      Ver más
    </button>

    <figcaption class="mt-sm flex items-center gap-xs text-body-xs text-muted">
      <SocialAvatar :name="review.author" size="xs" />
      <span><span class="font-semibold text-body-strong">{{ review.author }}</span> · {{ review.street }}</span>
    </figcaption>
  </figure>

  <PostAttachment
    :title="business.rating.toFixed(1)"
    :rating="business.rating"
    :support="support"
    action="Ver reseñas"
    :on-action="onAction"
  />
</template>
