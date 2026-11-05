<script setup lang="ts">
import { useBusinesses } from '#layers/business/queries'
import { useNotices } from '#layers/notice/queries'

/** Columna derecha con el estilo del menú izquierdo: sin tarjetas, títulos de sección y filas. */

/** Cuántos negocios abiertos se muestran en la columna. */
const OPEN_LIMIT = 5

const { data: businesses, isPending } = useBusinesses()
const { data: notices } = useNotices()
const now = useNow()

const openNow = computed(() =>
  (businesses.value ?? []).filter((business) => scheduleStatus(business, now.value).open).slice(0, OPEN_LIMIT)
)

/** Solo los que no han pasado. */
const upcoming = computed(() => (notices.value ?? []).filter((notice) => daysUntil(notice.date, now.value) >= 0))
</script>

<template>
  <aside
    class="sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-col gap-lg overflow-y-auto py-lg xl:flex"
    aria-label="Lo esencial de la colonia"
  >
    <section aria-labelledby="rail-open">
      <!-- Rótulos en Lora cursiva, igual que "Categorías" del menú izquierdo -->
      <h2 id="rail-open" class="mb-xxs px-sm font-quote text-lead font-medium tracking-normal text-body normal-case italic">Abierto ahora</h2>
      <p v-if="isPending" class="px-sm text-body-sm text-muted">Cargando…</p>
      <ul v-else-if="openNow.length" class="flex flex-col divide-y divide-hairline">
        <li v-for="business in openNow" :key="business.id">
          <BusinessRow :business="business" rail />
        </li>
      </ul>
      <!-- Mismo estilo que la línea de apoyo de los avisos -->
      <p v-else class="px-sm text-support leading-[1.4] text-body">
        A esta hora casi todo está cerrado. Mira qué abre más tarde.
      </p>
    </section>

    <section v-if="upcoming.length" aria-labelledby="rail-notices">
      <h2 id="rail-notices" class="mb-xxs px-sm font-quote text-lead font-medium tracking-normal text-body normal-case italic">Próximos avisos</h2>
      <ul class="flex flex-col divide-y divide-hairline">
        <li v-for="notice in upcoming" :key="notice.id">
          <SocialNoticeRow :notice="notice" />
        </li>
      </ul>
    </section>

    <!-- Pie legal al final de la columna (en pantallas sin columna derecha va al final del feed) -->
    <SocialLegal class="mt-auto" />
  </aside>
</template>
