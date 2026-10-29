# Arquitectura — VECI (Frontend)

> Documento vivo. Define la arquitectura del **frontend** de VECI (red social), diseñado para **escala enterprise**. El **backend FastAPI vive en un proyecto aparte**; este proyecto solo lo **consume**.

---

## 0. Resumen ejecutivo

| Ámbito | Decisión |
|---|---|
| Estilo | Proyecto **Nuxt único** (sin monorepo), backend **desacoplado** como servicio externo, **API-first** |
| Frontend | **Nuxt 4** (SSR) + Vue 3 + Tailwind v4 — **capa de presentación** |
| Backend | **FastAPI (Python)** — **proyecto aparte** (no vive aquí) |
| Contrato | REST **versionada `/v1`**, **OpenAPI** como fuente única de tipos |
| Cliente API | Tipos/hooks generados desde el OpenAPI (Orval) → `app/api/generated` |
| Estado | **Pinia** (estado de cliente) + **TanStack Query** (estado de servidor) |
| Auth | OIDC/JWT; tokens en **cookie httpOnly** mediante un **BFF** |
| Tiempo real | **Diferido**; se define una interfaz `RealtimeService` desacoplada |
| Gestor de paquetes | **npm** (proyecto Nuxt único) |

---

## 1. Visión general

VECI es una red social. El **frontend** y el **backend** son **desplegables de forma independiente** y viven en **repositorios/proyectos distintos**:

```
┌──────────────────────────────┐         HTTPS / JSON        ┌──────────────────────────────┐
│  web-veci  (este proyecto)   │  ─────────────────────────▶ │  Backend FastAPI             │
│  Nuxt 4 (SSR)                │  ◀───────────────────────── │  (proyecto aparte)           │
│  Presentación                │        REST /v1             │  Negocio + datos             │
└──────────────────────────────┘                             └──────────────┬───────────────┘
        │                                                                   │
        │ (opcional) BFF Nitro: cookies httpOnly                            ▼
        │                                                        ┌────────────────────┐
        ▼                                                        │   PostgreSQL       │
   Navegador                                                     └────────────────────┘
                                                                 ┌────────────────────┐
                                                                 │ Redis · S3/R2 · …  │
                                                                 └────────────────────┘
```

**Principios rectores**

1. **Separación de responsabilidades.** El frontend presenta; el backend decide. Ninguna regla de negocio vive en el frontend.
2. **El contrato manda.** El OpenAPI del backend es la fuente única de tipos del frontend. Si el contrato cambia, el frontend **rompe en compilación**, no en producción.
3. **Feature-first.** La organización es por **dominio** (feed, posts, auth…), no por tipo de archivo, para permitir equipos en paralelo.
4. **Estado bien tipado.** Se distingue estrictamente *estado de servidor* de *estado de cliente*.
5. **Desacoplamiento del tiempo real.** Aunque hoy no se implemente, la interfaz queda definida para no reescribir features después.

---

## 2. Stack tecnológico

### Frontend (proyecto Nuxt, `web-veci`)

| Área | Tecnología |
|---|---|
| Framework | Nuxt 4 (SSR) + Vue 3 |
| Routing | File-based de Nuxt (`app/pages`) |
| Estilos | Tailwind CSS v4 (CSS-first) + design tokens propios |
| Fuentes | **Roboto** + **Roboto Mono** (Google / Material Design) vía `@nuxt/fonts` (self-hosted) |
| Iconos | **Material Symbols** (set de Google) vía `@nuxt/icon` + Iconify local |
| Estado de servidor | **@tanstack/vue-query** |
| Estado de cliente | **Pinia** |
| Formularios | **vee-validate** + **Zod** |
| Cliente HTTP | **openapi-fetch** u hooks generados por **Orval** |
| Testing | Vitest (unit) + Playwright (e2e) |

### Backend externo (proyecto aparte — para referencia)

| Área | Tecnología |
|---|---|
| Framework | **FastAPI** (Python) |
| ORM / DB | **SQLAlchemy 2** (async) · **PostgreSQL** · **Alembic** |
| Auth | OIDC/JWT |
| Calidad | Ruff · mypy · pytest |

> El frontend **no** compila ni ejecuta nada de Python. Solo consume su API REST.

---

## 3. Estructura del proyecto

