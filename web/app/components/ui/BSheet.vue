<script setup lang="ts">
/**
 * Panel modal: hoja inferior en móvil, ventana centrada desde `sm`.
 *
 * Usa `<dialog>` nativo con `showModal()`: el navegador atrapa el foco, cierra con
 * Escape, lo pinta por encima de todo y devuelve el foco al cerrar.
 * `quote`: título en Lora cursiva (la voz con la que la app le habla al vecino, p. ej. "Apartar cita").
 */
interface BSheetProps {
  title: string
  subtitle?: string
  quote?: boolean
}

const props = defineProps<BSheetProps>()
const open = defineModel<boolean>('open', { default: false })

// También evita que la página de fondo haga scroll mientras el panel está abierto
const dialog = useModalDialog(() => open.value)

const titleClass = computed(() => {
  if (props.quote) return 'font-quote text-heading leading-[1.3] font-medium italic'
  return 'text-section leading-[1.3] font-semibold'
})

function close() {
  open.value = false
}

/** Clic en el fondo (fuera del contenido) cierra el panel. */
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-0 mt-auto max-h-[90dvh] w-full max-w-none overflow-hidden rounded-t-card bg-surface-card p-0 text-body backdrop:bg-canvas/75 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-form sm:rounded-card"
    :aria-label="title"
    @close="close"
    @click="onClick"
  >
    <div class="flex max-h-[90dvh] flex-col">
      <header class="flex shrink-0 items-center gap-sm border-b border-hairline-strong px-md py-sm">
        <!-- Título y subtítulo en la fuente del sistema (o el título en Lora cursiva con `quote`) -->
        <div class="min-w-0 flex-1">
          <h2 class="truncate tracking-normal text-ink normal-case" :class="titleClass">
            {{ title }}
          </h2>
          <p v-if="subtitle" class="truncate text-support leading-[1.4] text-body">{{ subtitle }}</p>
        </div>
        <BIconButton label="Cerrar" @click="close">
          <Icon name="material-symbols:close" size="22" />
        </BIconButton>
      </header>
      <div class="min-h-0 flex-1 overflow-y-auto p-md">
        <slot />
      </div>
    </div>
  </dialog>
</template>
