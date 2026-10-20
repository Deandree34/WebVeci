<script setup lang="ts">
import type { Business } from '~/api/types'

/**
 * Pie social del post: Recomendar (al negocio, con quiénes lo recomiendan) · Compartir · Guardar.
 * Recomendar no es un "me gusta" ni la calificación: suma al "N vecinos lo recomiendan".
 */
const props = defineProps<{ business: Business }>()

const { isRecommended, total, toggleRecommend, copied, share } = useBusinessSocial(() => props.business)
const recommenders = computed(() => props.business.recommendedBy ?? [])
const listOpen = ref(false)
</script>

<template>
  <footer class="mx-md flex items-center gap-sm py-sm">
    <button
      type="button"
      :aria-pressed="isRecommended"
      :aria-label="isRecommended ? `Ya no recomendar a ${business.name}` : `Recomendar a ${business.name}`"
      class="inline-flex shrink-0 items-center gap-xxs rounded-pill px-sm py-xxs text-body-sm font-medium transition-colors hover:bg-surface-elevated"
      :class="isRecommended ? 'text-veci-purple-text' : 'text-muted'"
      @click="toggleRecommend"
    >
      <Icon :name="isRecommended ? 'material-symbols:handshake' : 'material-symbols:handshake-outline'" size="22" aria-hidden="true" />
      <span class="tabular-nums">{{ total }}</span>
    </button>

    <button
      v-if="recommenders.length"
      type="button"
      :aria-label="`Ver quiénes recomiendan a ${business.name}`"
      class="flex shrink-0 -space-x-1.5 rounded-pill p-xxs transition-colors hover:bg-surface-elevated"
      @click="listOpen = true"
    >
      <SocialAvatar v-for="person in recommenders.slice(0, 3)" :key="person.name" :name="person.name" size="xs" class="ring-2 ring-surface-card" />
    </button>

    <div class="ml-auto flex shrink-0 items-center">
      <BIconButton :label="copied ? 'Enlace copiado' : `Compartir ${business.name}`" @click="share">
        <Icon :name="copied ? 'material-symbols:check' : 'material-symbols:share-outline'" size="22" :class="copied ? 'text-success' : 'text-muted'" />
      </BIconButton>
      <BusinessSaveButton :business-id="business.id" :business-name="business.name" />
    </div>

    <BusinessRecommendersSheet v-if="recommenders.length" v-model:open="listOpen" :business="business" />
  </footer>
</template>
