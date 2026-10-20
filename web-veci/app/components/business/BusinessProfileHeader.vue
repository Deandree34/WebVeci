<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * Cabecera del perfil: una idea por fila, de lo más importante a lo menos.
 *  1. Quién es: logo, nombre, giro y descripción.
 *  2. ¿Está abierto?: chip de estado.
 *  3. ¿Es confiable y está cerca?: tres cifras (valor grande, etiqueta abajo).
 *  4. Qué puedo hacer: Apartar cita · Mensaje · Cómo llegar, y lo social (recomendar, compartir, guardar).
 * La dirección y el horario completo viven en sus tarjetas, no aquí.
 */
const props = defineProps<{ business: Business, canBook?: boolean }>()
defineEmits<{ book: [] }>()

const now = useNow()
const status = computed(() => scheduleStatus(props.business, now.value))

const { isRecommended, total, toggleRecommend, copied, share } = useBusinessSocial(() => props.business)
const recommendersOpen = ref(false)

/** "Lo recomiendan Ana, Carlos y 50 vecinos más" (con "Tú" primero si ya lo recomendaste). */
const names = computed(() => [
  ...(isRecommended.value ? ['Tú'] : []),
  ...(props.business.recommendedBy ?? []).map((person) => person.name)
].slice(0, 2))
const othersCount = computed(() => total.value - names.value.length)

const reviewsCount = computed(() => props.business.reviews?.length ?? 0)

const secondary = 'inline-flex h-10 items-center justify-center gap-xs rounded-control bg-surface-elevated px-md text-body-sm font-medium text-ink transition-colors hover:bg-hairline-strong'
</script>

