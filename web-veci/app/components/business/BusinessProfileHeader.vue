<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * Cabecera del perfil: una idea por fila, de lo más importante a lo menos.
 *  1. Quién es: logo, nombre, giro y descripción.
 *  2. ¿Está abierto?: chip de estado.
 *  3. ¿Es confiable y está cerca?: tres cifras (valor grande, etiqueta abajo).
 *  4. Qué puedo hacer: Apartar cita · Mensaje · Cómo llegar, y lo social (recomendar, compartir, guardar).
 * La dirección y el horario completo viven en sus tarjetas, no aquí.
 * Sistema tipográfico de los posts (Plus Jakarta Sans) y solo neutros: lo activo va en blanco.
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

const secondary = 'inline-flex h-10 items-center justify-center gap-xs rounded-pill border border-hairline-strong px-md text-[14px] font-semibold text-body-strong transition-colors hover:bg-surface-elevated'
const stat = 'flex flex-col-reverse gap-0.5 px-xs'
const statValue = 'inline-flex items-center justify-center gap-xxs text-[20px] leading-tight font-bold text-ink tabular-nums'
const statLabel = 'text-[12px] font-medium text-muted'
</script>

<template>
  <div class="px-md pb-md font-headline md:px-lg">
    <!-- 1 · Identidad -->
    <div class="flex flex-col items-center gap-sm text-center md:flex-row md:items-end md:gap-md md:text-left">
      <div class="-mt-16 shrink-0 rounded-full bg-surface-card p-1 md:-mt-20">
        <BusinessAvatar :icon="business.icon" :src="business.logoUrl" size="xl" />
      </div>

      <div class="min-w-0 flex-1 md:pb-xs">
        <!-- Nombre en Lora cursiva, como los títulos de sección del perfil -->
        <h1 id="business-name" class="inline-flex max-w-full items-center gap-xs font-quote text-[30px] leading-tight font-medium tracking-normal text-ink normal-case italic md:text-[36px]">
          <span class="truncate">{{ business.name }}</span>
          <BusinessVerified v-if="business.verified" size="24" />
        </h1>
        <p class="mt-xxs text-[15px] leading-[1.45] font-medium text-body">{{ business.description }}</p>

        <!-- 2 · Giro y estado como chips neutros: abierto en blanco, cerrado en gris -->
        <div class="mt-sm flex flex-wrap items-center justify-center gap-xs md:justify-start">
          <span class="inline-flex items-center gap-xxs rounded-pill border border-hairline-strong px-sm py-xxs text-[13px] font-medium text-body">
            <Icon :name="business.icon" size="14" aria-hidden="true" />
            {{ business.subcategory }}
          </span>
          <span
            class="inline-flex items-center gap-xs rounded-pill border border-hairline-strong px-sm py-xxs text-[13px] font-semibold"
            :class="status.open ? 'text-ink' : 'text-body'"
          >
            <span class="size-2 rounded-full" :class="status.open ? 'bg-ink' : 'bg-muted-soft'" aria-hidden="true" />
            {{ status.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- 3 · Cifras de un vistazo: valor arriba, qué significa abajo -->
    <div class="mt-md grid grid-cols-3 divide-x divide-hairline rounded-control border border-hairline py-sm text-center md:max-w-[520px]">
      <a href="#resenas" :class="[stat, 'transition-opacity hover:opacity-80']">
        <span :class="statLabel">{{ reviewsCount ? `${reviewsCount} reseñas` : 'Calificación' }}</span>
        <span :class="statValue">
          <Icon name="material-symbols:star-rounded" size="20" aria-hidden="true" />
          {{ business.rating.toFixed(1) }}
        </span>
      </a>
      <button type="button" :class="[stat, 'transition-opacity hover:opacity-80']" @click="recommendersOpen = true">
        <span :class="statLabel">vecinos lo recomiendan</span>
        <span :class="statValue">
          <Icon name="material-symbols:handshake-outline" size="20" aria-hidden="true" />
          {{ total }}
        </span>
      </button>
      <div :class="stat">
        <span :class="statLabel">{{ business.walkMinutes }} min a pie</span>
        <span :class="statValue">
          <Icon name="material-symbols:directions-walk" size="20" aria-hidden="true" />
          {{ formatDistance(business.distanceMeters) }}
        </span>
      </div>
    </div>

    <!-- 4 · Acciones: la principal en blanco; lo social, a la derecha y discreto -->
    <div class="mt-md flex flex-wrap items-center gap-xs">
      <button
        v-if="canBook"
        type="button"
        class="inline-flex h-10 flex-1 items-center justify-center gap-xs rounded-pill bg-ink px-md text-[14px] font-bold text-canvas transition-colors hover:bg-body-strong sm:flex-none"
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
          class="inline-flex h-10 items-center gap-xs rounded-pill px-sm text-[14px] font-semibold transition-colors hover:bg-surface-elevated"
          :class="isRecommended ? 'text-ink' : 'text-body'"
          @click="toggleRecommend"
        >
          <Icon :name="isRecommended ? 'material-symbols:handshake' : 'material-symbols:handshake-outline'" size="20" aria-hidden="true" />
          {{ isRecommended ? 'Recomendado' : 'Recomendar' }}
        </button>
        <div class="flex items-center">
          <BIconButton :label="copied ? 'Enlace copiado' : `Compartir ${business.name}`" @click="share">
            <Icon :name="copied ? 'material-symbols:check' : 'material-symbols:forward-outline'" size="22" :class="copied ? 'text-ink' : 'text-muted'" />
          </BIconButton>
          <BusinessSaveButton :business-id="business.id" :business-name="business.name" neutral />
        </div>
      </div>
    </div>

    <!-- Prueba social: caras y nombres de vecinos, no solo un número -->
    <button
      v-if="names.length"
      type="button"
      class="mt-sm flex items-center gap-sm rounded-control py-xxs text-left text-[13px] font-medium text-body transition-colors hover:text-ink"
      @click="recommendersOpen = true"
    >
      <span class="flex shrink-0 -space-x-1.5">
        <SocialAvatar v-for="person in (business.recommendedBy ?? []).slice(0, 3)" :key="person.name" :name="person.name" size="xs" class="ring-2 ring-surface-card" />
      </span>
      <span>
        Lo recomiendan <b class="font-semibold text-ink">{{ names.join(', ') }}</b>
        <template v-if="othersCount > 0"> y {{ othersCount }} vecinos más</template>
      </span>
      <Icon name="material-symbols:chevron-right" size="18" aria-hidden="true" />
    </button>

    <BusinessRecommendersSheet v-model:open="recommendersOpen" :business="business" />
  </div>
</template>
