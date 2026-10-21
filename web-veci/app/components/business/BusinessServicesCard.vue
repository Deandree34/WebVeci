<script setup lang="ts">
import type { Business, Service } from '~/api/types'

/**
 * "¿Qué hacen y cuánto cuesta?": una fila por servicio con el nombre (y su nota) a la izquierda
 * y el precio a la derecha, la duración como dato secundario y, con citas, "Apartar" directo.
 */
const props = defineProps<{ business: Business, canBook?: boolean }>()
defineEmits<{ book: [service: string] }>()

/** Los servicios con una oferta del negocio llevan su chip (ver `promoService`). */
const offerServices = computed(() => businessPromos(props.business).map((promo) => promoService(props.business, promo)))
const inPromo = (name: string) => offerServices.value.includes(name)

/** Apoyo de la fila: nota · duración ("Incluye lavado · 45 min"). */
const detail = (service: Service) =>
  [service.note, service.durationMinutes ? formatDuration(service.durationMinutes) : ''].filter(Boolean)
</script>

<template>
  <BusinessProfileCard
    id="servicios"
    title="Servicios y precios"
    :subtitle="`${business.services!.length} servicios · precios en el negocio`"
  >
    <ul class="-mx-xs divide-y divide-hairline">
      <li v-for="service in business.services" :key="service.name" class="flex items-center gap-sm px-xs py-sm">
        <div class="min-w-0 flex-1">
          <p class="flex flex-wrap items-center gap-xs text-copy leading-[1.3] font-semibold text-ink">
            {{ service.name }}
            <span v-if="inPromo(service.name)" class="rounded-pill border border-hairline-strong px-xs text-caption leading-[1.6] font-semibold text-ink">En oferta</span>
          </p>
          <p v-if="detail(service).length" class="mt-0.5 text-support leading-[1.4] text-body">
            <template v-for="(part, i) in detail(service)" :key="part">
              <span v-if="i" class="mx-1 text-muted" aria-hidden="true">·</span>{{ part }}
            </template>
          </p>
        </div>

        <p class="shrink-0 text-right">
          <span v-if="service.fromPrice" class="block text-caption font-medium text-muted">Desde</span>
          <span class="font-headline text-copy font-bold text-ink tabular-nums">{{ formatMoney(service.price) }}</span>
        </p>

        <button
          v-if="canBook"
          type="button"
          :aria-label="`Apartar ${service.name}`"
          class="h-8 shrink-0 rounded-pill border border-hairline-strong px-sm text-support font-semibold text-body-strong transition-colors hover:bg-surface-elevated"
          @click="$emit('book', service.name)"
        >
          Apartar
        </button>
      </li>
    </ul>
  </BusinessProfileCard>
</template>
