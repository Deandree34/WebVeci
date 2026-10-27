/**
 * Endpoints de citas (capacidad `citas`).
 *
 * ⚠️ TEMPORAL — simula la creación; no se envía nada.
 * Cuando exista el backend:
 *
 *   create: (body: BookingRequest) => api('/bookings', { method: 'POST', body })
 */

import { findBusiness } from '~/features/businesses/mock'
import type { Booking, BookingRequest } from '~/api/types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

let sequence = 0

export const bookingsApi = {
  /** Aparta una cita en un horario libre. */
  async create(request: BookingRequest): Promise<Booking> {
    await wait(500)
    if (!findBusiness(request.businessId)) throw new Error(`Negocio no encontrado: ${request.businessId}`)
    sequence += 1
    return { ...request, id: `b${sequence}`, createdAt: new Date().toISOString() }
  }
}
