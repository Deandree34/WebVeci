<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * "¿Qué hacen y cuánto cuesta?": una fila por servicio con el nombre (y su nota) a la izquierda
 * y el precio a la derecha, la duración como dato secundario y, con citas, "Apartar" directo.
 */
const props = defineProps<{ business: Business, canBook?: boolean }>()
defineEmits<{ book: [service: string] }>()

/**
 * El servicio de la oferta vigente lleva su chip: el de nombre más largo que aparece en el texto
 * de la oferta ("Corte + barba $150" marca "Corte + barba", no también "Corte").
 */
const promoService = computed(() => {
  const text = props.business.promo?.text.toLowerCase()
  if (!text) return undefined
  return (props.business.services ?? [])
    .filter((service) => text.includes(service.name.toLowerCase()))
    .sort((a, b) => b.name.length - a.name.length)[0]?.name
})
const inPromo = (name: string) => name === promoService.value
</script>

<template>
  <BusinessProfileCard
    id="servicios"
    title="Servicios y precios"
    icon="material-symbols:sell-outline"
    :subtitle="`${business.services!.length} servicios · precios en el negocio`"
  >
    <ul class="-mx-xs divide-y divide-hairline-strong">
      <li v-for="service in business.services" :key="service.name" class="flex items-center gap-sm px-xs py-sm">
        <div class="min-w-0 flex-1">
          <p class="flex flex-wrap items-center gap-xs text-body-md font-medium text-ink">
            {{ service.name }}
            <span v-if="inPromo(service.name)" class="rounded-pill bg-veci-pink/15 px-xs text-[11px] font-medium text-veci-pink">En oferta</span>
          </p>
          <p v-if="service.note" class="text-body-xs text-muted">{{ service.note }}</p>
          <p v-if="service.durationMinutes" class="mt-0.5 inline-flex items-center gap-xxs text-body-xs text-muted">
            <Icon name="material-symbols:timer-outline" size="14" aria-hidden="true" />
            {{ formatDuration(service.durationMinutes) }}
          </p>
        </div>

        <p class="shrink-0 text-right">
          <span v-if="service.fromPrice" class="block text-[11px] text-muted">Desde</span>
          <span class="text-body-md font-bold text-ink tabular-nums">{{ formatMoney(service.price) }}</span>
        </p>

        <button
          v-if="canBook"
          type="button"
          :aria-label="`Apartar ${service.name}`"
          class="shrink-0 rounded-control border border-hairline-strong px-sm py-xs text-body-xs font-medium text-ink transition-colors hover:border-veci-purple hover:bg-surface-elevated"
          @click="$emit('book', service.name)"
        >
          Apartar
        </button>
      </li>
    </ul>
  </BusinessProfileCard>
</template>
