<script setup lang="ts">
import type { Business, PaymentMethod } from '~/api/types'

/** "¿Dónde está y cómo pago?": dirección con distancia, contacto y formas de pago, una fila por dato. */
defineProps<{ business: Business }>()

const paymentInfo: Record<PaymentMethod, { label: string, icon: string }> = {
  efectivo: { label: 'Efectivo', icon: 'material-symbols:payments-outline' },
  tarjeta: { label: 'Tarjeta', icon: 'material-symbols:credit-card-outline' },
  transferencia: { label: 'Transferencia', icon: 'material-symbols:account-balance-outline' }
}

const row = 'flex items-start gap-sm py-sm'
const rowIcon = 'mt-0.5 shrink-0 text-muted'
const link = 'shrink-0 rounded-control px-sm py-xxs text-body-sm font-medium text-link transition-colors hover:bg-surface-elevated'
</script>

<template>
  <BusinessProfileCard id="info" title="Ubicación y pago" icon="material-symbols:location-on-outline">
    <div class="divide-y divide-hairline-strong">
      <!-- Dirección: el dato arriba, qué tan lejos debajo -->
      <div :class="row">
        <Icon name="material-symbols:location-on-outline" size="20" :class="rowIcon" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-body-sm font-medium text-ink">{{ business.address }}</p>
          <p class="text-body-xs text-muted">{{ formatDistance(business.distanceMeters) }} de ti · {{ business.walkMinutes }} min a pie</p>
        </div>
        <a :href="mapsUrl(business.address)" target="_blank" rel="noopener" :class="link">Cómo llegar</a>
      </div>

      <div v-if="business.contact?.whatsapp || business.contact?.phone" :class="row">
        <Icon name="material-symbols:call-outline" size="20" :class="rowIcon" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-body-sm font-medium text-ink tabular-nums">{{ business.contact.phone ?? business.contact.whatsapp }}</p>
          <p class="text-body-xs text-muted">{{ business.contact.whatsapp ? 'WhatsApp' : 'Teléfono' }}</p>
        </div>
        <a
          v-if="business.contact.whatsapp"
          :href="whatsappUrl(business.contact.whatsapp, 'Hola, los vi en VECI')"
          target="_blank"
          rel="noopener"
          :class="link"
        >Mensaje</a>
        <a v-else :href="`tel:${business.contact.phone}`" :class="link">Llamar</a>
      </div>

      <div :class="row">
        <Icon name="material-symbols:wallet-outline" size="20" :class="rowIcon" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-body-sm font-medium text-ink">Pago directo en el negocio</p>
          <p class="text-body-xs text-muted">VECI no cobra comisiones</p>
          <ul v-if="business.payments?.length" class="mt-xs flex flex-wrap gap-xs">
            <li
              v-for="method in business.payments"
              :key="method"
              class="inline-flex items-center gap-xxs rounded-pill bg-surface-elevated px-sm py-xxs text-body-xs text-body"
            >
              <Icon :name="paymentInfo[method].icon" size="14" aria-hidden="true" />
              {{ paymentInfo[method].label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </BusinessProfileCard>
</template>
