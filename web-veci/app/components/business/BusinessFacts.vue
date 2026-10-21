<script setup lang="ts">
import type { Business } from '~/api/types'
import { useRecommendedStore } from '~/stores/recommended'

/**
 * Datos del negocio para la tarjeta flotante del feed, con el sistema tipográfico de los posts:
 * cifras de un vistazo (calificación · recomiendan) en una caja de borde fino, y filas de dos
 * niveles (dato principal + apoyo) para el horario y la dirección (con la distancia). Solo neutros.
 */
const props = defineProps<{ business: Business }>()

const recommended = useRecommendedStore()
const recommendations = computed(() =>
  props.business.recommendations + (recommended.isRecommended(props.business.id) ? 1 : 0)
)

const now = useNow()
const status = computed(() => scheduleStatus(props.business, now.value))
</script>

<template>
  <div>
    <!-- Cifras de un vistazo (valor arriba con flex-col-reverse; el orden semántico sigue dt → dd) -->
    <dl class="grid grid-cols-2 divide-x divide-hairline rounded-control border border-hairline py-sm text-center">
      <div class="flex flex-col-reverse gap-0.5 px-xxs">
        <dt class="text-meta font-medium text-muted">Calificación</dt>
        <dd class="inline-flex items-center justify-center gap-xxs font-headline text-lead font-bold text-ink tabular-nums">
          <Icon name="material-symbols:star-rounded" size="16" class="text-brand" aria-hidden="true" />
          {{ business.rating.toFixed(1) }}
        </dd>
      </div>
      <div class="flex flex-col-reverse gap-0.5 px-xxs">
        <dt class="text-meta font-medium text-muted">Recomiendan</dt>
        <dd class="inline-flex items-center justify-center gap-xxs font-headline text-lead font-bold text-ink tabular-nums">
          <Icon name="material-symbols:handshake-outline" size="16" aria-hidden="true" />
          {{ recommendations }}
        </dd>
      </div>
    </dl>

    <!-- Horario y dirección: ícono gris + dato principal + apoyo (la etiqueta queda para lectores de pantalla) -->
    <dl class="mt-md flex flex-col gap-sm">
      <div class="grid grid-cols-[18px_minmax(0,1fr)] gap-sm">
        <Icon name="material-symbols:schedule-outline" size="18" class="mt-px text-muted" aria-hidden="true" />
        <div>
          <dt class="sr-only">Horario</dt>
          <dd>
            <span class="block text-label leading-[1.3] font-semibold text-ink">{{ status.label }}</span>
            <span class="mt-0.5 block text-support leading-[1.4] text-body [word-spacing:0.08em]">{{ hoursText(business.hours) }}</span>
          </dd>
        </div>
      </div>
      <div class="grid grid-cols-[18px_minmax(0,1fr)] gap-sm">
        <Icon name="material-symbols:location-on-outline" size="18" class="mt-px text-muted" aria-hidden="true" />
        <div>
          <dt class="sr-only">Dirección</dt>
          <dd>
            <span class="block text-label leading-[1.3] font-semibold text-ink">{{ business.address }}</span>
            <span class="mt-0.5 block text-support leading-[1.4] text-body [word-spacing:0.08em]">{{ business.walkMinutes }} min a pie<span class="mx-1 text-muted" aria-hidden="true">·</span>{{ formatDistance(business.distanceMeters) }}</span>
          </dd>
        </div>
      </div>
    </dl>
  </div>
</template>
