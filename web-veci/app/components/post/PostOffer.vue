<script setup lang="ts">
import type { Promo } from '~/api/types'

/**
 * Oferta como adjunto del post: la promoción es el mensaje principal; el apoyo, su nota y hasta
 * cuándo vale, dicho corto ("hoy hasta 9 pm", "hasta el domingo", "últimos 25 min").
 * `@action` abre algo en una ventana ("Ver oferta" en el feed, "Apartar" en la ventana de ofertas);
 * sin él (perfil del negocio) no hay botón.
 */
const props = withDefaults(defineProps<{ promo: Promo, action?: string, onAction?: () => void }>(), { action: 'Ver oferta' })

const { left, expired } = usePromoCountdown(() => props.promo)
const now = useNow()

const HOUR = 3_600_000

/** Hasta cuándo vale la oferta, en pocas palabras. */
const deadline = computed(() => {
  if (expired.value) return 'vuelve mañana'
  if (left.value < HOUR) return `últimos ${Math.max(1, Math.ceil(left.value / 60_000))} min`
  if (props.promo.until === 'today') {
    const end = props.promo.endsAtHour ?? 24
    return end >= 24 ? 'hoy hasta medianoche' : `hoy hasta ${formatHour(end)}`
  }
  return colonyWeekday(now.value) === 0 ? 'último día' : 'hasta el domingo'
})

const support = computed(() => {
  const parts = [props.promo.note, deadline.value].filter(Boolean)
  // La primera parte va con mayúscula inicial ("Vuelve mañana" si no hay nota)
  return parts.map((part, i) => (i ? part : part.charAt(0).toUpperCase() + part.slice(1)))
})
</script>

<template>
  <PostAttachment :title="promo.text" :support="support" :action="action" :on-action="onAction" />
</template>
