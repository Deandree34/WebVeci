<script setup lang="ts">
import type { Promo } from '~/api/types'

/** Cuenta regresiva de una promoción, con barra de tiempo restante (`hideBar` la quita). */
interface BusinessPromoCountdownProps {
  promo: Promo
  hideBar?: boolean
}

const props = defineProps<BusinessPromoCountdownProps>()

const { left, expired, progress } = usePromoCountdown(() => props.promo)
const barWidth = computed(() => ({ width: `${progress.value}%` }))
</script>

<template>
  <div>
    <p class="flex items-baseline gap-xs font-headline text-support font-medium text-on-dark/80">
      <Icon name="material-symbols:timer-outline" size="16" class="self-center" aria-hidden="true" />
      <template v-if="expired">Terminó · vuelve pronto</template>
      <template v-else>
        Termina en
        <span class="text-label font-bold text-on-dark tabular-nums" role="timer">{{ formatCountdown(left) }}</span>
      </template>
    </p>
    <div v-if="!hideBar" class="mt-xs h-1 overflow-hidden rounded-pill bg-surface-elevated" aria-hidden="true">
      <div class="h-full rounded-pill bg-ink transition-[width] duration-1000 ease-linear" :style="barWidth" />
    </div>
  </div>
</template>
