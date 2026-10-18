<script setup lang="ts">
import { useCurrentUser } from '~/features/people/queries'

const search = ref('')
const { data: me } = useCurrentUser()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur">
    <div class="mx-auto flex h-14 w-full max-w-app items-center gap-md px-md">
      <BWordmark to="/" />

      <!-- La búsqueda por intención llega más adelante; por ahora es visual -->
      <form class="hidden min-w-0 flex-1 sm:block" role="search" @submit.prevent>
        <div class="mx-auto max-w-[480px]">
          <SocialSearch v-model="search" placeholder="¿Qué necesitas hoy, vecino?" />
        </div>
      </form>

      <div class="ml-auto flex items-center gap-xs">
        <BIconButton class="sm:hidden" label="Buscar">
          <Icon name="material-symbols:search" size="22" />
        </BIconButton>

        <button
          type="button"
          class="inline-flex h-10 items-center gap-xxs rounded-pill border border-hairline-strong px-sm text-body-sm font-medium text-on-dark transition-colors hover:bg-surface-elevated"
          title="Cambiar colonia"
        >
          <span class="size-2 rounded-full bg-success" aria-hidden="true" />
          <span class="hidden sm:inline">Col. Centro</span>
          <Icon name="material-symbols:expand-more" size="18" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="hidden h-10 items-center gap-xxs rounded-control px-sm text-body-sm font-medium text-link transition-colors hover:bg-surface-elevated lg:inline-flex"
        >
          <Icon name="material-symbols:add-business" size="20" aria-hidden="true" />
          Ofrezco un servicio
        </button>

        <button type="button" aria-label="Tu perfil" class="transition-opacity hover:opacity-80">
          <SocialAvatar :name="me?.name ?? '?'" size="sm" />
        </button>
      </div>
    </div>
  </header>
</template>
