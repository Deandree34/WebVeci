<script setup lang="ts">
import type { Business } from '~/api/types'
import { useRecommendedStore } from '~/stores/recommended'

/**
 * Datos del negocio ordenados: cifras de un vistazo (calificación · recomiendan · distancia)
 * y filas con ícono y etiqueta (horario, dirección). Tarjeta flotante del feed.
 */
const props = defineProps<{ business: Business }>()

const recommended = useRecommendedStore()
const recommendations = computed(() =>
  props.business.recommendations + (recommended.isRecommended(props.business.id) ? 1 : 0)
)
</script>

<template>
  <div>
    <!-- Cifras de un vistazo (valor arriba con flex-col-reverse; el orden semántico sigue dt → dd) -->
    <dl class="grid grid-cols-3 divide-x divide-hairline-strong rounded-control bg-surface-soft py-xs text-center">
      <div class="flex flex-col-reverse px-xxs">
        <dt class="text-[12px] text-muted">Calificación</dt>
        <dd class="inline-flex items-center justify-center gap-xxs text-body-md font-bold text-ink tabular-nums">
          <Icon name="material-symbols:star" size="16" class="text-warning" aria-hidden="true" />
          {{ business.rating.toFixed(1) }}
        </dd>
      </div>
      <div class="flex flex-col-reverse px-xxs">
        <dt class="text-[12px] text-muted">Recomiendan</dt>
        <dd class="inline-flex items-center justify-center gap-xxs text-body-md font-bold text-ink tabular-nums">
          <Icon name="material-symbols:handshake-outline" size="16" class="text-muted" aria-hidden="true" />
          {{ recommendations }}
        </dd>
      </div>
      <div class="flex flex-col-reverse px-xxs">
        <dt class="text-[12px] text-muted">{{ business.walkMinutes }} min a pie</dt>
        <dd class="text-body-md font-bold text-ink tabular-nums">{{ formatDistance(business.distanceMeters) }}</dd>
      </div>
    </dl>

    <!-- Datos de texto: una fila por dato, con ícono y etiqueta -->
    <dl class="mt-md flex flex-col gap-sm">
      <div class="flex gap-sm">
        <Icon name="material-symbols:schedule-outline" size="18" class="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
        <div>
          <dt class="text-body-xs text-muted">Horario</dt>
          <dd class="text-body-sm text-body">
            <BusinessOpenStatus :schedule="business" />
            <span class="block text-body-xs text-muted">{{ hoursText(business.hours) }}</span>
          </dd>
        </div>
      </div>
      <div class="flex gap-sm">
        <Icon name="material-symbols:location-on-outline" size="18" class="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
        <div>
          <dt class="text-body-xs text-muted">Dirección</dt>
          <dd class="text-body-sm text-body">{{ business.address }}</dd>
        </div>
      </div>
    </dl>
  </div>
</template>
