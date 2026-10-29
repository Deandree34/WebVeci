<script setup lang="ts">
import type { Business, Promo } from '~/api/types'
import { businessPath } from '#layers/social/nav'

/**
 * "Ver oferta" sin salir del feed: ventana con todas las ofertas vigentes del negocio del post
 * (la destacada primero). Cada una con el mismo adjunto que en el feed y su botón "Apartar", que
 * abre la cita con el servicio de esa oferta ya elegido; abajo, "Ver negocio" para ir a su página.
 */
interface FeedOffersSheetProps {
  business?: Business
}

interface FeedOffersSheetEmits {
  book: [business: Business, service?: string]
}

const props = defineProps<FeedOffersSheetProps>()
const emit = defineEmits<FeedOffersSheetEmits>()
const open = defineModel<boolean>('open', { default: false })

const now = useNow()

const offers = computed(() => {
  if (!props.business) return []
  return activePromos(props.business, now.value)
})

const subtitle = computed(() => {
  const count = offers.value.length
  const name = props.business?.name ?? ''
  return `${name} · ${count} ${count === 1 ? 'vigente' : 'vigentes'}`
})

const canBook = computed(() => {
  const business = props.business
  return !!business && business.capabilities.includes('citas') && !!business.availability
})

const profilePath = computed(() => (props.business ? businessPath(props.business.slug) : '/'))

/** "Apartar" en una oferta: la cita con el servicio de esa oferta ya elegido. */
function bookOffer(promo: Promo) {
  if (!props.business) return
  emit('book', props.business, promoService(props.business, promo))
}

function close() {
  open.value = false
}
</script>

<template>
  <BSheet v-model:open="open" title="Ofertas" :subtitle="subtitle" quote>
    <template v-if="business">
      <!-- El mismo adjunto que en el feed, con "Apartar" (contorno) en lugar de "Ver oferta" -->
      <div class="-mx-md">
        <template v-for="promo in offers" :key="promo.text">
          <PostOffer v-if="canBook" :promo="promo" action="Apartar" @action="bookOffer(promo)" />
          <PostOffer v-else :promo="promo" />
        </template>
      </div>

      <p v-if="!offers.length" class="py-md text-center text-copy text-body">Por ahora no tiene ofertas vigentes.</p>

      <BButton :to="profilePath" block class="mt-xs" @click="close">Ver negocio</BButton>
    </template>
  </BSheet>
</template>