<template>
  <div class="px-md pb-md md:px-lg">
    <!-- 1 · Identidad -->
    <div class="flex flex-col items-center gap-sm text-center md:flex-row md:items-end md:gap-md md:text-left">
      <div class="-mt-16 shrink-0 rounded-full bg-surface-card p-1 md:-mt-20">
        <BusinessAvatar :icon="business.icon" :src="business.logoUrl" size="xl" :open="status.open" />
      </div>

      <div class="min-w-0 flex-1 md:pb-xs">
        <h1 id="business-name" class="inline-flex max-w-full items-center gap-xs text-[28px] leading-tight font-bold normal-case tracking-normal text-ink md:text-[32px]">
          <span class="truncate">{{ business.name }}</span>
          <BusinessVerified v-if="business.verified" size="24" />
        </h1>
        <p class="mt-xxs text-body-md text-body">{{ business.description }}</p>

        <!-- 2 · Giro y estado como chips, cada uno con su propio significado -->
        <div class="mt-sm flex flex-wrap items-center justify-center gap-xs md:justify-start">
          <span class="inline-flex items-center gap-xxs rounded-pill bg-surface-elevated px-sm py-xxs text-body-xs font-medium text-body">
            <Icon :name="business.icon" size="14" aria-hidden="true" />
            {{ business.subcategory }}
          </span>
          <span
            class="inline-flex items-center gap-xs rounded-pill px-sm py-xxs text-body-xs font-medium"
            :class="status.open ? 'bg-success/15 text-success' : 'bg-surface-elevated text-body'"
          >
            <span class="size-2 rounded-full" :class="status.open ? 'bg-success' : 'bg-muted-soft'" aria-hidden="true" />
            {{ status.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- 3 · Cifras de un vistazo: valor arriba, qué significa abajo -->
    <div class="mt-md grid grid-cols-3 divide-x divide-hairline-strong rounded-card bg-surface-soft py-sm text-center md:max-w-[520px]">
      <a href="#resenas" class="flex flex-col-reverse px-xs transition-opacity hover:opacity-80">
        <span class="text-body-xs text-muted">{{ reviewsCount ? `${reviewsCount} reseñas` : 'Calificación' }}</span>
        <span class="inline-flex items-center justify-center gap-xxs text-[20px] leading-tight font-bold text-ink tabular-nums">
          <Icon name="material-symbols:star" size="20" class="text-warning" aria-hidden="true" />
          {{ business.rating.toFixed(1) }}
        </span>
      </a>
      <button type="button" class="flex flex-col-reverse px-xs transition-opacity hover:opacity-80" @click="recommendersOpen = true">
        <span class="text-body-xs text-muted">vecinos lo recomiendan</span>
        <span class="inline-flex items-center justify-center gap-xxs text-[20px] leading-tight font-bold text-ink tabular-nums">
          <Icon name="material-symbols:handshake-outline" size="20" class="text-veci-purple-text" aria-hidden="true" />
          {{ total }}
        </span>
      </button>
      <div class="flex flex-col-reverse px-xs">
        <span class="text-body-xs text-muted">{{ business.walkMinutes }} min a pie</span>
        <span class="inline-flex items-center justify-center gap-xxs text-[20px] leading-tight font-bold text-ink tabular-nums">
          <Icon name="material-symbols:directions-walk" size="20" class="text-muted" aria-hidden="true" />
          {{ formatDistance(business.distanceMeters) }}
        </span>
      </div>
    </div>

    <!-- 4 · Acciones: la principal destaca; lo social, a la derecha y discreto -->
    <div class="mt-md flex flex-wrap items-center gap-xs">
      <button
        v-if="canBook"
        type="button"
        class="inline-flex h-10 flex-1 items-center justify-center gap-xs rounded-control bg-veci-gradient px-md text-body-sm font-medium text-on-primary transition hover:brightness-110 sm:flex-none"
        @click="$emit('book')"
      >
        <Icon name="material-symbols:event-available" size="20" aria-hidden="true" />
        Apartar cita
      </button>
      <a
        v-if="business.contact?.whatsapp"
        :href="whatsappUrl(business.contact.whatsapp, `Hola, los vi en VECI`)"
        target="_blank"
        rel="noopener"
        :class="secondary"
        class="flex-1 sm:flex-none"
      >
        <Icon name="material-symbols:chat-outline" size="20" aria-hidden="true" />
        Mensaje
      </a>
      <a :href="mapsUrl(business.address)" target="_blank" rel="noopener" :class="secondary" class="flex-1 sm:flex-none">
        <Icon name="material-symbols:directions-outline" size="20" aria-hidden="true" />
        Cómo llegar
      </a>

      <div class="flex w-full items-center justify-between gap-xs sm:ml-auto sm:w-auto">
        <button
          type="button"
          :aria-pressed="isRecommended"
          class="inline-flex h-10 items-center gap-xs rounded-control px-sm text-body-sm font-medium transition-colors hover:bg-surface-elevated"
          :class="isRecommended ? 'text-veci-purple-text' : 'text-body'"
          @click="toggleRecommend"
        >
          <Icon :name="isRecommended ? 'material-symbols:handshake' : 'material-symbols:handshake-outline'" size="20" aria-hidden="true" />
          {{ isRecommended ? 'Recomendado' : 'Recomendar' }}
        </button>
        <div class="flex items-center">
          <BIconButton :label="copied ? 'Enlace copiado' : `Compartir ${business.name}`" @click="share">
            <Icon :name="copied ? 'material-symbols:check' : 'material-symbols:share-outline'" size="22" :class="copied ? 'text-success' : 'text-muted'" />
          </BIconButton>
          <BusinessSaveButton :business-id="business.id" :business-name="business.name" />
        </div>
      </div>
    </div>

    <!-- Prueba social: caras y nombres de vecinos, no solo un número -->
    <button
      v-if="names.length"
      type="button"
      class="mt-sm flex items-center gap-sm rounded-control py-xxs text-left text-body-sm text-muted transition-colors hover:text-body"
      @click="recommendersOpen = true"
    >
      <span class="flex shrink-0 -space-x-1.5">
        <SocialAvatar v-for="person in (business.recommendedBy ?? []).slice(0, 3)" :key="person.name" :name="person.name" size="xs" class="ring-2 ring-surface-card" />
      </span>
      <span>
        Lo recomiendan <b class="font-medium text-body">{{ names.join(', ') }}</b>
        <template v-if="othersCount > 0"> y {{ othersCount }} vecinos más</template>
      </span>
      <Icon name="material-symbols:chevron-right" size="18" aria-hidden="true" />
    </button>

    <BusinessRecommendersSheet v-model:open="recommendersOpen" :business="business" />
  </div>
</template>
