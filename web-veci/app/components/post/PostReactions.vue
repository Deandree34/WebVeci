<script setup lang="ts">
import type { Business } from '~/api/types'
import { businessPath } from '~/features/navigation/nav'
import { useCurrentUser } from '~/features/people/queries'
import { useRecommendedStore } from '~/stores/recommended'

/**
 * Pie social del post: Recomendar (al negocio, con quiénes lo recomiendan) · Compartir · Guardar.
 * Recomendar no es un "me gusta" ni la calificación: suma al "N vecinos lo recomiendan".
 */
const props = defineProps<{ business: Business }>()

const recommended = useRecommendedStore()
const isRecommended = computed(() => recommended.isRecommended(props.business.id))
const total = computed(() => props.business.recommendations + (isRecommended.value ? 1 : 0))

const { data: me } = useCurrentUser()
const recommenders = computed(() => props.business.recommendedBy ?? [])
/** Los que no aparecen con nombre en la lista del modal. */
const others = computed(() => total.value - recommenders.value.length - (isRecommended.value ? 1 : 0))
const listOpen = ref(false)

const copied = ref(false)
async function share() {
  const url = new URL(businessPath(props.business.slug), window.location.origin).href
  if (navigator.share) {
    // Cancelar el menú nativo lanza AbortError: no es un error para el vecino
    await navigator.share({ title: props.business.name, url }).catch(() => {})
    return
  }
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <footer class="mx-md flex items-center gap-sm py-sm">
    <button
      type="button"
      :aria-pressed="isRecommended"
      :aria-label="isRecommended ? `Ya no recomendar a ${business.name}` : `Recomendar a ${business.name}`"
      class="inline-flex shrink-0 items-center gap-xxs rounded-pill px-sm py-xxs text-body-sm font-medium transition-colors hover:bg-surface-elevated"
      :class="isRecommended ? 'text-veci-purple-text' : 'text-muted'"
      @click="recommended.toggle(business.id)"
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

    <BSheet v-if="recommenders.length" v-model:open="listOpen" :title="`Lo recomiendan ${total} vecinos`">
      <ul class="flex flex-col gap-sm">
        <li v-if="isRecommended && me" class="flex items-center gap-sm">
          <SocialAvatar :name="me.name" />
          <div class="min-w-0">
            <p class="truncate text-body-sm font-medium text-ink">Tú · {{ me.name }}</p>
            <p class="text-body-xs text-muted">Recomendaste a {{ business.name }}</p>
          </div>
        </li>
        <li v-for="person in recommenders" :key="person.name" class="flex items-center gap-sm">
          <SocialAvatar :name="person.name" />
          <div class="min-w-0">
            <p class="truncate text-body-sm font-medium text-ink">{{ person.name }}</p>
            <p class="text-body-xs text-muted">{{ person.street }}</p>
          </div>
        </li>
      </ul>
      <p v-if="others > 0" class="mt-md text-body-xs text-muted">y {{ others }} vecinos más lo recomiendan</p>
    </BSheet>
  </footer>
</template>
