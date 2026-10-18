<script setup lang="ts">
import type { FeedItem } from '~/api/types'

/** Publicación del feed: cabecera + cuerpo según `item.type` + pie social. */
defineProps<{ item: FeedItem }>()
</script>

<template>
  <BCard variant="flush">
    <!-- Card base social: sin divisores, el bloque del cuerpo es la acción, pie con Recomendar -->
    <PostHeader :item="item" look="social" />

    <template v-if="item.type === 'oferta' && item.business.promo">
      <PostOffer :promo="item.business.promo" :slug="item.business.slug" />
      <PostReactions :business="item.business" />
    </template>

    <template v-else-if="item.type === 'horarios'">
      <PostAvailability :business="item.business" />
      <PostReactions :business="item.business" />
    </template>

    <template v-else-if="item.type === 'resena' && item.business.reviews?.length">
      <PostReview :business="item.business" :reviews="item.business.reviews" />
      <PostReactions :business="item.business" />
    </template>
  </BCard>
</template>
