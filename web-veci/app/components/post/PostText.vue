<script setup lang="ts">
/**
 * Texto de una publicación del negocio, como el cuerpo de un post de Facebook: Inter (letra de
 * lectura) de 15 a 16px según la pantalla, interlineado amplio y gris claro para no cansar la vista;
 * "Ver más" solo si de verdad pasa de 4 líneas.
 */
defineProps<{ text: string }>()

const paragraph = ref<HTMLParagraphElement>()
const expanded = ref(false)
/** Se mide en el navegador: si el corte a 4 líneas esconde algo, aparece "Ver más". */
const clipped = ref(false)

function measure() {
  const el = paragraph.value
  if (el && !expanded.value) clipped.value = el.scrollHeight > el.clientHeight + 1
}
onMounted(() => {
  measure()
  window.addEventListener('resize', measure, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
</script>

<template>
  <div class="px-md pb-sm">
    <p
      ref="paragraph"
      class="font-reading text-reading leading-[1.5] whitespace-pre-line text-body"
      :class="{ 'line-clamp-4': !expanded }"
    >{{ text }}</p>
    <button
      v-if="clipped && !expanded"
      type="button"
      class="font-reading text-reading font-semibold text-muted hover:underline"
      @click="expanded = true"
    >
      Ver más
    </button>
  </div>
</template>
