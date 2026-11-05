import { mockVerifyCode } from '../../../../mock/auth'
import type { OtpVerification } from '../../../../../app/api/types'

/** POST /auth/otp/verify — verifica el código; errores `otp_invalid` / `otp_expired` / `otp_locked`. */
export default defineMockHandler(500, async (event): Promise<OtpVerification> => {
  const { phone, code } = await readBody<{ phone?: string, code?: string } | undefined>(event) ?? {}
  const fields: Record<string, string> = {}
  if (!phone) fields.phone = 'Falta el celular'
  if (!code || !/^\d{6}$/.test(code)) fields.code = 'Deben ser 6 dígitos'
  if (Object.keys(fields).length) validationError(fields)
  return mockVerifyCode(phone!, code!)
})
