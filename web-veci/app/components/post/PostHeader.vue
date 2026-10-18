<script setup lang="ts">
import type { FeedItem } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * `look="social"` (card base): solo lo esencial (avatar, nombre, antigüedad); la etiqueta del
 * tipo va en el cuerpo y "Guardar" en el pie (`PostReactions`).
 */
const props = withDefaults(defineProps<{ item: FeedItem, look?: 'default' | 'social' }>(), { look: 'default' })

const now = useNow()
const business = computed(() => props.item.business)
const social = computed(() => props.look === 'social')
/**
 * Las reseñas destacadas las publica VECI, no el negocio. En la card base (`social`) la
 * cabecera es la del negocio reseñado y los autores van en cada reseña.
 */
const byVeci = computed(() => props.item.type === 'resena' && !social.value)
const status = computed(() => openStatus(business.value.hours, colonyHour(now.value)))

const kinds = {
  oferta: { label: 'Oferta', icon: 'material-symbols:sell' },
  horarios: { label: 'Citas disponibles', icon: 'material-symbols:calendar-month' },
  resena: { label: 'Reseña destacada', icon: 'material-symbols:star' }
} as const
const kind = computed(() => kinds[props.item.type])
</script>

<template>
  <header class="flex items-center gap-sm px-md pt-sm">
    <template v-if="byVeci">
      <span class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated" aria-hidden="true">
        <img src="/veci_logo_claro.webp" alt="" width="787" height="678" class="h-5 w-auto">
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-body-sm font-medium text-ink">VECI · Col. Centro</p>
        <p class="text-body-xs text-muted">
          <time :datetime="item.publishedAt">{{ formatRelativeTime(item.publishedAt, now) }}</time>
        </p>
      </div>
    </template>

    <!-- Social: solo lo esencial (punto verde = abierto, antigüedad); el resto en la tarjeta flotante -->
    <template v-else-if="social">
      <NuxtLink :to="businessPath(business.slug)" class="shrink-0" tabindex="-1">
        <BusinessAvatar :icon="business.icon" :open="status.open" />
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <!-- div (no p): la tarjeta flotante es un bloque -->
        <div class="flex items-center gap-xxs text-body-sm font-medium text-ink">
          <BusinessHoverCard :business="business">
            <NuxtLink :to="businessPath(business.slug)" class="truncate hover:underline">{{ business.name }}</NuxtLink>
          </BusinessHoverCard>
          <BusinessVerified v-if="business.verified" />
          <span class="sr-only">· {{ status.label }}</span>
        </div>
        <p class="text-body-xs text-muted">
          <time :datetime="item.publishedAt">{{ formatAge(item.publishedAt, now) }}</time>
        </p>
      </div>
    </template>

    <template v-else>
      <NuxtLink :to="businessPath(business.slug)" class="shrink-0" tabindex="-1">
        <BusinessAvatar :icon="business.icon" />
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <p class="flex items-center gap-xxs text-body-sm font-medium text-ink">
          <NuxtLink :to="businessPath(business.slug)" class="truncate hover:underline">{{ business.name }}</NuxtLink>
          <BusinessVerified v-if="business.verified" />
        </p>
        <p class="truncate text-body-xs text-muted">
          {{ business.subcategory }} · {{ formatDistance(business.distanceMeters) }} ·
          <time :datetime="item.publishedAt">{{ formatRelativeTime(item.publishedAt, now) }}</time>
        </p>
      </div>
    </template>

    <template v-if="!social">
      <span class="hidden shrink-0 items-center gap-xxs rounded-pill bg-surface-elevated px-sm py-xxs text-body-xs font-medium text-body sm:inline-flex">
        <Icon :name="kind.icon" size="14" aria-hidden="true" />
        {{ kind.label }}
      </span>
      <BusinessSaveButton v-if="!byVeci" :business-id="business.id" :business-name="business.name" />
    </template>
  </header>
</template>
