<script setup lang="ts">
import { useBusinesses } from '~/features/businesses/queries'

const { data: businesses, isPending } = useBusinesses()
const now = useNow()

const openNow = computed(() => {
  const hour = colonyHour(now.value)
  return (businesses.value ?? []).filter((business) => isOpenAt(business.hours, hour)).slice(0, 5)
})
</script>

<template>
  <aside
    class="sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-col gap-lg overflow-y-auto py-lg xl:flex"
    aria-label="Lo esencial de la colonia"
  >
    <section class="rounded-card bg-surface-card p-md">
      <h2 class="mb-sm flex items-center gap-xs text-body-md font-medium normal-case text-on-dark">
        <span class="size-2 rounded-full bg-success" aria-hidden="true" />
        Abierto ahora
      </h2>

      <p v-if="isPending" class="text-body-sm text-muted">Cargando…</p>
      <ul v-else-if="openNow.length" class="-mx-xs flex flex-col">
        <li v-for="business in openNow" :key="business.id">
          <BusinessRow :business="business" compact />
        </li>
      </ul>
      <p v-else class="text-body-sm text-muted">
        A esta hora casi todo está cerrado. Mira qué abre más tarde.
      </p>
    </section>

    <p class="px-xs text-body-xs text-muted-soft">
      Cómo funciona · Para negocios · Reglas de la colonia · Privacidad
    </p>
  </aside>
</template>
