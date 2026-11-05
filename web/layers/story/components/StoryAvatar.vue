<script setup lang="ts">
/**
 * Avatar circular de una historia: el icono del giro sobre el ocre de VECI. `size`: sm (por defecto) · md · lg.
 *
 * Comparte la forma circular de `BusinessAvatar` y `SocialAvatar`; existe aparte
 * porque el carrusel y el visor lo pintan sobre el anillo del prototipo (`veci-feed`).
 */
interface StoryAvatarProps {
  icon: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: { box: 'size-9', icon: '18' },
  // 52px: con el anillo (3px) y el borde (3px) por lado, la historia mide 64px
  md: { box: 'size-13', icon: '26' },
  lg: { box: 'size-16', icon: '30' }
}

const props = defineProps<StoryAvatarProps>()

const sizing = computed(() => SIZES[props.size ?? 'sm'])
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full bg-brand text-on-brand"
    :class="sizing.box"
    aria-hidden="true"
  >
    <Icon :name="icon" :size="sizing.icon" />
  </span>
</template>
