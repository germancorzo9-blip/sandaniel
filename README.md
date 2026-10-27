# Farmacia San Daniel

Tienda online de Farmacia San Daniel: catálogo de vitaminas y suplementos con filtros, carro de compras y pedido por WhatsApp.

## Archivos

- `index.html`: la página completa y lista para publicar. No necesita servidor ni dependencias; basta con subirla a cualquier hosting estático (GitHub Pages, Netlify, etc.).
- `src.html`: el archivo fuente que se edita.
- `build.py`: genera `index.html` a partir de `src.html`, incrustando el logo y los íconos usados.
- `logo.png` / `logo.webp`: logo de la farmacia.
- `icons/`: íconos de [Phosphor Icons](https://phosphoricons.com) (licencia MIT).

## Cómo editar

1. Modifica `src.html` (textos, productos en la lista `P` del script, colores en `:root`).
2. Ejecuta `python3 build.py` (requiere Python 3).
3. Sube el `index.html` generado.

## Antes de publicar

Reemplaza los datos de ejemplo por los reales:

- Teléfono `600 260 1457` y WhatsApp `+56 9 2601 4578` (también en el enlace `wa.me/56926014578`).
- Direcciones de los locales, nombre del químico farmacéutico responsable y cifras ("27 años", "14 locales", reseñas).
- Productos, marcas y precios de la lista `P`.
