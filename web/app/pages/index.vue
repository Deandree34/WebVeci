<script setup lang="ts">
import type { HomeTab } from '~/api/types'

/**
 * Inicio. La vista vive en la URL (`?tab=ofertas`): la eligen las pestañas del encabezado
 * (SocialNavTabs) o la barra inferior en celular, y así se puede compartir y volver con "atrás".
 * Sin `tab`: "Para ti" (con historias).
 */

const HOME_TABS: HomeTab[] = ['ofertas', 'citas', 'notificaciones']

definePageMeta({ layout: 'social' })

useHead({ title: 'Inicio — VECI' })

const route = useRoute()
const tab = computed<HomeTab | undefined>(() => HOME_TABS.find((value) => value === route.query.tab))
</script>

<template>
  <div>
    <!-- Las historias solo acompañan a Inicio; en Promociones, Agenda y Notificaciones estorban -->
    <StoryRail v-if="!tab" />
    <NotificationList v-if="tab === 'notificaciones'" />
    <FeedList v-else :tab="tab" />
  </div>
</template>
