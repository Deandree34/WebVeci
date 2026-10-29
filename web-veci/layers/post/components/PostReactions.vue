<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * Pie del post en una sola fila, como el de Facebook: a la izquierda Recomendar (con el total)
 * y Compartir, ícono gris + número; a la derecha la pila de quienes lo recomiendan (abre la lista).
 * Recomendar no es un "me gusta" ni la calificación: suma al "N vecinos lo recomiendan".
 * Neutros salvo lo tuyo: si ya lo recomendaste, el ícono relleno y el número van en ocre.
 */
interface PostReactionsProps {
  business: Business
}

const props = defineProps<PostReactionsProps>()

const { isRecommended, total, toggleRecommend, copied, share } = useBusinessSocial(() => props.business)
const recommenders = computed(() => props.business.recommendedBy ?? [])
/** Caras de los primeros vecinos que lo recomiendan. */
const faces = computed(() => recommenders.value.slice(0, 3))
const listOpen = ref(false)

function openList() {
  listOpen.value = true
}
</script>

<template>
  <footer class="flex items-center gap-lg px-md py-xs">
    <PostActionButton
      :icon="isRecommended ? 'material-symbols:handshake' : 'material-symbols:handshake-outline'"
      :label="isRecommended ? `Ya no recomendar a ${business.name}` : `Recomendar a ${business.name}`"
      :count="total"
      :tone="isRecommended ? 'brand' : 'muted'"
      :aria-pressed="isRecommended"
      @click="toggleRecommend"
    />

    <PostActionButton
      :icon="copied ? 'material-symbols:check' : 'material-symbols:forward-outline'"
      :label="copied ? 'Enlace copiado' : `Compartir ${business.name}`"
      :tone="copied ? 'ink' : 'muted'"
      @click="share"
    />

    <button
      v-if="recommenders.length"
      type="button"
      :aria-label="`Ver quiénes recomiendan a ${business.name}`"
      class="-mr-xxs ml-auto flex shrink-0 -space-x-1.5 rounded-pill p-xxs transition-colors hover:bg-surface-elevated"
      @click="openList"
    >
      <SocialAvatar v-for="person in faces" :key="person.name" :name="person.name" size="xs" class="ring-2 ring-surface-card" />
    </button>

    <BusinessRecommendersSheet v-if="recommenders.length" v-model:open="listOpen" :business="business" />
  </footer>
</template>
