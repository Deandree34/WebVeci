<script setup lang="ts">
import type { OtpSent } from '~/api/types'

/**
 * Acceso a VECI con el celular, sin contraseña. Entrar y crear cuenta son el mismo flujo:
 *   1. celular → 2. código de 6 dígitos → (solo cuentas nuevas) 3. nombre y colonia.
 * Encabezado a la izquierda: rótulo mono con el paso y un titular grande en dos líneas.
 * Al terminar vuelve a `?redirect=` (solo rutas internas) o al inicio.
 */
type Step = 'phone' | 'code' | 'profile'

interface StepCopy {
  caption: string
  title: [string, string]
}

const COPY: Record<Step, StepCopy> = {
  phone: { caption: 'Acceso', title: ['Entra a', 'tu colonia'] },
  code: { caption: 'Verificación', title: ['Revisa tu', 'celular'] },
  profile: { caption: 'Cuenta nueva', title: ['Cuéntanos', 'quién eres'] }
}

const step = ref<Step>('phone')
const phone = ref('')
const sent = ref<OtpSent>({ channel: 'whatsapp', resendIn: 30 })

const copy = computed(() => COPY[step.value])

function onSent(number: string, result: OtpSent) {
  phone.value = number
  sent.value = result
  step.value = 'code'
}

function onVerified(isNew: boolean) {
  if (isNew) {
    step.value = 'profile'
    return
  }
  finish()
}

/** Solo rutas internas: `?redirect=https://otro-sitio` o `//otro-sitio` no salen de VECI. */
const route = useRoute()
const redirectTo = computed(() => {
  const target = route.query.redirect
  if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')) return target
  return '/'
})

function finish() {
  navigateTo(redirectTo.value, { replace: true })
}
</script>

<template>
  <section class="w-full max-w-form px-md sm:px-xl" aria-labelledby="auth-title">
    <header class="mb-xl sm:mb-xxl">
      <BWordmark size="md" class="mb-lg" />
      <p class="mb-xs text-caption font-bold tracking-[0.08em] text-muted uppercase">VECI · {{ copy.caption }}</p>
      <!-- La voz de la app (Lora cursiva), como los títulos de página; fluido de celular a escritorio -->
      <h1 id="auth-title" class="font-quote text-hero leading-[1.1] font-medium tracking-normal text-ink normal-case italic">
        {{ copy.title[0] }}<br>{{ copy.title[1] }}
      </h1>
    </header>

    <Transition
      mode="out-in"
      enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
      leave-to-class="opacity-0"
    >
      <AuthPhoneStep v-if="step === 'phone'" :initial-phone="phone" @sent="onSent" />
      <AuthCodeStep v-else-if="step === 'code'" :phone="phone" :sent="sent" @verified="onVerified" @back="step = 'phone'" />
      <AuthProfileStep v-else @done="finish" />
    </Transition>

    <footer class="mt-xl flex justify-between gap-md text-support font-medium">
      <NuxtLink to="/" class="text-muted transition-colors hover:text-ink">Explorar sin cuenta</NuxtLink>
      <!-- TODO: la página /terminos aún no existe (igual que en SocialLegal) -->
      <NuxtLink to="/terminos" class="text-muted transition-colors hover:text-ink">Términos</NuxtLink>
    </footer>
  </section>
</template>
