import type { Booking } from '~/api/types'

/**
 * "Mis cosas": citas (y luego pedidos y solicitudes) del vecino.
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, pasa a estado de servidor (TanStack Query).
 */
export const useMineStore = defineStore('mine', () => {
  const bookings = ref<Booking[]>([])

  const count = computed(() => bookings.value.length)

  function addBooking(booking: Booking) {
    bookings.value = [booking, ...bookings.value]
  }

  return { bookings, count, addBooking }
})
