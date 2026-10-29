import { findBusiness } from '../../../mock/business'
import type { Booking, BookingRequest } from '../../../../app/api/types'

let sequence = 0

/** POST /bookings — aparta una cita en un horario libre (capacidad `citas`). */
export default defineMockHandler(500, async (event): Promise<Booking> => {
  const request = await readBody<BookingRequest | undefined>(event)
  const fields: Record<string, string> = {}
  if (!request?.service) fields.service = 'Elige un servicio'
  if (request?.day !== 'today' && request?.day !== 'tomorrow') fields.day = 'Debe ser today o tomorrow'
  if (!request?.time) fields.time = 'Elige un horario'
  if (!request?.customerName?.trim()) fields.customerName = 'Falta tu nombre'
  if (Object.keys(fields).length) validationError(fields)
  if (!findBusiness(request!.businessId)) apiError(404, 'not_found', `Negocio no encontrado: ${request!.businessId}`)

  sequence += 1
  setResponseStatus(event, 201)
  return { ...request!, id: `b${sequence}`, createdAt: new Date().toISOString() }
})
