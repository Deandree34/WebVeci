/**
 * Endpoints del feed de la colonia.
 *
 * ⚠️ TEMPORAL — datos dummy con latencia simulada.
 * Cuando exista el backend, este archivo pasa a llamar a la API real:
 *
 *   list: (cursor?: string, tab?: FeedTab) => api('/feed', { query: { cursor, tab } })
 */

import { makeMockFeed } from './mock/feed'
import type { FeedItem, FeedTab, Paginated } from './types'

const PAGE_SIZE = 4

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const feedApi = {
  /** Página del feed ya ordenada por relevancia, paginada por cursor; `tab` filtra por pestaña. */
  async list(cursor?: string, tab?: FeedTab): Promise<Paginated<FeedItem>> {
    await wait(400)
    const items = makeMockFeed(Date.now()).filter((item) => !tab || item.tab === tab)
    const start = cursor ? Number(cursor) : 0
    const next = start + PAGE_SIZE < items.length ? String(start + PAGE_SIZE) : null
    return { items: items.slice(start, start + PAGE_SIZE), nextCursor: next }
  }
}
