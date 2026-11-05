import { mockSendCode } from '../../../../mock/auth'
import type { OtpChannel, OtpSent } from '../../../../../app/api/types'

/**
 * POST /auth/otp — manda el código al celular (10 dígitos, sin +52).
 * Responde igual exista o no la cuenta (nadie puede averiguar qué números están registrados).
 */
export default defineMockHandler(600, async (event): Promise<OtpSent> => {
  const { phone, channel } = await readBody<{ phone?: string, channel?: OtpChannel } | undefined>(event) ?? {}
  const fields: Record<string, string> = {}
  if (!phone || !/^\d{10}$/.test(phone)) fields.phone = 'Deben ser 10 dígitos'
  if (channel !== 'whatsapp' && channel !== 'sms') fields.channel = 'Debe ser whatsapp o sms'
  if (Object.keys(fields).length) validationError(fields)
  return mockSendCode(phone!, channel!)
})
