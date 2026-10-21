<script setup lang="ts">
import { useBusinesses } from '~/features/businesses/queries'

/**
 * Ventanas que abren las publicaciones sin salir del feed (estado en `useFeedSheets`):
 * las ofertas y las reseñas del negocio, y la de apartar cita. Va una sola vez en el layout.
 */
const { offersFor, reviewsFor, booking, openBooking } = useFeedSheets()
const { data: businesses } = useBusinesses()
const findBusiness = (id: string | null | undefined) => businesses.value?.find((business) => business.id === id)

const offersOpen = computed({
  get: () => offersFor.value !== null,
  set: (value) => { if (!value) offersFor.value = null }
})
const offersBusiness = computed(() => findBusiness(offersFor.value))

const reviewsOpen = computed({
  get: () => reviewsFor.value !== null,
  set: (value) => { if (!value) reviewsFor.value = null }
})
const reviewsBusiness = computed(() => findBusiness(reviewsFor.value))

const bookingBusiness = computed(() => findBusiness(booking.value?.businessId))
const bookingOpen = computed({
  get: () => !!booking.value && !!bookingBusiness.value,
  set: (value) => { if (!value) booking.value = null }
})

/** Desde una oferta: el primer día con lugar y el servicio de la oferta ya elegido. */
function bookFromOffer(business: NonNullable<typeof bookingBusiness.value>, service?: string) {
  const day = business.availability ? freeSlots(business.availability, colonyHour(Date.now())).day : undefined
  openBooking(business.id, { day, service })
}
</script>

<template>
  <FeedOffersSheet v-model:open="offersOpen" :business="offersBusiness" @book="bookFromOffer" />
  <FeedReviewsSheet v-model:open="reviewsOpen" :business="reviewsBusiness" />
  <BookingSheet
    v-if="bookingBusiness"
    v-model:open="bookingOpen"
    :business="bookingBusiness"
    :initial-day="booking?.day"
    :initial-service="booking?.service"
  />
</template>
