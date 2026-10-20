<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * Pie del post en una sola fila, como el de Facebook: a la izquierda Recomendar (con el total)
 * y Compartir, ícono gris + número; a la derecha la pila de quienes lo recomiendan (abre la lista).
 * Recomendar no es un "me gusta" ni la calificación: suma al "N vecinos lo recomiendan".
 * Solo neutros: lo activo se marca con ícono relleno y blanco.
 */
const props = defineProps<{ business: Business }>()

const { isRecommended, total, toggleRecommend, copied, share } = useBusinessSocial(() => props.business)
const recommenders = computed(() => props.business.recommendedBy ?? [])
const listOpen = ref(false)

const action = '-mx-xs inline-flex h-9 items-center gap-xs rounded-control px-xs text-post-body tabular-nums transition-colors hover:bg-surface-elevated'
</script>

<template>
  <footer class="flex items-center gap-lg px-md py-xs">
    <button
      type="button"
      :aria-pressed="isRecommended"
      :aria-label="isRecommended ? `Ya no recomendar a ${business.name}` : `Recomendar a ${business.name}`"
      :class="[action, isRecommended ? 'text-ink' : 'text-muted']"
      @click="toggleRecommend"
    >
      <Icon :name="isRecommended ? 'material-symbols:handshake' : 'material-symbols:handshake-outline'" size="20" aria-hidden="true" />
      <span v-if="total">{{ total }}</span>
    </button>

    <button
      type="button"
      :aria-label="copied ? 'Enlace copiado' : `Compartir ${business.name}`"
      :class="[action, copied ? 'text-ink' : 'text-muted']"
      @click="share"
    >
      <Icon :name="copied ? 'material-symbols:check' : 'material-symbols:forward-outline'" size="20" aria-hidden="true" />
    </button>

    <button
      v-if="recommenders.length"
      type="button"
      :aria-label="`Ver quiénes recomiendan a ${business.name}`"
      class="-mr-xxs ml-auto flex shrink-0 -space-x-1.5 rounded-pill p-xxs transition-colors hover:bg-surface-elevated"
      @click="listOpen = true"
    >
      <SocialAvatar v-for="person in recommenders.slice(0, 3)" :key="person.name" :name="person.name" size="xs" class="ring-2 ring-surface-card" />
    </button>

    <BusinessRecommendersSheet v-if="recommenders.length" v-model:open="listOpen" :business="business" />
  </footer>
</template>
