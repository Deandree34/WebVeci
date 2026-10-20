<script setup lang="ts">
import type { FeedItem } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Publicación del feed con la anatomía de un post de Facebook, solo en neutros:
 *   cabecera (negocio + "4 h · Oferta") → texto (reseña) → adjunto a todo lo ancho con su botón
 *   → conteo de recomendaciones → Recomendar · Compartir · Guardar.
 * En celular va de borde a borde, sin esquinas; desde tablet, tarjeta redondeada.
 */
const props = defineProps<{ item: FeedItem }>()

const path = computed(() => businessPath(props.item.business.slug))

/** Sin contenido para su adjunto, el post no se muestra. */
const visible = computed(() => {
  const { type, business } = props.item
  if (type === 'oferta') return !!business.promo
  if (type === 'resena') return !!business.reviews?.length
  return true
})
</script>

<template>
  <article v-if="visible" class="-mx-md overflow-hidden bg-surface-card text-on-dark sm:mx-0 sm:rounded-control">
    <PostHeader :item="item" look="social" />

    <PostOffer v-if="item.type === 'oferta' && item.business.promo" :promo="item.business.promo" :to="`${path}#oferta`" />
    <PostAvailability v-else-if="item.type === 'horarios'" :business="item.business" :to="{ path, query: { cita: '1' } }" />
    <PostReview
      v-else-if="item.type === 'resena' && item.business.reviews?.length"
      :business="item.business"
      :reviews="item.business.reviews"
      :to="`${path}#resenas`"
    />

    <PostReactions :business="item.business" />
  </article>
</template>
