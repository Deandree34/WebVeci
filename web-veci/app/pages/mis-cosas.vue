<script setup lang="ts">
import { useBusinesses } from '~/features/businesses/queries'
import { useMineStore } from '~/stores/mine'

definePageMeta({ layout: 'social' })
useHead({ title: 'Mis cosas — VECI' })

const mine = useMineStore()
const { data: businesses } = useBusinesses()

const businessName = (id: string) => businesses.value?.find((business) => business.id === id)?.name ?? 'Negocio'
const dayLabel = { today: 'Hoy', tomorrow: 'Mañana' } as const
</script>

<template>
  <div>
    <SocialPageHeader title="Mis cosas" description="Tus citas, pedidos y solicitudes de hoy." />

    <ul v-if="mine.bookings.length" class="flex flex-col gap-xs">
      <li
        v-for="booking in mine.bookings"
        :key="booking.id"
        class="flex items-center gap-sm rounded-card bg-surface-card p-md"
      >
        <Icon name="material-symbols:event-available" size="28" class="shrink-0 text-veci-purple-text" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-body-sm font-medium text-on-dark">Cita en {{ businessName(booking.businessId) }}</p>
          <p class="text-body-xs text-muted">
            {{ booking.service }} · {{ dayLabel[booking.day] }} a las {{ booking.time }} · a nombre de {{ booking.customerName }}
          </p>
        </div>
      </li>
    </ul>
    <BEmptyState v-else icon="material-symbols:checklist" title="Todavía no tienes nada pendiente">
      Cuando apartes una cita, aparecerá aquí.
    </BEmptyState>
  </div>
</template>
