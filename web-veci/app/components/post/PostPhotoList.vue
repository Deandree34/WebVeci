<script setup lang="ts">
import type { PostItem } from '~/api/types'

/**
 * Vista propia de una publicación con varias fotos (celular), como la de Facebook: cabecera del
 * negocio, el texto (cortado a 4 líneas, como en el feed), el pie del post y todas las fotos una
 * debajo de otra, a todo lo ancho y sin recortar; cada foto con su texto (si tiene) y su propio pie.
 * Tocar una foto abre el visor en esa foto, encima de esta vista; al cerrarlo vuelves aquí.
 * Se cierra con la flecha, con Escape, con el botón "atrás" del teléfono o al cambiar de página.
 */
const props = defineProps<{ post: PostItem }>()
const open = defineModel<boolean>('open', { default: false })

const dialog = ref<HTMLDialogElement>()
/** Foto abierta en el visor (`null` = cerrado). */
const viewing = ref<number | null>(null)

watch(open, (value) => {
  const el = dialog.value
  if (!el) return
  if (value && !el.open) {
    el.showModal()
    el.scrollTop = 0
  }
  if (!value && el.open) el.close()
  document.documentElement.style.overflow = value ? 'hidden' : ''
})
onBeforeUnmount(() => (document.documentElement.style.overflow = ''))

const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))
useBackToClose(() => open.value, () => (open.value = false))
</script>

<template>
  <dialog
    ref="dialog"
    class="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-canvas p-0 text-on-dark backdrop:bg-canvas"
    :aria-label="`Publicación de ${props.post.business.name}`"
    @close="open = false"
  >
    <template v-if="open">
      <!-- Barra fija: volver y de quién es la publicación -->
      <header class="sticky top-0 z-10 flex h-14 items-center gap-xs border-b border-hairline bg-canvas/95 px-xs backdrop-blur">
        <span class="inline-flex shrink-0">
          <BIconButton label="Volver" @click="open = false">
            <Icon name="material-symbols:arrow-back-rounded" size="24" class="text-ink" />
          </BIconButton>
        </span>
        <p class="truncate text-copy font-semibold text-ink">Publicación de {{ post.business.name }}</p>
      </header>

      <PostHeader :item="post" look="social" />

      <!-- El texto como en el feed: cortado a 4 líneas, "Ver más" o tocarlo lo despliega -->
      <PostText v-if="post.text" :text="post.text" />

      <!-- El pie del post (recomendar al negocio) va arriba, antes de las fotos, como en Facebook -->
      <PostReactions :business="post.business" class="border-b border-hairline" />

      <!-- Todas las fotos, una debajo de otra y en su proporción; cada una con su texto (si tiene)
           y su propio pie: su reacción (apretón de manos, contador propio) y compartirla -->
      <div class="flex flex-col gap-xs bg-hairline">
        <section v-for="(photo, index) in post.photos" :key="photo.id" class="bg-canvas">
          <button
            type="button"
            class="block w-full bg-surface-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
            :aria-label="`Ver foto ${index + 1} de ${post.photos.length}: ${photo.alt}`"
            @click="viewing = index"
          >
            <img :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async" class="block h-auto w-full">
          </button>
          <PostText v-if="photo.caption" :text="photo.caption" class="pt-sm" />
          <PostPhotoReactions :photo="photo" :business="post.business" />
        </section>
      </div>
    </template>

    <PostPhotoViewer v-model:index="viewing" :post="post" />
  </dialog>
</template>
