<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * Citas como adjunto del post: cuándo hay lugar es el mensaje principal; el apoyo, la fecha y
 * cuántos lugares quedan ("Mar 20 oct · 4 lugares"). Ni horas ni precios (cambian): se ven al apartar.
 * `@action` ("Apartar") abre la ventana de apartar cita sin salir del feed.
 */
const props = defineProps<{ business: Business, onAction?: () => void }>()

const { summary, full, title, day, count } = useAvailability(() => props.business)

const support = computed(() => {
  if (full.value) return ['Sin lugares por ahora']
  const d = day.value
  const weekday = d ? d.weekday.charAt(0) + d.weekday.slice(1).toLowerCase() : ''
  return [
    d ? `${weekday} ${d.number} ${d.month.toLowerCase()}` : '',
    `${count.value} ${count.value === 1 ? 'lugar' : 'lugares'}`
  ].filter(Boolean)
})
</script>

<template>
  <PostAttachment v-if="summary" :title="title" :support="support" action="Apartar" :on-action="onAction" />
</template>