Proyecto **Nuxt único** (sin monorepo):

```
web-veci/
├─ app/
│  ├─ api/                     # infraestructura de red compartida
│  │  ├─ client.ts             # instancia base (baseURL, credenciales, cabeceras)
│  │  └─ types.ts              # tipos del dominio (hoy; luego generados del OpenAPI)
│  ├─ components/ui/           # design system (BButton, BSheet, BPopover…) -> <BButton>
│  ├─ composables/             # composables transversales (auto-importados)
│  ├─ middleware/              # guardas de ruta (auth, roles)
│  ├─ plugins/                 # registro de TanStack Query, etc. (vue-query.ts)
│  ├─ utils/                   # helpers puros (formatDate…)
│  ├─ layouts/                 # social.vue (app social) · profile.vue (perfil del negocio)
│  ├─ pages/                   # index.vue (/) · explorar · guardados · mis-cosas · categoria/[slug] · negocio/[slug]
│  ├─ assets/css/              # main.css + veci-theme.css (tokens de Tailwind)
│  ├─ public/
│  └─ app.vue
├─ layers/<dominio>/           # TODO lo del dominio: componentes, composables, api, queries, stores (§3.1)
├─ server/                     # Nitro: mock de la API (api/v1, mock/, utils/) y, más adelante, BFF
├─ docs/                       # architecture.md · business-model.md
├─ nuxt.config.ts
├─ package.json
└─ .env.example
```

### 3.1 Dominios como Nuxt Layers

Cada dominio es un **layer** autocontenido en `layers/<d>/` (el equivalente al *package-by-feature*
de Spring Boot). Nuxt registra automáticamente cada carpeta de `layers/`. Dominios: `auth`, `business`,
`booking`, `category`, `feed`, `notice`, `notification`, `people`, `post`, `social`, `story`
(detalle en `layers/README.md`). Ejemplo:

```
layers/feed/
├─ nuxt.config.ts                  # components: { path: 'components', pathPrefix: false, extensions: ['vue'] }
├─ components/
│  └─ FeedPostCard.vue             # -> <FeedPostCard>; lógica dentro del <script setup> (§4.6)
├─ composables/useFeedSheetState.ts  # auto-importado
├─ api.ts · queries.ts            # capa de datos del dominio
└─ stores.ts                       # Pinia
```

Reglas:

- Dentro del layer se importa en relativo (`../queries`); desde fuera, con el alias
  `#layers/feed/…` (p. ej. `import { useFeedPrefsStore } from '#layers/feed/stores'`).
- En el `nuxt.config.ts` del layer las rutas van **relativas** (`'components'`): ahí `~` apunta al
  `app/` de la raíz, no al layer.
- Un layer sin componentes (solo datos: `category`, `notice`, `people`) tiene un `nuxt.config.ts` vacío.
- Lo compartido se queda en `app/`: design system (`components/ui`), `api/`, `utils/`, composables
  genéricos, `useShellPrefetch` (precarga varios dominios para los layouts), páginas y layouts.

---

## 4. Frontend — Nuxt 4 (solo presentación)

### 4.1 Capas

```
1. Presentación      app/pages · app/layouts · app/components/ui · layers/<d>/components
2. Estado cliente    layers/<d>/stores.ts  (Pinia: sesión, UI global, preferencias)
3. Datos servidor    layers/<d>/queries.ts (TanStack Query: caché, infinite, optimistic)
4. Acceso a red      layers/<d>/api.ts     (endpoints tipados) + app/api/client.ts
5. Contrato          OpenAPI → tipos       (hoy en app/api/types.ts; luego generados)
6. BFF (opcional)    server/               (Nitro: proxy, cookies httpOnly)
```

### 4.2 Auto-import de componentes

El nombre de un componente sale solo de su archivo (sin prefijo de carpeta), así que cada archivo
ya lleva el prefijo de su dominio (`FeedPostCard.vue`, `BusinessRow.vue`). Solo los `.vue` son
componentes (`extensions: ['vue']`).

```ts
// nuxt.config.ts (raíz): el design system
components: [{ path: '~/components/ui', pathPrefix: false, extensions: ['vue'] }]   // <BButton>

// layers/<d>/nuxt.config.ts: los componentes del dominio
components: [{ path: 'components', pathPrefix: false, extensions: ['vue'] }]        // <FeedPostCard>
```

