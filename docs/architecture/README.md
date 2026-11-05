# Diagramas de arquitectura

Las páginas interactivas están en `site/`. Hay versiones en inglés y español de la arquitectura y del ciclo de vida de las subidas.

## Regenerar los diagramas

Desde la raíz del repositorio, ejecuta estos comandos con Archify v3.2.0:

```powershell
node C:\Users\carlo\.agents\skills\archify\bin\archify.mjs finalize architecture docs/architecture/architecture.en.json docs/architecture/site/architecture.html --repo-root . --quality showcase --json
node C:\Users\carlo\.agents\skills\archify\bin\archify.mjs finalize lifecycle docs/architecture/upload-lifecycle.en.json docs/architecture/site/upload-lifecycle.html --repo-root . --quality showcase --json
node C:\Users\carlo\.agents\skills\archify\bin\archify.mjs finalize architecture docs/architecture/architecture.es.json docs/architecture/site/es/architecture.html --repo-root . --quality showcase --json
node C:\Users\carlo\.agents\skills\archify\bin\archify.mjs finalize lifecycle docs/architecture/upload-lifecycle.es.json docs/architecture/site/es/upload-lifecycle.html --repo-root . --quality showcase --json
```

Cada JSON fija la revisión del repositorio que documenta. Al actualizar los diagramas para otra revisión, comprueba las citas de código y cambia esa revisión antes de regenerarlos.

## Imágenes para el README

Las imágenes del README son exportaciones SVG (tema oscuro) de los diagramas interactivos, en `docs/architecture/images/en/` y `docs/architecture/images/es/` con el mismo nombre (`architecture.svg`, `upload-lifecycle.svg`). Después de regenerar un diagrama, vuelve a exportarlas con:

```bash
task architecture-svg
```

El script abre cada HTML de `site/` y usa su **Export → SVG** en tema oscuro, igual que hacerlo a mano.

## Publicación

El workflow `.github/workflows/pages.yml` publica `site/` en GitHub Pages (https://csx-923.github.io/GameExplorer/) con cada push a `main` que la cambie.
