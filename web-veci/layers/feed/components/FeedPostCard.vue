<script setup lang="ts">
import type { BookingRequest, FeedItem } from '~/api/types'
import { useFeedPrefsStore } from '../stores'

/**
 * Publicación del feed con la anatomía de un post de Facebook, solo en neutros:
 *   cabecera (negocio + "4 h · Oferta") → texto (reseña) → adjunto a todo lo ancho con su botón
 *   → Recomendar · Compartir y quiénes lo recomiendan. Guardar va en el menú "···" de la cabecera.
 * Las publicaciones normales ("Novedad") cambian el adjunto por su texto y sus fotos.
 * En celular va de borde a borde, sin esquinas; desde tablet, tarjeta redondeada.
 * Con "No me interesa" (menú "···") la publicación se cambia por un aviso con "Deshacer", como Facebook.
 */
interface FeedPostCardProps {
  item: FeedItem
}

const props = defineProps<FeedPostCardProps>()

const prefs = useFeedPrefsStore()
const sheets = useFeedSheetState()

const hidden = computed(() => prefs.isHidden(props.item.id))

/** Sin contenido para su adjunto, el post no se muestra. */
const visible = computed(() => {
  const item = props.item
  if (item.type === 'oferta') return !!item.business.promo
  if (item.type === 'resena') return !!item.business.reviews?.length
  if (item.type === 'publicacion') return !!item.text || item.photos.length > 0
  return true
})

function unhide() {
  prefs.unhide(props.item.id)
}

/** "Apartar": la ventana de la cita, preseleccionando el primer día con lugar. */
function book() {
  const { business } = props.item
  let day: BookingRequest['day'] | undefined
  if (business.availability) day = freeSlots(business.availability, colonyHour(Date.now())).day
  sheets.openBooking(business.id, { day })
}

function openOffers() {
  sheets.openOffers(props.item.business.id)
}

function openReviews() {
  sheets.openReviews(props.item.business.id)
}
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
    <BButton size="md" @click="unhide">Deshacer</BButton>
  </article>

  <article v-else-if="visible" class="-mx-md overflow-hidden bg-surface-card text-on-dark sm:mx-0 sm:rounded-control">
    <PostHeader :item="item" look="social" />

    <!-- "Ver oferta", "Apartar" y "Ver reseñas" abren su ventana aquí mismo: el vecino no pierde su lugar en el feed -->
    <PostOffer v-if="item.type === 'oferta' && item.business.promo" :promo="item.business.promo" @action="openOffers" />
    <PostAvailability v-else-if="item.type === 'horarios'" :business="item.business" @action="book" />
    <PostReview
      v-else-if="item.type === 'resena' && item.business.reviews?.length"
      :business="item.business"
      :reviews="item.business.reviews"
      @action="openReviews"
    />
    <!-- Publicación normal: texto y fotos, sin adjunto (no tiene acción principal) -->
    <template v-else-if="item.type === 'publicacion'">
      <PostText v-if="item.text" :text="item.text" />
      <PostPhotos v-if="item.photos.length" :post="item" />
    </template>

    <PostReactions :business="item.business" />
  </article>
</template>
