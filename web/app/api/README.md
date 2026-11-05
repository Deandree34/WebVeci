# api/

**Infraestructura de red compartida** por todos los dominios.

- `client.ts` — `api<T>(path, options)`: URL base (`NUXT_PUBLIC_API_BASE_URL`), credenciales,
  cabeceras; toda falla sale como `ApiError`. Lo inicializa `plugins/api.ts`.
- `errors.ts` — `ApiError` (`status`, `code`, `details`), `toApiError`, `isApiError`.
- `types.ts` — **re-exporta** los tipos del contrato con los nombres que usa la app
  (`Business`, `FeedItem`, `ApiErrorBody`…). No se edita a mano salvo los pocos tipos que OpenAPI
  no puede expresar (`Paginated<T>`, `HomeTab`), y en ese caso lleva una nota.
- `generated/schema.d.ts` — tipos generados por `openapi-typescript`. **No se edita a mano**:
  `npm run contract:types` (desde `web/`) lo regenera desde `../specs/contract/openapi.yaml`.

Los endpoints de cada dominio viven en `layers/<dominio>/api.ts` (ver `layers/README.md`). Hoy
responden el mock de Nitro (`server/api/v1/`, ver `server/README.md`), con el mismo contrato que
tendrá FastAPI: cambiar al backend real es solo cambiar la URL base.

**Regla:** los componentes y stores NO llaman a `api` ni a `$fetch`; consumen los endpoints
a través de TanStack Query en `layers/*/queries.ts`.
