import { useMutation } from '@tanstack/vue-query'

import { bookingsApi } from './api'
import type { BookingRequest } from '~/api/types'
import { useMineStore } from './stores'

/** Aparta una cita y la agrega a "Mis cosas". */
export function useCreateBooking() {
  const mine = useMineStore()

  return useMutation({
    mutationFn: (request: BookingRequest) => bookingsApi.create(request),
    onSuccess: (booking) => mine.addBooking(booking)
  })
}
