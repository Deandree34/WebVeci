<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * "Ver oferta" sin salir del feed: ventana con todas las ofertas vigentes del negocio del post
 * (la destacada primero). Cada una con el mismo adjunto que en el feed y su botón "Apartar", que
 * abre la cita con el servicio de esa oferta ya elegido; abajo, "Ver negocio" para ir a su página.
 */
const props = defineProps<{ business?: Business }>()
const emit = defineEmits<{ book: [business: Business, service?: string] }>()
const open = defineModel<boolean>('open', { default: false })

const now = useNow()
const offers = computed(() => (props.business ? activePromos(props.business, now.value) : []))
const subtitle = computed(() => {
  const count = offers.value.length
  return `${props.business?.name ?? ''} · ${count} ${count === 1 ? 'vigente' : 'vigentes'}`
})
const canBook = computed(() => !!props.business?.capabilities.includes('citas') && !!props.business.availability)
</script>

<template>
  <BSheet v-model:open="open" title="Ofertas" :subtitle="subtitle" quote>
    <template v-if="business">
      <!-- El mismo adjunto que en el feed, con "Apartar" (contorno) en lugar de "Ver oferta" -->
      <div class="-mx-md">
        <template v-for="promo in offers" :key="promo.text">
          <PostOffer v-if="canBook" :promo="promo" action="Apartar" @action="emit('book', business, promoService(business, promo))" />
          <PostOffer v-else :promo="promo" />
        </template>
      </div>

      <p v-if="!offers.length" class="py-md text-center text-copy text-body">Por ahora no tiene ofertas vigentes.</p>

      <NuxtLink
        :to="businessPath(business.slug)"
        class="mt-xs flex h-10 items-center justify-center rounded-pill border border-hairline-strong px-md text-label font-semibold text-body-strong transition-colors hover:bg-surface-elevated"
        @click="open = false"
      >
        Ver negocio
      </NuxtLink>
    </template>
  </BSheet>
</template>
