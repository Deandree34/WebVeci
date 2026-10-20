<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Business, Review } from '~/api/types'

/**
 * Reseña como post: la mejor calificada es el protagonista, como cita en Lora cursiva (con
 * "Ver más" si es larga) y la firma de quien la escribió; el adjunto resume la calificación
 * (las estrellas solo van ahí) y lleva a todas las reseñas.
 */
const props = defineProps<{ business: Business, reviews: Review[], to?: RouteLocationRaw }>()

const review = computed(() => props.reviews.reduce((best, r) => (r.rating > best.rating ? r : best)))
/** Aproximado a 5 líneas de 20px en el ancho del feed: más largo se corta con "Ver más". */
const long = computed(() => review.value.text.length > 220)
const expanded = ref(false)
const support = computed(() => {
  const count = props.reviews.length
  return [`${count} ${count === 1 ? 'reseña' : 'reseñas'}`, `${props.business.recommendations} lo recomiendan`]
})
</script>

<template>
  <figure class="px-md pt-xs pb-md">
    <!-- Serif cursiva: es lo que dijo un vecino, no texto del negocio -->
    <blockquote class="font-quote text-[20px] leading-[1.45] font-medium text-ink italic" :class="{ 'line-clamp-5': long && !expanded }">“{{ review.text }}”</blockquote>
    <button
      v-if="long && !expanded"
      type="button"
      class="text-post-body font-semibold text-muted hover:underline"
      @click="expanded = true"
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
    :to="to"
    action="Ver reseñas"
  />
</template>
