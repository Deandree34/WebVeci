<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * "¿Qué dicen los vecinos?": resumen (calificación grande + reparto de estrellas) y la lista
 * de reseñas. Cada reseña es la voz de un vecino: va en Lora cursiva, como la cita del feed.
 * Solo neutros: estrellas y barras en blanco sobre gris. Lo usan la tarjeta del perfil
 * (`preview`: muestra unas cuantas y "Ver todas") y la ventana de reseñas del feed (todas).
 */
interface BusinessReviewsProps {
  business: Business
  preview?: number
}

const STARS = [5, 4, 3, 2, 1]

const props = defineProps<BusinessReviewsProps>()

const expanded = ref(false)
const reviews = computed(() => props.business.reviews ?? [])

const visible = computed(() => {
  if (props.preview && !expanded.value) return reviews.value.slice(0, props.preview)
  return reviews.value
})

/** Hay más reseñas que las que muestra la vista previa. */
const canExpand = computed(() => !!props.preview && reviews.value.length > props.preview)

/** Cuántas reseñas dieron 5, 4… 1 estrellas (para las barras). */
const distribution = computed(() =>
  STARS.map((stars) => {
    const count = reviews.value.filter((review) => review.rating === stars).length
    const share = reviews.value.length ? count / reviews.value.length : 0
    return { stars, count, width: `${share * 100}%` }
  })
)

function toggleExpanded() {
  expanded.value = !expanded.value
}
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
            <span class="block h-full rounded-full bg-ink" :style="{ width: row.width }" />
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

    <BButton v-if="canExpand" block class="mt-xs" @click="toggleExpanded">
      {{ expanded ? 'Ver menos' : `Ver todas (${reviews.length})` }}
    </BButton>
  </div>
</template>
