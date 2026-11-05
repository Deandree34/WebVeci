<script setup lang="ts">
import type { BookingRequest } from '~/api/types'
import { useMineStore } from '#layers/booking/stores'
import { useBusinesses } from '#layers/business/queries'

/** Mis cosas: las citas del vecino (luego también pedidos y solicitudes). */

const DAY_LABEL: Record<BookingRequest['day'], string> = { today: 'Hoy', tomorrow: 'Mañana' }

definePageMeta({ layout: 'social' })

useHead({ title: 'Mis cosas — VECI' })

const mine = useMineStore()
const { data: businesses } = useBusinesses()
const bookings = computed(() => mine.bookings)

function businessName(id: string) {
  const business = businesses.value?.find((item) => item.id === id)
  return business?.name ?? 'Negocio'
}

const dayLabel = DAY_LABEL
</script>

<template>
  <div>
    <SocialPageHeader title="Mis cosas" description="Tus citas, pedidos y solicitudes de hoy." />

    <ul v-if="bookings.length" class="flex flex-col gap-xs">
      <li
        v-for="booking in bookings"
        :key="booking.id"
        class="flex items-center gap-sm rounded-card bg-surface-card p-md"
      >
        <!-- Ícono en círculo neutro; dato principal + apoyo en la fuente del sistema, como las filas del perfil -->
        <BIconCircle icon="material-symbols:event-available" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-copy leading-[1.3] font-semibold text-ink">{{ booking.service }} en {{ businessName(booking.businessId) }}</p>
          <p class="mt-0.5 text-support leading-[1.4] text-body">
            {{ dayLabel[booking.day] }} a las {{ booking.time }}<BDot />a nombre de {{ booking.customerName }}
          </p>
        </div>
      </li>
    </ul>
    <BEmptyState v-else icon="material-symbols:checklist" title="Todavía no tienes nada pendiente">
      Cuando apartes una cita, aparecerá aquí.
    </BEmptyState>
  </div>
</template>
