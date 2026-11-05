# Constitución — VECI

Reglas que no se negocian en un spec, un plan o una tarea. Si algo choca con este documento, se
cambia **este documento primero** (y se justifica), no el código.

Última revisión: 2026-10-29.

---

## 1. Producto y repositorio

- VECI es una red social de barrio: negocios de la colonia, feed, historias, citas y avisos.
- Monorepo, una sola raíz git:

  | Carpeta | Qué vive ahí |
  |---|---|
  | `specs/` | Constitución, contrato OpenAPI y specs de features (SDD) |
  | `web/` | Nuxt 4 (SSR): capa de presentación |
  | `api/` | FastAPI: único backend |
  | `docs/` | Documentos de producto compartidos |

- El contrato vive en **`specs/contract/openapi.yaml`**. No hay otra fuente de verdad para la API.
- El backend y el frontend se despliegan por separado, pero el contrato es **uno solo**.

## 2. Contrato de API

### 2.1 Forma

- **Éxito**: el recurso tal cual, sin envoltorio (`{ code, msg, data }` está prohibido).
- **Error**: `{ error: { code, message, details? } }` con el **status HTTP real**.
- **camelCase** en payloads, rutas y query params (no `snake_case`).
- **Fechas**: ISO-8601 en UTC, con sufijo `Z`.
- **Ids**: strings opacos; el cliente nunca los interpreta.
- El contrato es **OpenAPI 3.1** (lo que genera FastAPI por defecto).

### 2.2 Códigos de error

La UI decide por `code`, nunca por `message`.

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
| — | `network_error` | lo pone el cliente cuando no hubo respuesta (`status: 0`); **no existe en el servidor** |

Los códigos son **estables**: renombrar uno es un cambio incompatible.

### 2.3 Colecciones

- Una colección **acotada por el dominio** se devuelve completa: un array.
- Una colección que **puede crecer sin límite** se pagina por cursor:
  `{ items, nextCursor }` con `?cursor=&limit=` (`nextCursor: null` en la última página).
- Hoy se paginan `/feed` y `/me/notifications`; el resto son arrays.

### 2.4 Versionado

- El prefijo de ruta es la versión: `/v1/...`.
- En `/v1` **solo se agrega**. Un cambio incompatible (quitar un campo, cambiar un tipo, cambiar un
  código de error) es una versión nueva: `/v2`.
- **Excepción pre-1.0**: mientras no exista un backend desplegado en producción, el contrato es
  `0.x` y puede cambiar de forma incompatible. La regla de solo-agregar entra en vigor con la
  `1.0.0`. Todo cambio incompatible previo a eso se anota en el spec correspondiente.

## 3. Backend

- **FastAPI es el único backend** (Python, `api/`). El frontend nunca implementa reglas de negocio.
- El **mock de Nitro** (`web/server/api/v1/`) solo imita respuestas con datos dummy: mismas rutas,
  status y formato de error. **No implementa lógica** y desaparece cuando entre FastAPI.
- Base de datos: **PostgreSQL** + **pgvector** (búsqueda con IA) + **PostGIS** (colonias).
  Redis para caché/colas. Celery para embeddings y notificaciones.
- Tres capas por módulo (`router` → `service` → `repository`). Sin Clean Architecture ceremonial:
  solo los proveedores externos (WhatsApp, embeddings) se aíslan detrás de una interfaz chica.
- Un router nunca accede a la base de datos directamente.
- El `trace_id` de observabilidad viaja en el header `X-Request-Id`, nunca en el cuerpo.

## 4. Acceso

- **Sin contraseñas.** Passkeys (WebAuthn) + celular verificado por **WhatsApp inverso**.
- Sesión: **cookie `httpOnly` emitida por FastAPI** (`Domain=.veci.mx`, `Secure`, `SameSite=Lax`).
  **No hay BFF**: Nitro no guarda ni intercambia tokens.
- App móvil futura: el mismo backend con `Authorization: Bearer`.
- WebAuthn **RP ID**: `veci.mx` (en desarrollo `localhost`). El *ceremony* ocurre siempre en una
  página de ese dominio.
- El flujo actual `/auth/otp` (código por WhatsApp/SMS) es **provisional**: se documenta tal como
  está y el spec `001-acceso` lo reemplaza por la verificación inversa.

## 5. SDD (spec-driven development)

1. **Spec** (`spec.md`): qué y por qué, en lenguaje de producto. Sin código.
2. **Aclarar**: dudas resueltas antes de planear; lo resuelto se escribe en el spec.
3. **Plan** (`plan.md`): cómo, con archivos y orden. Si toca la API, **incluye el cambio del
   contrato**.
4. **Tasks** (`tasks.md`): pasos pequeños y verificables.
5. **Implementar**: solo lo que dice el plan.

Reglas:

- **El contrato se cambia antes que el código.** Un cambio de API sin cambio en
  `specs/contract/` es un bug, aunque funcione.
- Nada de "de paso arreglé esto otro": va en su propio spec o no va.
- Si al implementar aparece algo que el plan no previó, se actualiza el plan antes de seguir.

## 6. Frontend

- El contrato manda: los tipos se **generan** (`openapi-typescript`) y `web/app/api/types.ts` solo
  **re-exporta** con los mismos nombres. Ningún import cambia.
- Un tipo que no se puede expresar limpio en OpenAPI se queda escrito a mano en `types.ts`, con una
  nota que diga por qué.
- Los componentes no llaman a `$fetch`: pasan por `layers/<dominio>/api.ts` + `queries.ts`.
- Estado de servidor → TanStack Query. Estado de cliente → Pinia.
- Las llamadas HTTP usan `credentials: 'include'` (la cookie la pone FastAPI).

## 7. Calidad

- TypeScript estricto; `npm run typecheck` en verde antes de cada commit.
- `npm run contract:lint` en verde antes de cada commit que toque el contrato.
- Conventional Commits. Un commit por cambio coherente, no por archivo.
