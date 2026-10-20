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
        <!-- Disponible: ícono y nombre en blanco (sin violeta); próximamente: gris con nota en cursiva -->
        <NuxtLink
          v-if="category.available"
          :to="categoryPath(category.slug)"
          class="flex h-full flex-col gap-sm rounded-card bg-surface-card p-md transition-colors hover:bg-surface-elevated"
        >
          <Icon :name="category.icon" size="28" class="text-ink" aria-hidden="true" />
          <span class="text-copy leading-[1.3] font-semibold text-ink">{{ category.label }}</span>
        </NuxtLink>
        <div v-else class="flex h-full flex-col gap-sm rounded-card border border-hairline p-md text-muted-soft">
          <Icon :name="category.icon" size="28" aria-hidden="true" />
          <span class="text-copy leading-[1.3]">{{ category.label }}</span>
          <span class="font-quote text-label font-medium italic">Próximamente</span>
        </div>
      </li>
    </ul>
  </div>
</template>
