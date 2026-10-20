<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * Cuerpo de la tarjeta de citas. La tarjeta entera es la **hoja de calendario de taco**
 * (el zigzag de arriba lo pone `FeedPostCard` con `PostCalendarEdge`); aquí va la fecha con lugar
 * a la izquierda (mes, día, día de la semana) y a la derecha el título, el nivel y "Ver horarios
 * y apartar". Líneas punteadas arriba, abajo y entre fecha y mensaje. Solo grises + verde.
 * Ni horas ni precios (cambian): se ven al apartar. Abre el negocio con la reserva (`?cita=1`).
 *
 * Forma por tipo: oferta = cupón con talón · reseña = testimonio · citas = hoja de calendario de taco.
 */
const props = defineProps<{ business: Business }>()

const { summary, full, title, day, level } = useAvailability(() => props.business)
</script>

<template>
  <div v-if="summary" class="mx-md">
    <span class="sr-only">Citas disponibles</span>

    <!-- Líneas punteadas arriba (bajo la cabecera) y abajo (sobre el pie); la vertical de la fecha
         va de una a otra: el padding va en cada columna para que llegue de arriba a abajo -->
    <NuxtLink
      :to="{ path: businessPath(business.slug), query: { cita: '1' } }"
      class="group mt-sm grid grid-cols-[auto_1fr] border-y-2 border-dotted border-hairline-strong transition-opacity"
      :class="{ 'opacity-45': full }"
    >
      <!-- Fecha, como en una hoja de taco -->
      <component
        :is="day ? 'time' : 'span'"
        :datetime="day?.date"
        class="flex min-w-16 flex-col items-center justify-center gap-xxs border-r-2 border-dotted border-hairline-strong py-md pr-md leading-none"
      >
        <span class="text-[11px] font-bold tracking-[0.12em] text-muted">{{ day?.month ?? '' }}</span>
        <span class="text-[40px] font-extrabold tracking-[-0.03em]" :class="day ? 'text-ink' : 'text-muted'">{{ day?.number ?? '—' }}</span>
        <span class="text-[11px] font-bold tracking-[0.12em]" :class="day?.isToday ? 'text-success' : 'text-muted'">{{ day?.weekday ?? '' }}</span>
      </component>

      <span class="flex min-w-0 flex-col justify-center gap-sm py-md pl-md">
        <span class="text-[24px] leading-[1.05] font-extrabold tracking-[0.01em] text-ink transition-colors group-hover:text-success sm:text-[30px]">
          {{ title }}
        </span>

        <span class="flex items-center justify-between gap-sm">
          <span v-if="level" class="inline-flex items-center gap-xs">
            <span class="flex gap-1" aria-hidden="true">
              <span v-for="n in 3" :key="n" class="h-1.5 w-5 rounded-full" :class="n <= level.filled ? 'bg-success' : 'bg-ink/10'" />
            </span>
            <span class="text-[12px] font-semibold text-success">{{ level.label }}</span>
          </span>
          <span class="ml-auto inline-flex items-center text-body-xs whitespace-nowrap text-muted transition-colors group-hover:text-ink">
            <!-- En celular no cabe completo: versión corta -->
            <span class="sm:hidden">Apartar</span>
            <span class="hidden sm:inline">Ver horarios y apartar</span>
            <Icon name="material-symbols:chevron-right" size="16" aria-hidden="true" />
          </span>
        </span>
      </span>
    </NuxtLink>
  </div>
</template>