### 4.3 Estado: Pinia vs TanStack Query

Esta separación es **obligatoria**.

| Tipo de estado | Herramienta | Ejemplos |
|---|---|---|
| **De servidor** (vive en el backend) | **TanStack Query** | feed, posts, perfil, notificaciones |
| **De cliente** (solo UI/local) | **Pinia** | sesión cacheada, menú abierto, tema, borradores |

> ❌ Nunca guardar el feed (ni ningún dato del backend) en Pinia.

TanStack Query aporta: caché con *stale time*, `infiniteQuery` para el scroll del feed,
`mutation` con **optimistic updates** (likes/follows) e invalidación por claves.

### 4.4 Acceso a datos

Los componentes **nunca** llaman a `$fetch` directamente. Toda comunicación pasa por
`layers/<d>/api.ts` y se consume desde `layers/<d>/queries.ts`.

```ts
// layers/feed/api.ts
import { api } from '~/api/client'

export const postsApi = {
  feed: (cursor?: string) => api<Paginated<FeedItem>>('/feed', { query: { cursor } }),
  like: (id: string) => api<void>(`/posts/${id}/like`, { method: 'POST' })
}
```

`api()` (en `app/api/client.ts`) usa la URL base de `NUXT_PUBLIC_API_BASE_URL` y convierte toda
falla —respuesta 4xx/5xx o sin red— en `ApiError` (`app/api/errors.ts`), con `status`, `code` y
`details` del contrato (§6). TanStack Query tipa `error` como `ApiError` y no reintenta los 4xx.

```ts
// layers/feed/queries.ts
export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => postsApi.feed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor
  })
}
```

> **Estado actual (temporal):** los `api.ts` ya hacen las llamadas HTTP definitivas, pero contra un
> **mock de Nitro** en `server/api/v1/` (URL base `/api/v1`, la de por defecto) que cumple el
> contrato del §6: mismas rutas, status, cuerpos y errores, con latencia simulada. Los datos dummy
> viven en `server/mock/`. Para usar el backend FastAPI solo se cambia `NUXT_PUBLIC_API_BASE_URL`;
> después se borran `server/api/v1/`, `server/mock/` y `server/utils/mock-api.ts`.

Cada dominio exporta además sus opciones como `queryOptions` **reutilizables**, de modo
que el componente y la precarga en SSR compartan definición:

```ts
// layers/people/queries.ts
export const contactsOptions = queryOptions({
  queryKey: peopleKeys.contacts,
  queryFn: () => peopleApi.contacts()
})

export function useContacts() {
  return useQuery(contactsOptions)
}
```

```ts
// app/layouts/social.vue — precarga el shell antes de renderizar en SSR
if (import.meta.server) {
  const queryClient = useQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(storiesOptions),
    queryClient.prefetchQuery(contactsOptions),
    queryClient.prefetchQuery(suggestionsOptions)
  ])
}
```

> El plugin `app/plugins/vue-query.ts` es **universal**: en SSR **deshidrata** la caché
> al payload (`dehydrate`) y en el cliente la **rehidrata** (`hydrate`). Cuando una vista
> no necesita datos en el HTML inicial, o su render no es determinista (p. ej. fechas
> formateadas), se envuelve en `<ClientOnly>` (ver `pages/home.vue`).

### 4.5 BFF y autenticación

- El frontend **no** almacena tokens en `localStorage`/memoria.
- El **BFF** (`server/`) intercambia el token con el backend y lo guarda en **cookie httpOnly + Secure + SameSite**.
- En enterprise, la identidad suele ser **OIDC/OAuth2** contra un IdP (Keycloak, Auth0, Entra ID). El BFF actúa como *confidential client*.
- Los **guards** de ruta (`app/middleware`) bloquean rutas privadas.

### 4.6 Convenciones de componentes

- **Design system** en `app/components/ui` (prefijo `B*`): sin lógica de negocio, solo props + slots.
- **Componentes de dominio** en `layers/<dominio>/components`: orquestan datos vía composables/queries.
- **Composables** (`useX`) contienen orquestación de UI y datos, **no** reglas de negocio.

#### Un componente = un `.vue` (lógica en `<script setup>`)

