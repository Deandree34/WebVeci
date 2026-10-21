<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * "¿Qué dicen los vecinos?": resumen (calificación grande + reparto de estrellas) y la lista
 * de reseñas. Cada reseña es la voz de un vecino: va en Lora cursiva, como la cita del feed.
 * Solo neutros: estrellas y barras en blanco sobre gris. Lo usan la tarjeta del perfil
 * (`preview`: muestra unas cuantas y "Ver todas") y la ventana de reseñas del feed (todas).
 */
const props = defineProps<{ business: Business, preview?: number }>()

const expanded = ref(false)
const reviews = computed(() => props.business.reviews ?? [])
const visible = computed(() => (props.preview && !expanded.value ? reviews.value.slice(0, props.preview) : reviews.value))

/** Cuántas reseñas dieron 5, 4… 1 estrellas (para las barras). */
const distribution = computed(() =>
  [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.value.filter((review) => review.rating === stars).length
    return { stars, count, share: reviews.value.length ? count / reviews.value.length : 0 }
  })
)
</script>

<template>
  <div>
    <!-- Resumen: el número grande a la izquierda, cómo se reparte a la derecha -->
    <div class="flex items-center gap-lg rounded-control border border-hairline p-md font-headline">
      <div class="shrink-0 text-center">
        <p class="text-score leading-none font-bold text-ink tabular-nums">{{ business.rating.toFixed(1) }}</p>
        <PostStars :value="business.rating" :size="16" class="mt-xs" />
        <p class="mt-xxs text-support font-medium text-body">{{ reviews.length }} reseñas</p>
      </div>

      <ul class="flex min-w-0 flex-1 flex-col gap-xxs" aria-label="Reparto de calificaciones">
        <li v-for="row in distribution" :key="row.stars" class="flex items-center gap-xs text-meta font-medium text-muted">
          <span class="w-2 text-right tabular-nums">{{ row.stars }}</span>
          <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline">
            <span class="block h-full rounded-full bg-ink" :style="{ width: `${row.share * 100}%` }" />
          </span>
          <span class="w-4 tabular-nums">{{ row.count }}</span>
        </li>
      </ul>
    </div>

    <ul class="mt-sm divide-y divide-hairline">
      <li v-for="review in visible" :key="review.author" class="py-md">
        <div class="flex items-center gap-sm">
          <SocialAvatar :name="review.author" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="text-label leading-[1.3] font-semibold text-ink">{{ review.author }}</p>
            <p class="text-support leading-[1.4] text-body">{{ review.street }}</p>
          </div>
          <!-- Calificación que dio ese vecino -->
          <PostStars :value="review.rating" :size="14" />
        </div>
        <!-- Serif cursiva: es lo que dijo un vecino, no texto del negocio -->
        <blockquote class="mt-sm font-quote text-emphasis leading-[1.5] font-medium text-ink italic">“{{ review.text }}”</blockquote>
      </li>
    </ul>

    <button
      v-if="preview && reviews.length > preview"
      type="button"
      class="mt-xs h-10 w-full rounded-pill border border-hairline-strong text-label font-semibold text-body-strong transition-colors hover:bg-surface-elevated"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Ver menos' : `Ver todas (${reviews.length})` }}
    </button>
  </div>
</template>
