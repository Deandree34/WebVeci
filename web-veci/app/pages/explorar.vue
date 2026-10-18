<script setup lang="ts">
import { useCategories } from '~/features/categories/queries'
import { categoryPath } from '~/features/navigation/nav'

definePageMeta({ layout: 'social' })
useHead({ title: 'Explorar — VECI' })

const { data: categories } = useCategories()
</script>

<template>
  <div>
    <SocialPageHeader title="Explorar" description="Los negocios de tu colonia, por giro." />

    <ul class="grid grid-cols-2 gap-sm sm:grid-cols-3">
      <li v-for="category in categories" :key="category.id">
        <NuxtLink
          v-if="category.available"
          :to="categoryPath(category.slug)"
          class="flex h-full flex-col gap-sm rounded-card bg-surface-card p-md transition-colors hover:bg-surface-elevated"
        >
          <Icon :name="category.icon" size="28" class="text-veci-purple-text" aria-hidden="true" />
          <span class="text-body-sm font-medium text-on-dark">{{ category.label }}</span>
        </NuxtLink>
        <div v-else class="flex h-full flex-col gap-sm rounded-card bg-surface-soft p-md text-muted-soft">
          <Icon :name="category.icon" size="28" aria-hidden="true" />
          <span class="text-body-sm">{{ category.label }}</span>
          <span class="text-body-xs">Próximamente</span>
        </div>
      </li>
    </ul>
  </div>
</template>
