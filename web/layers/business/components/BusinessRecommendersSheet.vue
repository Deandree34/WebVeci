<script setup lang="ts">
import type { Business } from '~/api/types'
import { useCurrentUser } from '#layers/people/queries'

/** Quiénes recomiendan al negocio (solo nombre de pila y calle), con "Tú" primero si lo recomiendas. */
interface BusinessRecommendersSheetProps {
  business: Business
}

const props = defineProps<BusinessRecommendersSheetProps>()
const open = defineModel<boolean>('open', { default: false })

const { isRecommended, total } = useBusinessSocial(() => props.business)
const { data: me } = useCurrentUser()
const recommenders = computed(() => props.business.recommendedBy ?? [])

/** Los que no aparecen con nombre en la lista. */
const others = computed(() => {
  const mine = isRecommended.value ? 1 : 0
  return total.value - recommenders.value.length - mine
})
</script>

<template>
  <BSheet v-model:open="open" :title="`Lo recomiendan ${total} vecinos`">
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
</template>
