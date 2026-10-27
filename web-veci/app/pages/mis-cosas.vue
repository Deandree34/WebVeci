<script setup lang="ts">
import { useBusinesses } from '~/features/businesses/queries'
import { useMineStore } from '~/features/bookings/stores'

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
        <!-- Ícono en círculo neutro; dato principal + apoyo en la fuente del sistema, como las filas del perfil -->
        <span class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-ink" aria-hidden="true">
          <Icon name="material-symbols:event-available" size="22" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-copy leading-[1.3] font-semibold text-ink">{{ booking.service }} en {{ businessName(booking.businessId) }}</p>
          <p class="mt-0.5 text-support leading-[1.4] text-body">
            {{ dayLabel[booking.day] }} a las {{ booking.time }}<span class="mx-1 text-muted" aria-hidden="true">·</span>a nombre de {{ booking.customerName }}
          </p>
        </div>
      </li>
    </ul>
    <BEmptyState v-else icon="material-symbols:checklist" title="Todavía no tienes nada pendiente">
      Cuando apartes una cita, aparecerá aquí.
    </BEmptyState>
  </div>
</template>