La lógica de cada componente vive en su propio `<script setup>`, como es lo idiomático en Vue. Solo se
saca a un composable (`composables/useX.ts`) cuando se **reutiliza** en varios componentes o cuando crece
tanto que conviene probarla por separado.

```vue
<script setup lang="ts">
/** Comentario que documenta el componente. */
interface FeedPostCardProps {
  item: FeedItem
}

const props = defineProps<FeedPostCardProps>()
const hidden = computed(() => prefs.isHidden(props.item.id))
</script>
```

Reglas:

- `interface <Componente>Props` (y `<Componente>Emits` si emite) dentro del `<script setup>`, con el
  comentario que documenta el componente encima.
- **Valores por defecto** de props: se resuelven en la lógica (`props.size ?? 'lg'`), sin `withDefaults`.
  Un booleano que por defecto sería `true` se nombra al revés (`hideBar`, no `bar`).
- **TS clásico**: interfaces con nombre, `if`/`return` en lugar de ternarios encadenados, sin `!` ni
  `filter(Boolean)`; el template muestra valores y llama funciones, no arma lógica.
- Componentes sin props ni lógica (`BBadge`, `BDot`, `app.vue`): solo template. Los layouts solo llaman a
  `useShellPrefetch()` y se quedan como están.
- **Páginas con espera de SSR**: todas las llamadas a composables van primero, de forma síncrona, y la
  espera va al final en una función `ssrPrefetch()` que la página llama con `await ssrPrefetch()`. Nuxt
  solo conserva su contexto hasta el primer `await` (por eso `useRequestEvent()` se captura antes de esperar).
  Ver `pages/negocio/[slug].vue`.

#### Piezas compartidas

- **UI reutilizable** (`components/ui`): `BButton` (outline/primary, sm–xl, icon, block, to/external),
  `BSegmented` (chips/track), `BChip`, `BBadge`, `BCounter`, `BDot`/`BDotList`, `BIconCircle`, `BSheet`,
  `BPopover`/`BMenuItem`, `BEmptyState`, `BIconButton`. Antes de escribir un botón o una píldora a mano, usar estos.
- **Composables de comportamiento**: `useModalDialog` (`<dialog>` + bloqueo de scroll), `useScrollLock`
  (apilado), `useSwipeGesture` (deslizar/tocar/arrastrar para cerrar), `useClampedText` ("Ver más"),
  `useShare` (compartir o copiar enlace), `useBackToClose` (botón "atrás" del teléfono).
- **`utils/IdList`**: clase con `has`/`add`/`addMany`/`remove`/`toggle` para los stores de IDs del vecino
  (guardados, recomendados, vistos, leídos…). Se usa clase donde de verdad encaja; en los componentes la
  reutilización es por composición (composables y componentes), no por herencia.

---

## 5. Backend externo — FastAPI (contrato)

El backend **no vive en este proyecto**. Aun así, su forma condiciona el frontend:

```
[ api/v1/*.py ]        Routers  → validan entrada (Pydantic) y delegan.  ≈ Controllers
[ services/*.py ]      Lógica de negocio y reglas del dominio.          ≈ Services
[ repositories/*.py ]  Acceso a datos (SQLAlchemy).                     ≈ Repositories
        ↓
   PostgreSQL
```

**Regla (para el equipo de backend):** un router nunca accede a la base de datos
directamente; siempre pasa por un service.

---

## 6. Contrato de API

| Aspecto | Regla |
|---|---|
| Versionado | Prefijo de ruta: `/v1/...` |
| Formato | JSON; `snake_case` en payloads |
| Paginación de listas | **Por cursor** en feed/notificaciones: `?cursor=&limit=` |
| Éxito | 2xx con el recurso tal cual, sin envoltorio; listas paginadas: `{ items, nextCursor }` |
| Errores | Estructura uniforme: `{ error: { code, message, details? } }` con el status HTTP real (tabla abajo) |
| Idempotencia | Acciones repetibles (likes/follows) idempotentes |
| Fechas | ISO-8601 en UTC |
| Auth | `Authorization: Bearer <jwt>` (o cookie vía BFF) |
| Documentación | OpenAPI en `GET /v1/openapi.json` + Swagger UI |

**Códigos de error** (`ApiErrorCode` en `app/api/types.ts`; la UI decide por `code`, nunca por `message`):

