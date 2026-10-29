<script setup lang="ts">
import type { Business, Service } from '~/api/types'

/**
 * "¿Qué hacen y cuánto cuesta?": una fila por servicio con el nombre (y su nota) a la izquierda
 * y el precio a la derecha, la duración como dato secundario y, con citas, "Apartar" directo.
 */
interface BusinessServicesCardProps {
  business: Business
  canBook?: boolean
}

interface BusinessServicesCardEmits {
  book: [service: string]
}

const props = defineProps<BusinessServicesCardProps>()
defineEmits<BusinessServicesCardEmits>()

const services = computed(() => props.business.services ?? [])
const subtitle = computed(() => `${services.value.length} servicios · precios en el negocio`)

/** Los servicios con una oferta del negocio llevan su chip (ver `promoService`). */
const offerServices = computed(() =>
  businessPromos(props.business).map((promo) => promoService(props.business, promo))
)

function inPromo(name: string) {
  return offerServices.value.includes(name)
}

/** Apoyo de la fila: nota · duración ("Incluye lavado · 45 min"). */
function detail(service: Service) {
  const parts: string[] = []
  if (service.note) parts.push(service.note)
  if (service.durationMinutes) parts.push(formatDuration(service.durationMinutes))
  return parts
}
</script>

<template>
  <BusinessProfileCard
    id="servicios"
    title="Servicios y precios"
    :subtitle="subtitle"
  >
    <ul class="-mx-xs divide-y divide-hairline">
      <li v-for="service in services" :key="service.name" class="flex items-center gap-sm px-xs py-sm">
        <div class="min-w-0 flex-1">
          <p class="flex flex-wrap items-center gap-xs text-copy leading-[1.3] font-semibold text-ink">
            {{ service.name }}
            <BBadge v-if="inPromo(service.name)">En oferta</BBadge>
          </p>
          <p v-if="detail(service).length" class="mt-0.5 text-support leading-[1.4] text-body">
            <BDotList :parts="detail(service)" />
          </p>
        </div>

        <p class="shrink-0 text-right">
          <span v-if="service.fromPrice" class="block text-caption font-medium text-muted">Desde</span>
          <span class="font-headline text-copy font-bold text-ink tabular-nums">{{ formatMoney(service.price) }}</span>
        </p>

        <BButton v-if="canBook" size="sm" :aria-label="`Apartar ${service.name}`" @click="$emit('book', service.name)">
          Apartar
        </BButton>
      </li>
    </ul>
  </BusinessProfileCard>
</template>
