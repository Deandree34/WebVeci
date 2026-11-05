<script setup lang="ts">
import type { Business } from '~/api/types'

/** Tarjeta "Reseñas de vecinos" del perfil: el resumen y las primeras 3 reseñas, con "Ver todas". */
interface BusinessReviewsCardProps {
  business: Business
}

defineProps<BusinessReviewsCardProps>()
</script>

<template>
  <BusinessProfileCard id="resenas" title="Reseñas de vecinos" subtitle="Solo vecinos que ya usaron el servicio">
    <BusinessReviews :business="business" :preview="3" />
  </BusinessProfileCard>
</template>
