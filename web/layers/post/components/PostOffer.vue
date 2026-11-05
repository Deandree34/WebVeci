<script setup lang="ts">
import type { Promo } from '~/api/types'

/**
 * Oferta como adjunto del post: la promoción es el mensaje principal; el apoyo, su nota y hasta
 * cuándo vale, dicho corto ("hoy hasta 9 pm", "hasta el domingo", "últimos 25 min").
 * `@action` abre algo en una ventana (`action`: "Ver oferta" por defecto en el feed, "Apartar" en la
 * ventana de ofertas); sin él (perfil del negocio) no hay botón.
 */
interface PostOfferProps {
  promo: Promo
  action?: string
  onAction?: () => void
}

const HOUR = 3_600_000

const MINUTE = 60_000

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const props = defineProps<PostOfferProps>()

const { left, expired } = usePromoCountdown(() => props.promo)
const now = useNow()
const actionLabel = computed(() => props.action ?? 'Ver oferta')

/** Hasta cuándo vale la oferta, en pocas palabras. */
const deadline = computed(() => {
  if (expired.value) return 'vuelve mañana'
  if (left.value < HOUR) return `últimos ${Math.max(1, Math.ceil(left.value / MINUTE))} min`
  if (props.promo.until === 'today') {
    const end = props.promo.endsAtHour ?? 24
    if (end >= 24) return 'hoy hasta medianoche'
    return `hoy hasta ${formatHour(end)}`
  }
  if (colonyWeekday(now.value) === 0) return 'último día'
  return 'hasta el domingo'
})

/** La primera parte va con mayúscula inicial ("Vuelve mañana" si no hay nota). */
const support = computed(() => {
  const parts = [props.promo.note, deadline.value].filter((part): part is string => !!part)
  return parts.map((part, i) => (i === 0 ? capitalize(part) : part))
})
</script>

<template>
  <PostAttachment :title="promo.text" :support="support" :action="actionLabel" :on-action="onAction" />
</template>
