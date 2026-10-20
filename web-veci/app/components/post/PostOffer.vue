<script setup lang="ts">
import type { Promo } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Oferta como cupón con talón (boleto de dos partes): a la izquierda la oferta, a la
 * derecha el talón con la cuenta regresiva, separados por una línea punteada vertical que
 * baja hasta la perforación (`PostCouponDivider`). Tipografía del prototipo `veci-feed`.
 *
 * Forma por tipo: oferta = cupón con talón · reseña = testimonio · citas = hoja de calendario.
 */
/** Sin `slug` (página del propio negocio) el cupón no es enlace. */
const props = defineProps<{ promo: Promo, slug?: string }>()

const NuxtLink = resolveComponent('NuxtLink')

const { left, expired, progress } = usePromoCountdown(() => props.promo)
</script>

<template>
  <div class="mx-md">
    <span class="sr-only">Oferta</span>
    <!-- El padding va en cada columna para que la línea del talón llegue a la perforación -->
    <component
      :is="slug ? NuxtLink : 'div'"
      :to="slug ? businessPath(slug) : undefined"
      class="group grid grid-cols-[1fr_auto] transition-opacity"
      :class="{ 'opacity-45': expired }"
    >
      <span class="flex min-w-0 flex-col justify-center gap-xxs py-md pr-md">
        <span class="text-[24px] leading-[1.05] font-extrabold tracking-[0.01em] text-ink transition-colors sm:text-[30px]" :class="{ 'group-hover:text-veci-pink': slug }">
          {{ promo.text }}
        </span>
        <span class="text-body-sm text-muted">{{ promo.note }}</span>
      </span>

      <!-- Talón -->
      <span class="flex min-w-32 flex-col justify-center border-l-2 border-dashed border-hairline-strong py-md pl-md text-right">
        <small class="block text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Termina en</small>
        <b class="text-[22px] font-bold text-ink tabular-nums" role="timer">{{ expired ? 'Vuelve mañana' : formatCountdown(left) }}</b>
        <span class="block text-[12px] font-semibold text-veci-pink">{{ promo.remaining }}</span>
        <span class="mt-xs block h-[3px] overflow-hidden rounded-[3px] bg-ink/7" aria-hidden="true">
          <span class="block h-full bg-veci-pink transition-[width] duration-1000 ease-linear" :style="{ width: `${progress}%` }" />
        </span>
      </span>
    </component>
  </div>
</template>
