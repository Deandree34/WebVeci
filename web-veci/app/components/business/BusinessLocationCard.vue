<script setup lang="ts">
import type { Business, PaymentMethod } from '~/api/types'

/**
 * "¿Dónde está y cómo pago?": dirección con distancia, contacto y formas de pago, una fila por dato
 * (dato principal + apoyo en Plus Jakarta Sans). Acciones como botones de contorno; solo neutros.
 */
defineProps<{ business: Business }>()

const paymentInfo: Record<PaymentMethod, { label: string, icon: string }> = {
  efectivo: { label: 'Efectivo', icon: 'material-symbols:payments-outline' },
  tarjeta: { label: 'Tarjeta', icon: 'material-symbols:credit-card-outline' },
  transferencia: { label: 'Transferencia', icon: 'material-symbols:account-balance-outline' }
}

const row = 'flex items-start gap-sm py-sm'
const rowIcon = 'mt-0.5 shrink-0 text-muted'
const main = 'text-[14px] leading-[1.3] font-semibold text-ink'
const support = 'mt-0.5 text-[13px] leading-[1.4] font-medium text-body'
const link = 'inline-flex h-8 shrink-0 items-center rounded-pill border border-hairline-strong px-sm text-[13px] font-semibold text-body-strong transition-colors hover:bg-surface-elevated'
</script>

<template>
  <BusinessProfileCard id="info" title="Ubicación y pago">
    <div class="divide-y divide-hairline font-headline">
      <!-- Dirección: el dato arriba, qué tan lejos debajo -->
      <div :class="row">
        <Icon name="material-symbols:location-on-outline" size="20" :class="rowIcon" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p :class="main">{{ business.address }}</p>
          <p :class="support">{{ formatDistance(business.distanceMeters) }} de ti<span class="mx-1 text-muted" aria-hidden="true">·</span>{{ business.walkMinutes }} min a pie</p>
        </div>
        <a :href="mapsUrl(business.address)" target="_blank" rel="noopener" :class="link">Cómo llegar</a>
      </div>

      <div v-if="business.contact?.whatsapp || business.contact?.phone" :class="row">
        <Icon name="material-symbols:call-outline" size="20" :class="rowIcon" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p :class="[main, 'tabular-nums']">{{ business.contact.phone ?? business.contact.whatsapp }}</p>
          <p :class="support">{{ business.contact.whatsapp ? 'WhatsApp' : 'Teléfono' }}</p>
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
          <p :class="main">Pago directo en el negocio</p>
          <p :class="support">VECI no cobra comisiones</p>
          <ul v-if="business.payments?.length" class="mt-xs flex flex-wrap gap-xs">
            <li
              v-for="method in business.payments"
              :key="method"
              class="inline-flex items-center gap-xxs rounded-pill border border-hairline-strong px-sm py-xxs text-[13px] font-medium text-body"
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
