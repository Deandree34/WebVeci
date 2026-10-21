<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * Adjunto de un post: caja con borde fino y dos niveles de texto, para entenderse a la primera:
 * el mensaje principal y una línea de apoyo corta que lo completa (partes unidas por "·"). Ambos
 * en Plus Jakarta Sans (titular en negrita, apoyo en medium), botón de contorno a la derecha.
 * `rating`: estrellas junto al mensaje. El botón es un enlace (`to`) o abre una ventana sin salir
 * del feed (`@action`); sin ninguno de los dos no hay botón (p. ej. en el perfil del propio negocio).
 * El apoyo no se corta con "…": si no cabe (celular), baja de renglón entre partes, nunca a mitad de una
 * ("Martes y miércoles ·" / "hasta el domingo"); el "·" se queda al final del renglón de arriba.
 */
defineProps<{
  title: string
  support?: string[]
  rating?: number
  to?: RouteLocationRaw
  action?: string
  /** `@action`: el botón abre algo en la misma página en vez de navegar. */
  onAction?: () => void
}>()

const button = 'inline-flex h-9 shrink-0 items-center rounded-pill border border-hairline-strong px-md text-body-sm font-medium text-body-strong transition-colors hover:bg-surface-elevated'
</script>

<template>
  <div class="mx-md mb-sm flex items-center gap-md rounded-control border border-hairline p-md">
    <div class="min-w-0 flex-1">
      <p class="flex items-center gap-xs">
        <span class="line-clamp-2 font-headline text-heading leading-[1.2] font-bold tracking-[-0.01em] text-ink">{{ title }}</span>
        <PostStars v-if="rating !== undefined" :value="rating" :size="18" />
      </p>
      <p v-if="support?.length" class="mt-xxs font-headline text-label leading-[1.4] font-medium text-body [word-spacing:0.08em]">
        <template v-for="(part, i) in support" :key="part">
          <span class="inline-block max-w-full">{{ part }}<span v-if="i < support.length - 1" class="ml-1 text-muted" aria-hidden="true">·</span></span>{{ ' ' }}
        </template>
      </p>
    </div>

    <NuxtLink v-if="to && action" :to="to" :class="button">{{ action }}</NuxtLink>
    <button v-else-if="onAction && action" type="button" :class="button" @click="onAction">{{ action }}</button>
  </div>
</template>
