<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * "¿Qué dicen los vecinos?": resumen (calificación grande + reparto de estrellas) y la lista
 * de reseñas en tamaño de lectura. El carrusel de cita grande (`PostReview`) es para el feed.
 */
const props = defineProps<{ business: Business }>()

const PREVIEW = 3
const expanded = ref(false)
const reviews = computed(() => props.business.reviews ?? [])
const visible = computed(() => (expanded.value ? reviews.value : reviews.value.slice(0, PREVIEW)))

/** Cuántas reseñas dieron 5, 4… 1 estrellas (para las barras). */
const distribution = computed(() =>
  [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.value.filter((review) => review.rating === stars).length
    return { stars, count, share: reviews.value.length ? count / reviews.value.length : 0 }
  })
)
</script>

<template>
  <BusinessProfileCard id="resenas" title="Reseñas de vecinos" icon="material-symbols:reviews-outline" subtitle="Solo vecinos que ya usaron el servicio">
    <!-- Resumen: el número grande a la izquierda, cómo se reparte a la derecha -->
    <div class="flex items-center gap-lg rounded-control bg-surface-soft p-md">
      <div class="shrink-0 text-center">
        <p class="text-[40px] leading-none font-bold text-ink tabular-nums">{{ business.rating.toFixed(1) }}</p>
        <span class="mt-xs flex justify-center gap-0.5" role="img" :aria-label="`${business.rating.toFixed(1)} de 5 estrellas`">
          <Icon
            v-for="n in 5"
            :key="n"
            :name="n <= Math.round(business.rating) ? 'material-symbols:star' : 'material-symbols:star-outline'"
            size="14"
            :class="n <= Math.round(business.rating) ? 'text-warning' : 'text-muted-soft'"
            aria-hidden="true"
          />
        </span>
        <p class="mt-xxs text-body-xs text-muted">{{ reviews.length }} reseñas</p>
      </div>

      <ul class="flex min-w-0 flex-1 flex-col gap-xxs" aria-label="Reparto de calificaciones">
        <li v-for="row in distribution" :key="row.stars" class="flex items-center gap-xs text-body-xs text-muted">
          <span class="w-2 text-right tabular-nums">{{ row.stars }}</span>
          <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline-strong">
            <span class="block h-full rounded-full bg-warning" :style="{ width: `${row.share * 100}%` }" />
          </span>
          <span class="w-4 tabular-nums">{{ row.count }}</span>
        </li>
      </ul>
    </div>

    <ul class="mt-sm divide-y divide-hairline-strong">
      <li v-for="review in visible" :key="review.author" class="py-sm">
        <div class="flex items-center gap-sm">
          <SocialAvatar :name="review.author" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="text-body-sm font-medium text-ink">{{ review.author }}</p>
            <p class="text-body-xs text-muted">{{ review.street }}</p>
          </div>
          <span class="flex shrink-0 gap-0.5" role="img" :aria-label="`Calificó con ${review.rating} de 5 estrellas`">
            <Icon
              v-for="n in 5"
              :key="n"
              :name="n <= review.rating ? 'material-symbols:star' : 'material-symbols:star-outline'"
              size="14"
              :class="n <= review.rating ? 'text-warning' : 'text-muted-soft'"
              aria-hidden="true"
            />
          </span>
        </div>
        <p class="mt-xs text-body-sm leading-relaxed text-body">{{ review.text }}</p>
      </li>
    </ul>

    <button
      v-if="reviews.length > PREVIEW"
      type="button"
      class="mt-xs w-full rounded-control bg-surface-elevated py-xs text-body-sm font-medium text-ink transition-colors hover:bg-hairline-strong"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Ver menos' : `Ver todas (${reviews.length})` }}
    </button>
  </BusinessProfileCard>
</template>
