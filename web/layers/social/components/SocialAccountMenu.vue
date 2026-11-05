<script setup lang="ts">
import { useCurrentUser } from '#layers/people/queries'

/**
 * Cuenta del vecino en el encabezado: su avatar con una flecha pequeña abajo (como Facebook) que
 * despliega las opciones básicas: editar perfil, configuración, ayuda y cerrar sesión.
 * Por ahora las opciones son visuales: no hay inicio de sesión ni páginas de cuenta todavía.
 */

const { data: me } = useCurrentUser()
const colony = useColony()

const avatarName = computed(() => me.value?.name ?? '?')
const accountLabel = computed(() => `Tu cuenta (${me.value?.name ?? ''})`)
</script>

<template>
  <BPopover width="w-[min(320px,calc(100vw-32px))]">
    <template #trigger="{ toggle, open }">
      <button
        type="button"
        :aria-label="accountLabel"
        aria-haspopup="menu"
        :aria-expanded="open"
        class="relative shrink-0 rounded-full transition-opacity hover:opacity-80"
        @click="toggle"
      >
        <SocialAvatar :name="avatarName" size="md" />
        <!-- Flecha abajo, en un círculo pequeño sobre la esquina del avatar -->
        <span class="absolute -right-0.5 -bottom-0.5 inline-flex size-4 items-center justify-center rounded-full bg-surface-elevated text-ink ring-2 ring-canvas transition-transform" :class="{ 'rotate-180': open }" aria-hidden="true">
          <Icon name="material-symbols:expand-more" size="14" />
        </span>
      </button>
    </template>

    <!-- Quién eres: avatar, nombre y colonia -->
    <div class="flex items-center gap-sm px-sm py-xs">
      <SocialAvatar :name="avatarName" size="md" />
      <div class="min-w-0">
        <p class="truncate text-copy leading-[1.3] font-semibold text-ink">{{ me?.name }}</p>
        <p class="text-support leading-[1.4] text-body">{{ colony }}</p>
      </div>
    </div>
    <hr class="my-xs border-hairline">

    <BMenuItem icon="material-symbols:person-edit-outline" label="Editar perfil" support="Tu nombre, foto y calle" />
    <BMenuItem icon="material-symbols:settings-outline" label="Configuración" support="Notificaciones, colonia y privacidad" />
    <BMenuItem icon="material-symbols:help-outline" label="Ayuda" support="Preguntas frecuentes y contacto con VECI" />
    <hr class="my-xs border-hairline">
    <BMenuItem icon="material-symbols:logout" label="Cerrar sesión" to="/entrar" />
  </BPopover>
</template>
