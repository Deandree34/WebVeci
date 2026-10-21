<script setup lang="ts">
import type { HomeTab } from '~/api/types'

definePageMeta({ layout: 'social' })

useHead({ title: 'Inicio — VECI' })

const HOME_TABS: HomeTab[] = ['ofertas', 'citas', 'notificaciones']

// La pestaña vive en la URL (`?tab=ofertas`) para poder compartirla y volver con "atrás"
const route = useRoute()
const tab = computed<HomeTab | undefined>({
  get: () => HOME_TABS.find((value) => value === route.query.tab),
  set: (value) => navigateTo({ query: { ...route.query, tab: value } }, { replace: true })
})
</script>

<template>
  <div>
    <StoryRail />
    <FeedTabs v-model="tab" />
    <NotificationList v-if="tab === 'notificaciones'" />
    <FeedList v-else :tab="tab" />
  </div>
</template>
