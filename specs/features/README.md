# features/ — specs

Un spec por feature, en su carpeta: `NNN-<nombre>/` (`001-acceso`, `002-feed-real`…). El número es
el orden de trabajo, no la prioridad del producto.

```
features/
└─ 001-acceso/
   ├─ spec.md      # qué y por qué
   ├─ plan.md      # cómo (y el cambio del contrato, si toca la API)
   └─ tasks.md     # pasos pequeños y verificables
```

Reglas (ver [`../constitution.md`](../constitution.md) §5):

- El **spec no lleva código** ni nombres de archivo. Habla de comportamiento y de producto.
- Las dudas se resuelven **antes** del plan; lo decidido se escribe en el spec (sección "Decisiones").
- Si el feature toca la API, **el contrato se cambia en el plan y antes del código**
  (`../contract/*.yaml`).
- Si al implementar aparece algo que el plan no previó, se actualiza el plan **antes** de seguir.

---

## Plantilla — `spec.md`

```md
# <NNN> — <nombre>

**Estado**: borrador · aclarando · listo para planear · implementando · hecho
**Depende de**: <otros specs> · **Toca el contrato**: sí/no

## Problema

Qué duele hoy y a quién (vecino, negocio, VECI). Sin solución todavía.

## Resultado esperado

Qué cambia para el usuario cuando esto esté hecho. En términos observables.

## Fuera de alcance

Lo que este spec **no** hace, para que no se cuele en el plan.

## Reglas de negocio

Las que el backend va a tener que hacer cumplir. Si hay un límite (intentos, tiempos, tamaños), va
aquí con su número.

## Casos borde

Qué pasa si… (vacío, repetido, sin sesión, sin red, dato viejo).

## Decisiones

Dudas resueltas durante la aclaración, con la razón. Fecha.

## Preguntas abiertas

Solo si de verdad bloquean el plan.
```

## Plantilla — `plan.md`

```md
# Plan — <NNN> <nombre>

## Contrato (si toca la API)

- Schemas nuevos/cambiados en `specs/contract/…` y por qué.
- Endpoints: método, ruta, status, errores.
- Compatibilidad: ¿es aditivo? Si no, ¿por qué se permite (pre-1.0)?

## Backend (`api/`)

Módulo, router, service, repositorio, migración. Qué NO se toca.

## Frontend (`web/`)

Layers afectados (`api.ts`, `queries.ts`, `stores.ts`, componentes, páginas). Tipos que se regeneran.

## Orden de ejecución

1. …
2. …

## Verificación

Comandos y casos concretos que tienen que pasar (no "probar que funciona").
```

## Plantilla — `tasks.md`

```md
# Tasks — <NNN> <nombre>

- [ ] T1 · Contrato: <cambio en specs/contract>
- [ ] T2 · `npm run contract:lint` + `contract:types` en verde
- [ ] T3 · Backend: <pieza>
- [ ] T4 · Frontend: <pieza>
- [ ] T5 · Verificación: <comando o caso>
```

Una tarea se puede terminar y verificar sola. Si una tarea necesita "y además…", son dos.
