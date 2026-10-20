import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'

import { feedApi } from '~/api/feed'
import type { FeedTab } from '~/api/types'

/** Claves de caché del dominio feed (para invalidación selectiva). */
export const feedKeys = {
  all: ['feed'] as const,
  list: (tab?: FeedTab) => ['feed', tab ?? 'para-ti'] as const
}

/** Opciones reutilizables: alimentan el componente y la precarga en SSR. */
export const feedOptions = (tab?: FeedTab) => infiniteQueryOptions({
  queryKey: feedKeys.list(tab),
  queryFn: ({ pageParam }) => feedApi.list(pageParam, tab),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (last) => last.nextCursor ?? undefined
})

/** Feed de la colonia, paginado (carga automática al llegar al final); sin `tab` = "Para ti". */
export function useFeed(tab?: MaybeRefOrGetter<FeedTab | undefined>) {
  return useInfiniteQuery(computed(() => feedOptions(toValue(tab))))
}
