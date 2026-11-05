import { makeMockFeed } from '../../../mock/feed'
import type { FeedItem, FeedTab, Paginated } from '../../../../app/api/types'

const PAGE_SIZE = 4
const TABS: FeedTab[] = ['ofertas', 'citas']

/** GET /feed?cursor=&tab= — página del feed ya ordenada por relevancia, paginada por cursor. */
export default defineMockHandler(400, (event): Paginated<FeedItem> => {
  const { cursor, tab } = getQuery<{ cursor?: string, tab?: string }>(event)
  if (tab && !TABS.includes(tab as FeedTab)) validationError({ tab: `Debe ser ${TABS.join(' o ')}` })
  const start = cursor ? Number(cursor) : 0
  if (!Number.isInteger(start) || start < 0) validationError({ cursor: 'Cursor inválido' })

  const items = makeMockFeed(Date.now()).filter((item) => !tab || item.tab === tab)
  const next = start + PAGE_SIZE < items.length ? String(start + PAGE_SIZE) : null
  return { items: items.slice(start, start + PAGE_SIZE), nextCursor: next }
})
