# api/

**Infraestructura de red compartida** por todos los dominios.

- `client.ts` — `api<T>(path, options)`: URL base (`NUXT_PUBLIC_API_BASE_URL`), credenciales,
  cabeceras; toda falla sale como `ApiError`. Lo inicializa `plugins/api.ts`.
- `errors.ts` — `ApiError` (`status`, `code`, `details`), `toApiError`, `isApiError`.
- `types.ts` — contrato con el backend: tipos del dominio, `Paginated<T>`, `ApiErrorBody`, `ApiErrorCode`.

Los endpoints de cada dominio viven en `layers/<dominio>/api.ts` (ver `layers/README.md`). Hoy
responden el mock de Nitro (`server/api/v1/`, ver `server/README.md`), con el mismo contrato que
tendrá FastAPI: cambiar al backend real es solo cambiar la URL base.

**Regla:** los componentes y stores NO llaman a `api` ni a `$fetch`; consumen los endpoints
a través de TanStack Query en `layers/*/queries.ts`.

Cuando exista el backend, los tipos se generan desde su **OpenAPI** en
`app/api/generated/` (p. ej. con Orval) y reemplazan a `types.ts`.
