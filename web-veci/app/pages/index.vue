<script setup lang="ts">
import type { HomeTab } from '~/api/types'

definePageMeta({ layout: 'social' })

useHead({ title: 'Inicio — VECI' })

const HOME_TABS: HomeTab[] = ['ofertas', 'citas', 'notificaciones']

// La vista vive en la URL (`?tab=ofertas`): la eligen las pestañas del encabezado (SocialNavTabs)
// o la barra inferior en celular, y así se puede compartir y volver con "atrás"
const route = useRoute()
const tab = computed<HomeTab | undefined>(() => HOME_TABS.find((value) => value === route.query.tab))
</script>

<template>
  <div>
    <StoryRail />
    <NotificationList v-if="tab === 'notificaciones'" />
    <FeedList v-else :tab="tab" />
  </div>
</template>
