/** Endpoints de citas (capacidad `citas`). */

import { api } from '~/api/client'
import type { Booking, BookingRequest } from '~/api/types'

export const bookingsApi = {
  /** Aparta una cita en un horario libre; `validation_error` (422) o `not_found` (404) si no se puede. */
  create: (body: BookingRequest) => api<Booking>('/bookings', { method: 'POST', body })
}