| Status | `code` | `details` |
|---|---|---|
| 400 | `otp_invalid` | `{ attemptsLeft }` |
| 400 | `otp_expired` | — |
| 401 | `unauthorized` | — |
| 403 | `forbidden` | — |
| 404 | `not_found` | — |
| 409 | `conflict` | — |
| 422 | `validation_error` | `{ fields: { <campo>: <mensaje> } }` |
| 429 | `otp_locked` · `rate_limited` | — |
| 500 | `internal_error` | — |
| — | `network_error` | lo pone el cliente cuando no hubo respuesta (`status: 0`) |

En FastAPI esto requiere `exception_handler` propios (incluido el de `RequestValidationError`, que
por defecto responde `{ detail: [...] }`). El mock de `server/api/v1/` ya responde así.

**Flujo de tipos (obligatorio):**

```
Backend FastAPI  ──▶  OpenAPI (json)  ──▶  Orval  ──▶  app/api/generated (TS)
                                                              │
                                                              ▼
                                                    web-veci (tipado estricto)
```

Regeneración: descarga el `openapi.json` del backend y ejecuta la generación
(p. ej. `npx orval`), que escribe en `app/api/generated/`. En CI, el *contract check*
falla si los tipos generados no están actualizados.

---

## 7. Modelo de dominio

El modelo de negocio completo (categorías, capacidades, entidades, tipos de publicación y hoja
de ruta) está en **[business-model.md](business-model.md)**. Resumen:

| Entidad | Descripción |
|---|---|
| `User` | Cuenta del vecino (alta por código al celular; sin contraseña) |
| `Category` | Giro del negocio (belleza, salud, comida…) |
| `Business` | Negocio de la colonia: horario, ubicación, rating, recomendaciones, capacidades |
| `Service` / `Availability` | Servicios con precio y horarios libres (capacidad *citas*) |
| `Promo` / `Review` | Oferta con vigencia; reseña destacada de un vecino |
| `FeedItem` | Publicación tipada con acción (`oferta`, `horarios`, `resena`, …) |
| `Story` | Historia de 24 h de un negocio o de VECI |
| `Booking` | Cita apartada por un vecino |
| `Notice` / `NeighborhoodFund` | Avisos y fondo vecinal (categoría *Comunidad*) |
| `Notification` · `Report` | Avisos al vecino · moderación |

> Fuera del modelo **por regla**: comentarios, seguidores/amigos y publicaciones de vecinos. Una sola
> reacción (apretón de manos): recomienda al negocio y, en las fotos de una publicación, cuenta por foto (`PostPhoto.likes`).
>
> **Feed:** consulta por cursor + índices; el orden por relevancia (franja horaria, abierto ahora, vigencia de ofertas) lo calcula el backend.

---

## 8. Tiempo real (diferido)

No se implementa ahora, pero se **desacopla** mediante una interfaz en el frontend:

```ts
// app/composables/useRealtime.ts
export interface RealtimeService {
  connect(): Promise<void>
  subscribe(channel: string, cb: (payload: unknown) => void): () => void
  disconnect(): void
}
```

Hoy: implementación *no-op*. Mañana: se sustituye por Centrifugo / Soketi / Ably / Supabase Realtime **sin tocar las features**.

> ⚠️ Nitro (Nuxt) no sostiene WebSockets en entornos serverless. Si se elige serverless, el tiempo real debe vivir en un servicio aparte o en el backend.

---

## 9. Media (imágenes/vídeo)

- Los archivos van a **object storage** (S3 / Cloudflare R2).
- El backend emite **URLs firmadas** para subida/descarga directa (el archivo **no** pasa por el backend).
- Metadatos (autor, tipo, dimensiones) en `Media`.

---

## 10. Seguridad

- Transporte **HTTPS** obligatorio; CORS restringido a orígenes conocidos.
- Tokens en **cookie httpOnly** (BFF) o Bearer de corta vida + refresh.
- **Rate limiting** en el backend en endpoints sensibles (login, registro, publicar).
- Validación **en ambos lados**: el frontend valida para UX; el backend **siempre** revalida.
- Principio de mínimo privilegio en credenciales.

---

## 11. Observabilidad

