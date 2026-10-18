# web-veci — Frontend

Frontend de VECI — **Nuxt 4** (Vue 3 + Tailwind v4). Capa de **presentación**:
consume la API del backend (FastAPI, **proyecto aparte**) y no contiene reglas de negocio.

> Arquitectura de referencia: [docs/architecture.md](docs/architecture.md)
> Modelo de negocio: [docs/business-model.md](docs/business-model.md)

## Desarrollo

```bash
npm install      # instala dependencias
npm run dev      # http://localhost:3001
```

Configura la URL del backend con `NUXT_PUBLIC_API_BASE_URL` (ver `.env.example`).

Otros scripts: `npm run build`, `npm run generate`, `npm run preview`.

## Estructura

```
web-veci/
├─ app/
│  ├─ api/                # capa de red (client.ts + endpoints tipados)
│  ├─ components/
│  │  ├─ ui/              # design system (BButton, BCard, BTag…) -> <BButton>
│  │  └─ <dominio>/       # componentes de dominio -> <FeedPostCard>
│  ├─ features/<dominio>/ # lógica de dominio (composables/, queries.ts, types.ts)
│  ├─ composables/  stores/  middleware/  plugins/
│  ├─ layouts/  pages/  utils/
│  ├─ assets/  public/
│  └─ app.vue
├─ server/                # BFF opcional (Nitro)
├─ docs/                  # design/ + architecture.md
└─ nuxt.config.ts
```

## Convenciones

- Design system en `app/components/ui` (prefijo `B*`), sin lógica de negocio.
- Tipografía **Roboto** / **Roboto Mono**; iconos **Material Symbols** (`<Icon name="material-symbols:*" />`).
- Estado de **servidor** → TanStack Query; estado de **cliente** → Pinia.
- Los componentes **no** llaman a `$fetch`: todo pasa por `app/api` + `features/*/queries.ts`.
- Cada dominio expone sus `queryOptions` reutilizables (componentes + `prefetchQuery` en SSR).

## Estado actual

La capa de datos usa **datos dummy** (`app/api/mock/`) con latencia simulada, para
desarrollar la UI antes de que exista el backend. Se avanza **una categoría a la vez**
(ver [docs/business-model.md](docs/business-model.md)); hoy solo está activa
**Belleza y cuidado personal** (Barbería El Güero y Estética Bella Luz).

Todas las rutas usan el layout `social`:

| Ruta | Qué es |
|---|---|
| `/` | Inicio: historias y feed de la colonia |
| `/explorar` | Catálogo de categorías (las no disponibles, como "Próximamente") |
| `/categoria/[slug]` | Negocios de una categoría, con filtro *Abierto ahora* |
| `/negocio/[slug]` | Detalle del negocio: oferta, horarios libres, servicios, reseña y **apartar cita** (`?dia=today&hora=17:30` abre el panel con el horario elegido) |
| `/mis-cosas` | Citas del vecino (Pinia, en memoria) |
| `/guardados` | Negocios guardados (Pinia, en memoria) |

`/home` redirige a `/` (ruta antigua). La búsqueda, el selector de colonia y
"Ofrezco un servicio" son **placeholder visual** por ahora.

El layout `social` **precarga sus datos en SSR** (historias, categorías y negocios)
usando las `queryOptions` de cada dominio, y las páginas con datos propios usan
`onServerPrefetch(suspense)`; así el HTML inicial ya llega con contenido. Todo lo que
depende de la hora (abierto/cerrado) usa `useNow()` y la zona horaria de la colonia,
para que servidor y cliente rendericen lo mismo.
