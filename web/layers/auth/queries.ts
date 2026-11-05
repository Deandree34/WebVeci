import { useMutation } from '@tanstack/vue-query'

import { authApi } from './api'
import type { NewProfile, OtpChannel } from '~/api/types'

/** Pide el código de acceso (o uno nuevo). */
export function useSendCode() {
  return useMutation({
    mutationFn: ({ phone, channel }: { phone: string, channel: OtpChannel }) => authApi.sendCode(phone, channel)
  })
}

/** Verifica el código escrito por el vecino. */
export function useVerifyCode() {
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string, code: string }) => authApi.verifyCode(phone, code)
  })
}

/** Guarda el nombre y la colonia de una cuenta nueva. */
export function useCompleteProfile() {
  return useMutation({
    mutationFn: (profile: NewProfile) => authApi.completeProfile(profile)
  })
}
