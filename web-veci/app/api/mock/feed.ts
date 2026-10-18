/**
 * Feed de la colonia: publicaciones tipadas de los negocios + las de VECI.
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend.
 * El orden por relevancia (`score`) simula lo que calculará el backend.
 */

import type { Business, FeedItem } from '../types'
import { availabilitySummary, colonyHour, isOpenAt, promoWindow } from '../../utils/hours'
import { findBusiness } from './businesses'

const MINUTE = 60_000

/** Publicación base: `ago` en minutos respecto a "ahora". */
interface Seed {
  id: string
  type: FeedItem['type']
  businessId: string
  ago: number
  tab?: FeedItem['tab']
}

// `horarios` = aviso de citas disponibles: el post no guarda horas (se ocupan a cada rato);
// franja y nivel se calculan al momento y las horas exactas se ven al apartar en el negocio.
const seeds: Seed[] = [
  { id: 'f1', type: 'oferta', businessId: 'guero', ago: 60, tab: 'ofertas' },
  { id: 'f2', type: 'horarios', businessId: 'bellaluz', ago: 120, tab: 'citas' },
  { id: 'f3', type: 'horarios', businessId: 'guero', ago: 25, tab: 'citas' },
  { id: 'f4', type: 'oferta', businessId: 'bellaluz', ago: 240, tab: 'ofertas' }
]

/** Publicaciones de VECI en posiciones fijas del feed. */
const veciSeeds: (Seed & { at: number })[] = [
  { id: 'v1', type: 'resena', businessId: 'guero', ago: 60 * 24 * 2, at: 2 }
]

/** Relevancia: lo abierto y los horarios libres suben; las ofertas vencidas bajan. */
function score(item: FeedItem, now: number): number {
  const hour = colonyHour(now)
  let total = 0
  if (isOpenAt(item.business.hours, hour)) total += 20
  if (item.type === 'horarios' && item.business.availability) {
    // Sin lugar ni hoy ni mañana baja, igual que una oferta vencida
    total += availabilitySummary(item.business.availability, hour).level === 'full' ? -40 : 10
  }
  if (item.type === 'oferta' && item.business.promo) {
    total += promoWindow(item.business.promo, now).endsAt > now ? 15 : -40
  }
  return total
}

function toItem(seed: Seed, now: number): FeedItem {
  const business: Business = findBusiness(seed.businessId)!
  return {
    id: seed.id,
    type: seed.type,
    tab: seed.tab,
    business,
    publishedAt: new Date(now - seed.ago * MINUTE).toISOString()
  }
}

/** Feed completo ordenado para el instante `now`. */
export function makeMockFeed(now: number): FeedItem[] {
  const items = seeds.map((seed) => toItem(seed, now)).sort((a, z) => score(z, now) - score(a, now))
  for (const seed of veciSeeds) items.splice(Math.min(seed.at, items.length), 0, toItem(seed, now))
  return items
}
