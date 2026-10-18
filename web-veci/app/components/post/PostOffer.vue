<script setup lang="ts">
import type { Promo } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Oferta dentro del post, con la organización y tipografía del prototipo `veci-feed`:
 * texto grande a la izquierda, cuenta regresiva a la derecha y barra de tiempo abajo.
 * Al pasar el cursor, el texto toma el degradado VECI.
 */
const props = defineProps<{ promo: Promo, slug: string }>()

const { left, expired, progress } = usePromoCountdown(() => props.promo)
</script>

<template>
  <div class="mx-md pt-md">
    <p class="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.06em] text-veci-purple-text uppercase">
      <Icon name="material-symbols:sell" size="14" aria-hidden="true" />
      Oferta
    </p>
    <NuxtLink
      :to="businessPath(slug)"
      class="group grid grid-cols-[1fr_auto] items-end gap-x-lg gap-y-xxs pt-xs pb-sm transition-opacity"
      :class="{ 'opacity-45': expired }"
    >
      <span class="text-[24px] leading-[1.05] font-extrabold tracking-[-0.025em] text-ink group-hover:text-veci-gradient sm:text-[30px]">
        {{ promo.text }}
      </span>
      <span class="col-start-1 text-body-sm text-muted">{{ promo.note }}</span>

      <span class="col-start-2 row-span-2 row-start-1 self-center text-right">
        <small class="block text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Termina en</small>
        <b class="text-[22px] font-bold text-ink tabular-nums" role="timer">{{ expired ? 'Vuelve mañana' : formatCountdown(left) }}</b>
        <!-- inline-block: el degradado (igual que la barra) abarca solo el texto, no toda la columna -->
        <span class="block"><span class="inline-block text-[12px] font-semibold text-veci-gradient">{{ promo.remaining }}</span></span>
      </span>

      <span class="col-span-full mt-xs h-[3px] overflow-hidden rounded-[3px] bg-ink/7" aria-hidden="true">
        <span class="block h-full bg-veci-gradient transition-[width] duration-1000 ease-linear" :style="{ width: `${progress}%` }" />
      </span>
    </NuxtLink>
  </div>
</template>
