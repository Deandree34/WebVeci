<script setup lang="ts">
import type { PostItem } from '~/api/types'

/**
 * Fotos de una publicación, a todo lo ancho y sin borde, repartidas como en Facebook:
 *   1 → 4:3 · 2 → dos cuadradas · 3 o más → una alta y dos apiladas; si hay más de 3,
 *   la tercera lleva "+N" con las que faltan.
 * Al tocar una, como Facebook: en celular, si hay varias, se abre la vista del post con todas en
 * lista (`PostPhotoList`); con una sola foto, o en tablet y computadora, el visor directo en esa foto.
 */
const MAX_SHOWN = 3

const props = defineProps<{ post: PostItem }>()
const photos = computed(() => props.post.photos)

const shown = computed(() => photos.value.slice(0, MAX_SHOWN))
const extra = computed(() => photos.value.length - shown.value.length)
const layout = computed(() => {
  const count = shown.value.length
  if (count === 1) return 'aspect-[4/3]'
  if (count === 2) return 'aspect-[2/1] grid-cols-2'
  return 'aspect-square grid-cols-2 grid-rows-2'
})

/** Foto abierta en el visor (`null` = cerrado) y vista del post en lista (solo celular). */
const open = ref<number | null>(null)
const listOpen = ref(false)

function select(index: number) {
  if (photos.value.length > 1 && window.matchMedia('(max-width: 767px)').matches) listOpen.value = true
  else open.value = index
}
</script>

<template>
  <div class="grid gap-0.5" :class="layout">
    <button
      v-for="(photo, index) in shown"
      :key="photo.src"
      type="button"
      class="relative min-h-0 cursor-zoom-in overflow-hidden bg-surface-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
      :class="{ 'row-span-2': shown.length === 3 && index === 0 }"
      :aria-label="extra > 0 && index === shown.length - 1 ? `Ver ${extra} fotos más` : `Ver foto: ${photo.alt}`"
      @click="select(index)"
    >
      <img :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async" class="size-full object-cover transition-opacity hover:opacity-90">
      <!-- Más de 3: la última visible lleva cuántas faltan (cifra en Plus Jakarta) -->
      <span
        v-if="extra > 0 && index === shown.length - 1"
        class="absolute inset-0 flex items-center justify-center bg-canvas/60 font-headline text-page-title font-bold text-on-photo"
        aria-hidden="true"
      >
        +{{ extra }}
      </span>
    </button>
  </div>

  <PostPhotoList v-if="photos.length > 1" v-model:open="listOpen" :post="post" />
  <PostPhotoViewer v-model:index="open" :post="post" />
</template>
