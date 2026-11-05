<script setup lang="ts">
import type { FeedItem } from '~/api/types'
import { businessPath } from '#layers/social/nav'

/**
 * Cabecera de una publicación.
 * `look="social"` (card base): solo identidad (avatar, nombre) y una línea de metadatos
 * con la antigüedad y el tipo ("4 h · Oferta"), y el menú "···" a la derecha (Me interesa · No me interesa · Guardar).
 * `look="default"` (por defecto): con giro, distancia, chip del tipo y guardar.
 */
interface PostHeaderProps {
  item: FeedItem
  look?: 'default' | 'social'
}

const KINDS = {
  oferta: { label: 'Oferta', icon: 'material-symbols:sell' },
  horarios: { label: 'Citas disponibles', icon: 'material-symbols:calendar-month' },
  resena: { label: 'Reseña destacada', icon: 'material-symbols:star' },
  publicacion: { label: 'Novedad', icon: 'material-symbols:campaign' }
}

const props = defineProps<PostHeaderProps>()

const now = useNow()
const business = computed(() => props.item.business)
const profilePath = computed(() => businessPath(business.value.slug))
const social = computed(() => props.look === 'social')

/**
 * Las reseñas destacadas las publica VECI, no el negocio. En la card base (`social`) la
 * cabecera es la del negocio reseñado y los autores van en cada reseña.
 */
const byVeci = computed(() => props.item.type === 'resena' && !social.value)
const status = computed(() => scheduleStatus(business.value, now.value))
const kind = computed(() => KINDS[props.item.type])
</script>

<template>
  <header class="flex items-center gap-sm px-md pt-sm" :class="{ 'pb-sm': social }">
    <template v-if="byVeci">
      <img src="/veci_logo.webp" alt="" width="256" height="256" class="size-10 shrink-0 rounded-full" aria-hidden="true">
      <div class="min-w-0 flex-1">
        <p class="truncate text-body-sm font-medium text-ink">VECI · Col. Centro</p>
        <p class="text-body-xs text-muted">
          <time :datetime="item.publishedAt">{{ formatRelativeTime(item.publishedAt, now) }}</time>
        </p>
      </div>
    </template>

    <!-- Social, como Facebook: identidad, metadatos en gris ("4 h · 🏷 Oferta", el ícono como el
         globo de Facebook) y el menú "···" a la derecha; el estado (abierto, horario) va en la tarjeta flotante -->
    <template v-else-if="social">
      <NuxtLink :to="profilePath" class="shrink-0" tabindex="-1">
        <BusinessAvatar :icon="business.icon" />
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <!-- div (no p): la tarjeta flotante es un bloque -->
        <div class="flex items-center gap-xxs text-post-body font-semibold text-ink">
          <BusinessHoverCard :business="business">
            <NuxtLink :to="profilePath" class="truncate hover:underline">{{ business.name }}</NuxtLink>
          </BusinessHoverCard>
          <BusinessVerified v-if="business.verified" :size="14" />
          <span class="sr-only">· {{ status.label }}</span>
        </div>
        <p class="flex items-center gap-xxs text-body-xs text-muted">
          <time :datetime="item.publishedAt">{{ formatAge(item.publishedAt, now) }}</time>
          <span aria-hidden="true">·</span>
          <Icon :name="kind.icon" size="12" aria-hidden="true" />
          <span>{{ kind.label }}</span>
        </p>
      </div>
      <!-- "···" como Facebook: Me interesa · No me interesa · Guardar -->
      <PostMenu :item="item" class="-mr-xs" />
    </template>

    <template v-else>
      <NuxtLink :to="profilePath" class="shrink-0" tabindex="-1">
        <BusinessAvatar :icon="business.icon" />
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <p class="flex items-center gap-xxs text-body-sm font-medium text-ink">
          <NuxtLink :to="profilePath" class="truncate hover:underline">{{ business.name }}</NuxtLink>
          <BusinessVerified v-if="business.verified" />
        </p>
        <p class="truncate text-body-xs text-muted">
          {{ business.subcategory }} · {{ formatDistance(business.distanceMeters) }} ·
          <time :datetime="item.publishedAt">{{ formatRelativeTime(item.publishedAt, now) }}</time>
        </p>
      </div>
    </template>

    <template v-if="!social">
      <!-- En un span: el `inline-flex` de BChip anularía el `hidden` -->
      <span class="hidden shrink-0 sm:inline-flex">
        <BChip :icon="kind.icon" variant="filled">{{ kind.label }}</BChip>
      </span>
      <BusinessSaveButton v-if="!byVeci" :business-id="business.id" :business-name="business.name" />
    </template>
  </header>
</template>
