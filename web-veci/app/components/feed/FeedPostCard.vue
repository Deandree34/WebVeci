<script setup lang="ts">
import type { FeedItem } from '~/api/types'

/**
 * Publicación del feed. Misma tarjeta gris para todos; cada tipo se reconoce por su forma:
 *   oferta   = la tarjeta es un cupón con talón (línea punteada vertical, perforación con muescas y tijeras)
 *   resena   = testimonio      (cita centrada bajo la comilla)
 *   horarios = la tarjeta es una hoja de calendario de taco (borde de arriba en zigzag; mes, día y "HOY"/"MAÑANA")
 * Comparten la cabecera del negocio y el pie social.
 */
const props = defineProps<{ item: FeedItem }>()

/** La hoja de calendario lleva el zigzag arriba en lugar de esquinas redondeadas. */
const isSheet = computed(() => props.item.type === 'horarios')
</script>

<template>
  <article
    class="overflow-hidden text-on-dark"
    :class="isSheet ? 'rounded-b-card' : 'rounded-card bg-surface-card'"
  >
    <template v-if="item.type === 'oferta' && item.business.promo">
      <PostHeader :item="item" look="social" />
      <PostOffer :promo="item.business.promo" :slug="item.business.slug" />
      <PostCouponDivider />
      <PostReactions :business="item.business" />
    </template>

    <template v-else-if="item.type === 'horarios'">
      <PostCalendarEdge />
      <div class="rounded-b-card bg-surface-card">
        <PostCalendarBinding />
        <PostHeader :item="item" look="social" />
        <PostAvailability :business="item.business" />
        <PostReactions :business="item.business" />
      </div>
    </template>

    <template v-else-if="item.type === 'resena' && item.business.reviews?.length">
      <PostHeader :item="item" look="social" />
      <PostReview :business="item.business" :reviews="item.business.reviews" />
      <PostReactions :business="item.business" />
    </template>
  </article>
</template>
