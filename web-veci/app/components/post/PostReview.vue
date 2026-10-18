<script setup lang="ts">
import type { Business, Review } from '~/api/types'

/**
 * Reseñas de vecinos en carrusel, con la cita grande del prototipo `veci-feed`.
 *
 * Scroll-snap nativo: en táctil se desliza con el dedo (inercia y snap del navegador);
 * en escritorio, flechas. Los puntos indican la posición. Sin avance automático.
 */
const props = defineProps<{ business: Business, reviews: Review[] }>()

const track = ref<HTMLElement>()
const current = ref(0)
const many = computed(() => props.reviews.length > 1)

function go(index: number) {
  const el = track.value
  if (!el) return
  const target = Math.max(0, Math.min(props.reviews.length - 1, index))
  el.scrollTo({ left: target * el.clientWidth })
}

let frame = 0
function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const el = track.value
    if (el) current.value = Math.round(el.scrollLeft / el.clientWidth)
  })
}
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <section
    class="mx-md pt-md pb-sm"
    :aria-roledescription="many ? 'carrusel' : undefined"
    :aria-label="`Reseñas de ${business.name}`"
    @keydown.left="go(current - 1)"
    @keydown.right="go(current + 1)"
  >
    <div class="flex items-center justify-between gap-sm">
      <p class="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.06em] text-veci-purple-text uppercase">
        <Icon name="material-symbols:star" size="14" aria-hidden="true" />
        Reseñas de vecinos
      </p>
      <div v-if="many" class="-my-xs hidden items-center sm:flex">
        <BIconButton label="Reseña anterior" :disabled="current === 0" class="disabled:opacity-30 disabled:hover:bg-transparent" @click="go(current - 1)">
          <Icon name="material-symbols:chevron-left" size="24" />
        </BIconButton>
        <BIconButton label="Reseña siguiente" :disabled="current === reviews.length - 1" class="disabled:opacity-30 disabled:hover:bg-transparent" @click="go(current + 1)">
          <Icon name="material-symbols:chevron-right" size="24" />
        </BIconButton>
      </div>
    </div>

    <!-- Pista: los slides se estiran a la altura del más alto, así el post no brinca -->
    <div
      ref="track"
      class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @scroll.passive="onScroll"
    >
      <figure
        v-for="(review, i) in reviews"
        :key="review.author"
        class="relative w-full shrink-0 snap-start pt-[44px] pl-2"
        role="group"
        aria-roledescription="reseña"
        :aria-label="`${i + 1} de ${reviews.length}`"
      >
        <!-- Dentro del slide (la pista recorta lo que sobresale): misma posición que el prototipo -->
        <span class="absolute top-0 left-1 text-[96px] leading-none font-extrabold text-veci-gradient opacity-55" aria-hidden="true">“</span>
        <blockquote class="relative text-[20px] leading-[1.35] font-semibold tracking-[-0.01em] text-ink sm:text-[24px]">
          {{ review.text }}
        </blockquote>
        <figcaption class="mt-sm flex items-center gap-xs text-body-sm">
          <SocialAvatar :name="review.author" size="xs" />
          <span class="font-medium text-ink">{{ review.author }}</span>
          <span class="inline-flex text-warning" role="img" :aria-label="`${review.rating} de 5 estrellas`">
            <Icon v-for="n in review.rating" :key="n" name="material-symbols:star" size="16" aria-hidden="true" />
          </span>
        </figcaption>
      </figure>
    </div>

    <div v-if="many" class="mt-sm flex justify-center gap-1.5">
      <button
        v-for="(review, i) in reviews"
        :key="review.author"
        type="button"
        :aria-label="`Ver reseña ${i + 1}`"
        :aria-current="i === current"
        class="h-1.5 rounded-full transition-all"
        :class="i === current ? 'w-4 bg-veci-gradient' : 'w-1.5 bg-hairline-strong hover:bg-muted-soft'"
        @click="go(i)"
      />
    </div>
  </section>
</template>
