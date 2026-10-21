<script setup lang="ts">
import type { NotificationKind } from '~/api/types'
import { useBusinesses } from '~/features/businesses/queries'
import { useNotifications } from '~/features/notifications/queries'
import { useNotificationsStore } from '~/stores/notifications'

/**
 * Notificaciones del vecino, como las de Facebook pero en neutros: avatar del negocio con un
 * ícono pequeño de qué pasó, "**quién** qué pasó" con la letra de las publicaciones (Inter) y la
 * antigüedad. Agrupadas en "Hoy" y "Anteriores" según la fecha de la colonia.
 * Sin leer: texto en blanco, hora en seminegrita y punto blanco a la derecha. Al tocarla se marca leída.
 */
const { data: notifications, isPending } = useNotifications()
const { data: businesses } = useBusinesses()
const read = useNotificationsStore()
const now = useNow()

const kindIcon: Record<NotificationKind, string> = {
  publicacion: 'material-symbols:campaign',
  oferta: 'material-symbols:sell',
  cita: 'material-symbols:calendar-month',
  recomendacion: 'material-symbols:handshake',
  aviso: 'material-symbols:location-on'
}

const items = computed(() => (notifications.value ?? []).map((item) => ({
  ...item,
  business: businesses.value?.find((business) => business.id === item.businessId),
  unread: !read.isRead(item.id)
})))
const unreadIds = computed(() => items.value.filter((item) => item.unread).map((item) => item.id))

/** "Hoy" (fecha de la colonia) y "Anteriores"; un grupo vacío no se muestra. */
const groups = computed(() => {
  const today = colonyToday(now.value)
  const isToday = (iso: string) => colonyToday(Date.parse(iso)) === today
  return [
    { label: 'Hoy', items: items.value.filter((item) => isToday(item.createdAt)) },
    { label: 'Anteriores', items: items.value.filter((item) => !isToday(item.createdAt)) }
  ].filter((group) => group.items.length)
})
</script>

<template>
  <section class="-mx-md bg-surface-card py-sm sm:mx-0 sm:rounded-card" aria-labelledby="notifications-title">
    <header class="flex items-center justify-between gap-sm px-md pb-xs">
      <h2 id="notifications-title" class="font-quote text-heading leading-[1.3] font-medium tracking-normal text-ink normal-case italic">Notificaciones</h2>
      <button
        v-if="unreadIds.length"
        type="button"
        class="text-support font-semibold text-body-strong hover:underline"
        @click="read.markAllRead(unreadIds)"
      >
        Marcar todo como leído
      </button>
    </header>

    <div v-if="isPending" class="flex flex-col gap-xs px-md py-xs" aria-hidden="true">
      <div v-for="n in 4" :key="n" class="h-14 animate-pulse rounded-control bg-surface-elevated" />
    </div>

    <template v-else-if="items.length">
      <div v-for="group in groups" :key="group.label">
        <!-- Grupo en Lora cursiva, como los rótulos de las columnas ("Abierto ahora") -->
        <h3 class="px-md pt-sm pb-xxs font-quote text-lead leading-[1.3] font-medium tracking-normal text-body normal-case italic">{{ group.label }}</h3>
        <ul class="flex flex-col px-xs">
          <li v-for="item in group.items" :key="item.id">
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-sm rounded-control px-xs py-xs transition-colors hover:bg-surface-soft"
              @click="read.markRead(item.id)"
            >
              <!-- Avatar del negocio (o de VECI en avisos de la colonia) con el ícono de qué pasó -->
              <span class="relative shrink-0">
                <BusinessAvatar v-if="item.business" :icon="item.business.icon" :src="item.business.logoUrl" size="lg" />
                <img v-else src="/veci_logo.webp" alt="" width="256" height="256" class="size-14 rounded-full" aria-hidden="true">
                <span class="absolute -right-0.5 -bottom-0.5 inline-flex size-6 items-center justify-center rounded-full bg-surface-elevated text-ink ring-2 ring-surface-card" aria-hidden="true">
                  <Icon :name="kindIcon[item.kind]" size="14" />
                </span>
              </span>
    
              <span class="min-w-0 flex-1">
                <!-- Mismas clases que el texto de una publicación (PostText): Inter, 15 → 16px, gris claro.
                     Lo sin leer se distingue por el punto y la hora en seminegrita, no por el color del texto. -->
                <span class="block font-reading text-reading leading-[1.5] text-body">
                  <b class="font-semibold text-ink">{{ item.actor }}</b> {{ item.text }}
                </span>
                <time
                  :datetime="item.createdAt"
                  class="mt-0.5 block text-support"
                  :class="item.unread ? 'font-semibold text-ink' : 'text-muted'"
                >{{ formatAge(item.createdAt, now) }}</time>
              </span>
    
              <span v-if="item.unread" class="size-2.5 shrink-0 rounded-full bg-ink" aria-label="Sin leer" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </template>

    <p v-else class="px-md py-lg text-center text-copy text-body">Todavía no tienes notificaciones.</p>
  </section>
</template>
