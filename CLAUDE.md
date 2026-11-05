# VECI — instrucciones para Claude

Monorepo. La raíz de trabajo es **`C:\GithubProjects\Veci\WebVeci`** (abrir Claude desde ahí).

## Qué vive en cada carpeta

| Carpeta | Qué es | Stack |
|---|---|---|
| `specs/` | Constitución, contrato OpenAPI y specs de features (SDD) | Markdown + YAML |
| `web/` | Frontend: capa de presentación, sin reglas de negocio | Nuxt 4 · Vue 3 · Tailwind v4 |
| `api/` | Backend: único backend | FastAPI · PostgreSQL |
| `docs/` | Documentos de producto compartidos | Markdown |

Empieza por `specs/constitution.md` (reglas que no se negocian) y `specs/README.md` (flujo SDD).

## Regla SDD: el contrato manda

- **No se cambia una API sin cambiar antes `specs/contract/`.** El contrato es
  `specs/contract/openapi.yaml` (OpenAPI 3.1, dividido por recurso).
- Los tipos de `web/app/api/types.ts` se **generan** desde ese contrato: no se editan a mano.
  Después de tocar el yaml: `cd web && npm run contract:types`.
- Un cambio de API sin cambio en `specs/contract/` es un bug, aunque funcione.
- El mock de Nitro (`web/server/api/v1/`) solo **imita** el contrato; no implementa lógica.

## Usar siempre codebase-memory-mcp

En **cada petición** de este proyecto, usa el MCP `codebase-memory-mcp` (proyecto
`C-GithubProjects-Veci-WebVeci`):

1. **Antes de cambiar código**, ubica lo que se va a tocar con el MCP: `search_graph` / `search_code`
   para encontrar componentes, funciones y usos; `get_code_snippet` para leerlos; `trace_path` para
   ver quién usa qué.
2. **Antes de borrar o renombrar** algo, confirma con `search_code` dónde se usa.
3. **Al terminar los cambios**, reindexa con `index_repository` (`repo_path`:
   `C:\GithubProjects\Veci\WebVeci`) y verifica con `search_code` que no quedaron referencias viejas.

Si el MCP no responde o el índice no cubre un archivo, avísalo y usa la lectura directa del archivo
como respaldo.

## Comandos

```bash
# web (Nuxt)
cd web
npm install
npm run dev            # http://localhost:3001
npm run typecheck      # nuxi typecheck
npm run contract:lint  # valida specs/contract
npm run contract:types # bundle + regenera app/api/generated/schema.d.ts

# api (FastAPI) — aún no existe
```

## Referencias

- Contrato: `specs/contract/openapi.yaml` · Reglas: `specs/constitution.md`
- Arquitectura del frontend: `web/docs/architecture.md`
- Modelo de negocio: `docs/business-model.md`
