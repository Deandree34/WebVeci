<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * Citas como adjunto del post: cuándo hay lugar es el mensaje principal; el apoyo, la fecha y
 * cuántos lugares quedan ("Mar 20 oct · 4 lugares"). Ni horas ni precios (cambian): se ven al apartar.
 * `@action` ("Apartar") abre la ventana de apartar cita sin salir del feed.
 */
interface PostAvailabilityProps {
  business: Business
  onAction?: () => void
}

const props = defineProps<PostAvailabilityProps>()

const { summary, full, title, day, count } = useAvailability(() => props.business)

const support = computed(() => {
  if (full.value) return ['Sin lugares por ahora']
  const parts: string[] = []
  const d = day.value
  if (d) {
    const weekday = d.weekday.charAt(0) + d.weekday.slice(1).toLowerCase()
    parts.push(`${weekday} ${d.number} ${d.month.toLowerCase()}`)
  }
  parts.push(`${count.value} ${count.value === 1 ? 'lugar' : 'lugares'}`)
  return parts
})
</script>

<template>
  <PostAttachment v-if="summary" :title="title" :support="support" action="Apartar" :on-action="onAction" />
</template>
