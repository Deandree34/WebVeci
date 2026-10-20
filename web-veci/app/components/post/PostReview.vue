<script setup lang="ts">
import type { Business, Review } from '~/api/types'

/**
 * Reseñas de vecinos en carrusel, con la cita grande del prototipo `veci-feed`.
 *
 * Scroll-snap nativo: en táctil se desliza con el dedo (inercia y snap del navegador);
 * en escritorio, flechas junto a los puntos. Sin avance automático.
 *
 * Identidad por tipo: oferta = cupón rosa · reseña = testimonio violeta · citas = agenda azul.
 * Testimonio centrado al estilo Google: firma arriba ("Jorge  Av. Juárez"), debajo las
 * estrellas = calificación que dio esa persona, y luego el texto.
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
    <span class="sr-only">Reseñas de vecinos</span>

    <!-- Pista: los slides se estiran a la altura del más alto, así el post no brinca -->
    <div
      ref="track"
      class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @scroll.passive="onScroll"
    >
      <figure
        v-for="(review, i) in reviews"
        :key="review.author"
        class="relative w-full shrink-0 snap-start px-sm pt-xs text-center"
        role="group"
        aria-roledescription="reseña"
        :aria-label="`${i + 1} de ${reviews.length}`"
      >
        <!-- Estilo Google: quién la escribió, debajo su calificación y luego el texto -->
        <figcaption class="flex items-center justify-center gap-xs text-body-sm">
          <SocialAvatar :name="review.author" size="xs" />
          <span class="font-medium text-body">{{ review.author }}</span>
          <span class="text-muted">{{ review.street }}</span>
        </figcaption>
        <!-- Calificación que dio esa persona, con las no dadas vacías: 4 de 5 = ★★★★☆ -->
        <span class="mt-xxs flex justify-center gap-0.5" role="img" :aria-label="`Calificó con ${review.rating} de 5 estrellas`">
          <Icon
            v-for="n in 5"
            :key="n"
            :name="n <= review.rating ? 'material-symbols:star' : 'material-symbols:star-outline'"
            size="16"
            :class="n <= review.rating ? 'text-warning' : 'text-muted-soft'"
            aria-hidden="true"
          />
        </span>
        <blockquote class="mt-sm text-[20px] leading-[1.35] font-semibold tracking-[-0.01em] text-ink sm:text-[24px]">
          {{ review.text }}
        </blockquote>
      </figure>
    </div>

    <!-- ‹ puntos › : las flechas solo con cursor; en táctil se desliza -->
    <div v-if="many" class="mt-xs flex items-center justify-center gap-sm">
      <!-- span: `hidden` sobre BIconButton chocaría con su propio inline-flex -->
      <span class="hidden sm:inline-flex">
        <BIconButton label="Reseña anterior" :disabled="current === 0" class="disabled:opacity-30 disabled:hover:bg-transparent" @click="go(current - 1)">
          <Icon name="material-symbols:chevron-left" size="22" />
        </BIconButton>
      </span>
      <div class="flex gap-1.5">
        <button
          v-for="(review, i) in reviews"
          :key="review.author"
          type="button"
          :aria-label="`Ver reseña ${i + 1}`"
          :aria-current="i === current"
          class="h-1.5 rounded-full transition-all"
          :class="i === current ? 'w-4 bg-veci-purple' : 'w-1.5 bg-hairline-strong hover:bg-muted-soft'"
          @click="go(i)"
        />
      </div>
      <span class="hidden sm:inline-flex">
        <BIconButton label="Reseña siguiente" :disabled="current === reviews.length - 1" class="disabled:opacity-30 disabled:hover:bg-transparent" @click="go(current + 1)">
          <Icon name="material-symbols:chevron-right" size="22" />
        </BIconButton>
      </span>
    </div>
  </section>
</template>
