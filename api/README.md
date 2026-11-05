# api/ — backend FastAPI

Aquí vivirá el **único backend** de VECI (FastAPI · PostgreSQL + pgvector + PostGIS · Redis ·
Celery). Todavía no hay código: primero va el spec y el contrato.

- Contrato que debe implementar: [`../specs/contract/openapi.yaml`](../specs/contract/openapi.yaml)
- Reglas: [`../specs/constitution.md`](../specs/constitution.md) §2 y §3
- El frontend (`../web/`) consume este backend por HTTP; no comparte código con él.

Cuando se clone la base, se adapta a la constitución: respuestas sin envoltorio, errores
`{ error: { code, message, details? } }` con el status real, camelCase y paginación
`{ items, nextCursor }`.
