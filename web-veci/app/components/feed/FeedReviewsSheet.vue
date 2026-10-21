<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'

/**
 * "Ver reseñas" sin salir del feed: ventana con todas las reseñas del negocio del post
 * (resumen de calificaciones y cada reseña en Lora cursiva) y "Ver negocio" para ir a su página.
 */
defineProps<{ business?: Business }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <BSheet
    v-model:open="open"
    title="Reseñas de vecinos"
    :subtitle="business?.name"
    quote
  >
    <template v-if="business">
      <BusinessReviews :business="business" />

      <NuxtLink
        :to="businessPath(business.slug)"
        class="mt-xs flex h-10 items-center justify-center rounded-pill border border-hairline-strong px-md text-label font-semibold text-body-strong transition-colors hover:bg-surface-elevated"
        @click="open = false"
      >
        Ver negocio
      </NuxtLink>
    </template>
  </BSheet>
</template>
