<script setup lang="ts">
/**
 * Panel modal: hoja inferior en móvil, ventana centrada desde `sm`.
 *
 * Usa `<dialog>` nativo con `showModal()`: el navegador atrapa el foco, cierra con
 * Escape, lo pinta por encima de todo y devuelve el foco al cerrar.
 */
defineProps<{ title: string }>()

const open = defineModel<boolean>('open', { default: false })

const dialog = ref<HTMLDialogElement>()

function sync(value: boolean) {
  const el = dialog.value
  if (!el) return
  if (value && !el.open) el.showModal()
  if (!value && el.open) el.close()
  // Evita que la página de fondo haga scroll mientras el panel está abierto
  document.documentElement.style.overflow = value ? 'hidden' : ''
}

watch(open, sync)
onMounted(() => sync(open.value))
onBeforeUnmount(() => (document.documentElement.style.overflow = ''))

/** Clic en el fondo (fuera del contenido) cierra el panel. */
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) open.value = false
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-0 mt-auto max-h-[90dvh] w-full max-w-none overflow-hidden rounded-t-card bg-surface-card p-0 text-body backdrop:bg-canvas/75 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-form sm:rounded-card"
    :aria-label="title"
    @close="open = false"
    @click="onClick"
  >
    <div class="flex max-h-[90dvh] flex-col">
      <header class="flex shrink-0 items-center gap-sm border-b border-hairline-strong px-md py-sm">
        <h2 class="min-w-0 flex-1 truncate text-title-sm font-medium normal-case tracking-normal text-ink">{{ title }}</h2>
        <BIconButton label="Cerrar" @click="open = false">
          <Icon name="material-symbols:close" size="22" />
        </BIconButton>
      </header>
      <div class="min-h-0 flex-1 overflow-y-auto p-md">
        <slot />
      </div>
    </div>
  </dialog>
</template>
