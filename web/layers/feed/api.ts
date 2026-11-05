/** Endpoints del feed de la colonia. */

import { api } from '~/api/client'
import type { FeedItem, FeedTab, Paginated } from '~/api/types'

export const feedApi = {
  /** Página del feed ya ordenada por relevancia, paginada por cursor; `tab` filtra por pestaña. */
  list: (cursor?: string, tab?: FeedTab) => api<Paginated<FeedItem>>('/feed', { query: { cursor, tab } }),

  /**
   * Publicaciones de un negocio para su página, de la más reciente a la más antigua.
   * Solo lo que escribe el negocio (las reseñas destacadas las publica VECI) y sin el aviso de
   * horarios: en su página la tarjeta "Horarios libres" ya los muestra en vivo.
   */
  byBusiness: (businessId: string) => api<FeedItem[]>(`/businesses/${encodeURIComponent(businessId)}/posts`)
}
