/**
 * Catálogo de categorías (giros). Ver `docs/business-model.md` §2.
 *
 * ⚠️ TEMPORAL — este archivo desaparece cuando exista el backend.
 * Solo `belleza` está disponible en la etapa 1; el resto se muestra como "Próximamente".
 */

import type { Category } from '../../app/api/types'

export const categories: Category[] = [
  {
    id: 'belleza',
    slug: 'belleza',
    label: 'Belleza y cuidado personal',
    icon: 'material-symbols:content-cut',
    subcategories: ['Barbería', 'Estética', 'Uñas', 'Spa', 'Maquillaje'],
    capabilities: ['citas'],
    available: true
  },
  {
    id: 'salud',
    slug: 'salud',
    label: 'Salud',
    icon: 'material-symbols:medical-services',
    subcategories: ['Medicina general', 'Odontología', 'Farmacia', 'Psicología', 'Laboratorio'],
    capabilities: ['citas', 'informativo'],
    available: false
  },
  {
    id: 'comida',
    slug: 'comida',
    label: 'Comida y bebida',
    icon: 'material-symbols:restaurant',
    subcategories: ['Taquería', 'Pizzería', 'Cafetería', 'Panadería', 'Comida corrida'],
    capabilities: ['pedidos'],
    available: false
  },
  {
    id: 'ocio',
    slug: 'ocio',
    label: 'Ocio y vida nocturna',
    icon: 'material-symbols:nightlife',
    subcategories: ['Bar', 'Karaoke', 'Billar', 'Cine'],
    capabilities: ['informativo'],
    available: false
  },
  {
    id: 'hogar',
    slug: 'hogar',
    label: 'Hogar y reparaciones',
    icon: 'material-symbols:home-repair-service',
    subcategories: ['Plomería', 'Electricidad', 'Cerrajería', 'Limpieza', 'Pintura'],
    capabilities: ['solicitud'],
    available: false
  },
  {
    id: 'transporte',
    slug: 'transporte',
    label: 'Transporte y envíos',
    icon: 'material-symbols:local-shipping',
    subcategories: ['Taxi de sitio', 'Fletes y mudanzas', 'Mandados'],
    capabilities: ['cotizacion'],
    available: false
  },
  {
    id: 'deportes',
    slug: 'deportes',
    label: 'Deportes y bienestar',
    icon: 'material-symbols:fitness-center',
    subcategories: ['Gimnasio', 'Yoga', 'Box', 'Baile', 'Canchas'],
    capabilities: ['citas'],
    available: false
  },
  {
    id: 'educacion',
    slug: 'educacion',
    label: 'Educación',
    icon: 'material-symbols:school',
    subcategories: ['Regularización', 'Idiomas', 'Música', 'Guardería'],
    capabilities: ['citas'],
    available: false
  },
  {
    id: 'mascotas',
    slug: 'mascotas',
    label: 'Mascotas',
    icon: 'material-symbols:pets',
    subcategories: ['Veterinaria', 'Estética canina', 'Alimento'],
    capabilities: ['citas', 'pedidos'],
    available: false
  },
  {
    id: 'tiendas',
    slug: 'tiendas',
    label: 'Tiendas',
    icon: 'material-symbols:storefront',
    subcategories: ['Abarrotes', 'Papelería', 'Ferretería', 'Ropa'],
    capabilities: ['pedidos', 'informativo'],
    available: false
  },
  {
    id: 'profesionales',
    slug: 'profesionales',
    label: 'Servicios profesionales',
    icon: 'material-symbols:work',
    subcategories: ['Contabilidad', 'Legal', 'Impresión', 'Reparación de celulares'],
    capabilities: ['cotizacion'],
    available: false
  },
  {
    id: 'comunidad',
    slug: 'comunidad',
    label: 'Comunidad',
    icon: 'material-symbols:groups',
    subcategories: ['Avisos', 'Eventos', 'Tianguis', 'Fondo vecinal'],
    capabilities: [],
    available: false
  }
]