- **Frontend:** Sentry (errores) + OpenTelemetry (trazas de navegación).
- **Correlación:** propagar un `X-Request-Id` desde el frontend/BFF al backend.

---

## 12. Testing

| Nivel | Frontend |
|---|---|
| Unit | Vitest |
| Componente | @nuxt/test-utils / Vue Test Utils |
| E2E | Playwright |
| Contrato | Orval schema / MSW |

---

## 13. CI/CD

- **Pipeline** con caché de npm.
- Etapas: `lint → typecheck → test → build`.
- **Contract check**: fallar el PR si el OpenAPI del backend cambió y los tipos generados no se regeneraron.

---

## 14. Convenciones transversales

- **TypeScript estricto** (`strict: true`).
- **Nombres:** componentes en `PascalCase`; composables `useXxx`; ficheros de API en `camelCase`.
- **Commits:** Conventional Commits.
- **Ramas:** trunk-based o GitHub Flow.
- **Idioma:** UI en español (`lang="es"`); identificadores de código en inglés.

---

## 15. Roadmap de adopción (por fases)

| Fase | Alcance |
|---|---|
| **1. Shell** (hecho) | Proyecto Nuxt único en `web-veci/` con la estructura (`api/`, `components/ui`, `layers/`, `composables/`, `plugins/`, `utils/`) + `docs/architecture.md` |
| **2. Datos** (dummy hecho) | `app/api/client.ts` + capa de datos con TanStack Query (hoy con datos dummy); al llegar el backend, tipos generados del OpenAPI |
| **2b. Shell social** (hecho) | Layout `social.vue` + `/home`: barra superior con búsqueda, historias, composer, feed, navegación inferior/lateral y columna derecha (datos dummy; historias/búsqueda/navegación como *placeholder* visual) |
| **3. Auth** | Registro/login, JWT + BFF con cookies, guards de ruta |
| **4. Feed** | Post, feed por cursor, infinite scroll, likes optimistas (contra backend real) |
| **5. Social** | Perfiles, follow, comentarios, notificaciones |
| **6. Media** | Subida directa a S3/R2 con URLs firmadas |
| **7. Moderación** | Reportes, bloqueos, panel de moderación |
| **8. Realtime** | Chat y notificaciones en vivo mediante `RealtimeService` |

---

## 16. Decisiones (ADR resumido) y alternativas descartadas

| Decisión | Elección | Alternativa descartada | Motivo |
|---|---|---|---|
| Backend | FastAPI en **proyecto aparte** | Monolito Nuxt/Nitro | Requisito enterprise, equipos independientes |
| Empaquetado | Proyecto Nuxt único | Monorepo con workspaces | El backend está aparte; no hace falta monorepo |
| Contrato | OpenAPI + Orval | Tipos escritos a mano | Evita deriva y errores en producción |
| Estado servidor | TanStack Query | Solo Pinia | Caché, paginación y optimistic out-of-the-box |
| SSR de datos | Plugin universal (`dehydrate`/`hydrate`) + `queryOptions` precargadas | Delegar todo a `<ClientOnly>` | El HTML inicial llega con contenido y sin desajustes de hidratación |
| Estado cliente | Pinia | refs globales manuales | Estándar, devtools, tipado |
| Organización | Un **Nuxt Layer** por dominio (`layers/<d>/`: components, composables, api, mock, queries, stores) | Dominio repartido entre `components/<d>` y `features/<d>` · Capas técnicas sueltas · Feature-Sliced Design | Un dominio se agrega o quita en una sola carpeta, como un módulo de Spring Boot, sin la ceremonia de FSD |
| Componentes | Un `.vue` por componente, lógica en `<script setup>`; composable solo si se reutiliza | `X.vue` + `X.logic.ts` | Idiomático en Vue; la mitad de archivos |
| Tiempo real | Diferido + interfaz | Implementar ya | Evita sobrediseño sin caso de uso definido |
| Tipografía | **Roboto** + **Roboto Mono** | Michroma / Inter / JetBrains Mono | Alineado con el ecosistema Google / Material Design |
| Iconos | **Material Symbols** (`@nuxt/icon`) | Emojis y símbolos de texto | Set oficial de Google, self-hosted y consistente |
| Gestor de paquetes | npm | pnpm | Igual que el proyecto original |

---

*Última actualización: 2026-10-17.*
