<script setup lang="ts">
import type { FeedTab } from '~/api/types'

definePageMeta({ layout: 'social' })

useHead({ title: 'Inicio — VECI' })

const FEED_TABS: FeedTab[] = ['ofertas', 'citas']

// La pestaña vive en la URL (`?tab=ofertas`) para poder compartirla y volver con "atrás"
const route = useRoute()
const tab = computed<FeedTab | undefined>({
  get: () => FEED_TABS.find((value) => value === route.query.tab),
  set: (value) => navigateTo({ query: { ...route.query, tab: value } }, { replace: true })
})
</script>

<template>
  <div>
    <StoryRail />
    <FeedTabs v-model="tab" />
    <FeedList :tab="tab" />
  </div>
</template>
