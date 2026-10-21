# VECI — instrucciones para Claude

## Usar siempre codebase-memory-mcp

En **cada petición** de este proyecto, usa el MCP `codebase-memory-mcp` (proyecto `C-GithubProjects-Veci-WebVeci-web-veci`):

1. **Antes de cambiar código**, ubica lo que se va a tocar con el MCP: `search_graph` / `search_code` para encontrar componentes, funciones y usos; `get_code_snippet` para leerlos; `trace_path` para ver quién usa qué.
2. **Antes de borrar o renombrar** algo, confirma con `search_code` dónde se usa.
3. **Al terminar los cambios**, reindexa con `index_repository` (`repo_path`: `C:\GithubProjects\Veci\WebVeci\web-veci`) y verifica con `search_code` que no quedaron referencias viejas.

Si el MCP no responde o el índice no cubre un archivo, avísalo y usa la lectura directa del archivo como respaldo.
