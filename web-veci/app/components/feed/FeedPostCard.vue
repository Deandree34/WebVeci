<script setup lang="ts">
import type { FeedItem } from '~/api/types'
import { useFeedPrefsStore } from '~/stores/feedPrefs'

/**
 * Publicación del feed con la anatomía de un post de Facebook, solo en neutros:
 *   cabecera (negocio + "4 h · Oferta") → texto (reseña) → adjunto a todo lo ancho con su botón
 *   → Recomendar · Compartir y quiénes lo recomiendan. Guardar va en el menú "···" de la cabecera.
 * Las publicaciones normales ("Novedad") cambian el adjunto por su texto y sus fotos.
 * En celular va de borde a borde, sin esquinas; desde tablet, tarjeta redondeada.
 * Con "No me interesa" (menú "···") la publicación se cambia por un aviso con "Deshacer", como Facebook.
 */
const props = defineProps<{ item: FeedItem }>()

const prefs = useFeedPrefsStore()
const hidden = computed(() => prefs.isHidden(props.item.id))

const sheets = useFeedSheets()
/** "Apartar": la ventana de la cita, preseleccionando el primer día con lugar. */
function book() {
  const { business } = props.item
  const day = business.availability ? freeSlots(business.availability, colonyHour(Date.now())).day : undefined
  sheets.openBooking(business.id, { day })
}

/** Sin contenido para su adjunto, el post no se muestra. */
const visible = computed(() => {
  const { type, business } = props.item
  if (type === 'oferta') return !!business.promo
  if (type === 'resena') return !!business.reviews?.length
  if (props.item.type === 'publicacion') return !!props.item.text || props.item.photos.length > 0
  return true
})
</script>

<template>
  <!-- Oculta por "No me interesa": aviso en una fila, con la opción de deshacer -->
  <article
    v-if="visible && hidden"
    class="-mx-md flex items-center gap-sm bg-surface-card px-md py-sm sm:mx-0 sm:rounded-control"
    aria-label="Publicación oculta"
  >
    <Icon name="material-symbols:visibility-off-outline" size="22" class="shrink-0 text-muted" aria-hidden="true" />
    <p class="min-w-0 flex-1">
      <span class="block text-copy leading-[1.3] font-semibold text-ink">Ocultaste esta publicación</span>
      <span class="mt-0.5 block text-support leading-[1.4] text-body">Verás menos publicaciones como esta de {{ item.business.name }}.</span>
    </p>
    <button
      type="button"
      class="inline-flex h-9 shrink-0 items-center rounded-pill border border-hairline-strong px-md text-label font-semibold text-body-strong transition-colors hover:bg-surface-elevated"
      @click="prefs.unhide(item.id)"
    >
      Deshacer
    </button>
  </article>

  <article v-else-if="visible" class="-mx-md overflow-hidden bg-surface-card text-on-dark sm:mx-0 sm:rounded-control">
    <PostHeader :item="item" look="social" />

    <!-- "Ver oferta", "Apartar" y "Ver reseñas" abren su ventana aquí mismo: el vecino no pierde su lugar en el feed -->
    <PostOffer v-if="item.type === 'oferta' && item.business.promo" :promo="item.business.promo" @action="sheets.openOffers(item.business.id)" />
    <PostAvailability v-else-if="item.type === 'horarios'" :business="item.business" @action="book" />
    <PostReview
      v-else-if="item.type === 'resena' && item.business.reviews?.length"
      :business="item.business"
      :reviews="item.business.reviews"
      @action="sheets.openReviews(item.business.id)"
    />
    <!-- Publicación normal: texto y fotos, sin adjunto (no tiene acción principal) -->
    <template v-else-if="item.type === 'publicacion'">
      <PostText v-if="item.text" :text="item.text" />
      <PostPhotos v-if="item.photos.length" :photos="item.photos" />
    </template>

    <PostReactions :business="item.business" />
  </article>
</template>
