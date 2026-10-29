<script setup lang="ts">
/**
 * Texto de una publicación del negocio, como el cuerpo de un post de Facebook: Inter (letra de
 * lectura) de 15 a 16px según la pantalla, interlineado amplio y gris claro para no cansar la vista;
 * "Ver más" solo si de verdad pasa de 4 líneas, y "Ver menos" ya desplegado; tocar el texto hace lo mismo.
 * Se usa en el feed y en la vista del post en lista (`PostPhotoList`).
 */
interface PostTextProps {
  text: string
}

defineProps<PostTextProps>()

const paragraph = ref<HTMLParagraphElement>()
/** Se mide en el navegador: si el corte a 4 líneas esconde algo, aparece "Ver más". */
const { expanded, clipped, toggle } = useClampedText(paragraph, { remeasureOnResize: true })
</script>

<template>
  <div class="px-md pb-sm">
    <p
      ref="paragraph"
      class="font-reading text-reading leading-[1.5] whitespace-pre-line text-body"
      :class="{ 'line-clamp-4': !expanded, 'cursor-pointer': clipped }"
      @click="toggle"
    >{{ text }}</p>
    <button
      v-if="clipped"
      type="button"
      class="font-reading text-reading font-semibold text-muted hover:underline"
      @click="toggle"
    >
      {{ expanded ? 'Ver menos' : 'Ver más' }}
    </button>
  </div>
</template>
