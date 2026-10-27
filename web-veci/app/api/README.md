# api/

**Infraestructura de red compartida** por todos los dominios.

- `client.ts` — instancia base (`baseURL`, credenciales, cabeceras).
- `types.ts` — tipos del dominio (contrato con el backend).

Los endpoints de cada dominio viven en `app/features/<dominio>/api.ts` y sus datos
dummy en `app/features/<dominio>/mock.ts` (ver `app/features/README.md`).

**Regla:** los componentes y stores NO llaman a `$fetch`; consumen los endpoints
a través de TanStack Query en `features/*/queries.ts`.

Cuando exista el backend, los tipos se generan desde su **OpenAPI** en
`app/api/generated/` (p. ej. con Orval) y reemplazan a `types.ts`; los `api.ts`
pasan a hacer las llamadas reales y se borran los `mock.ts`.
