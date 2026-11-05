import { makeMockNotifications } from '../../../mock/notification'
import type { NotificationPage } from '../../../../app/api/types'

/**
 * Tamaño de página del mock. Alto a propósito: con los avisos de prueba (5) la primera página
 * trae todo, así la vista no cambia; si se agregan más, ya pagina por cursor como el contrato.
 */
const PAGE_SIZE = 20

/** GET /me/notifications?cursor= — notificaciones del vecino, de la más reciente a la más antigua. */
export default defineMockHandler(200, (event): NotificationPage => {
  const { cursor } = getQuery<{ cursor?: string }>(event)
  const start = cursor ? Number(cursor) : 0
  if (!Number.isInteger(start) || start < 0) validationError({ cursor: 'Cursor inválido' })

  const items = makeMockNotifications(Date.now())
  const next = start + PAGE_SIZE < items.length ? String(start + PAGE_SIZE) : null
  return { items: items.slice(start, start + PAGE_SIZE), nextCursor: next }
})
