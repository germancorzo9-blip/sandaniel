# Farmacia San Daniel

Tienda online de Farmacia San Daniel: catálogo de vitaminas y suplementos con filtros, carro de compras y pedido por WhatsApp.

## Archivos

- `index.html`: la página completa y lista para publicar. No necesita servidor ni dependencias; basta con subirla a cualquier hosting estático (GitHub Pages, Netlify, etc.).
- `src.html`: el archivo fuente que se edita.
- `build.py`: genera `index.html` a partir de `src.html`, incrustando el logo y los íconos usados.
- `logo.png` / `logo.webp`: logo de la farmacia.
- `icons/`: íconos de [Phosphor Icons](https://phosphoricons.com) (licencia MIT).

## Enlaces directos por sección

Cada categoría del menú tiene su propio enlace, que se puede compartir en redes o por WhatsApp:

| Sección | Enlace |
|---|---|
| Medicamentos | `/#medicamentos` |
| Vitaminas y suplementos | `/#vitaminas-y-suplementos` |
| Dermocosmética | `/#dermocosmetica` |
| Cuidado personal | `/#cuidado-personal` |
| Bebé y maternidad | `/#bebe-y-maternidad` |
| Adulto mayor | `/#adulto-mayor` |
| Ofertas de la semana | `/#ofertas` |
| Todos los productos | `/#todos` |

Para agregar un producto a una sección, súmalo a la lista `P` con `sec:'<id de la sección>'` y `cat:'<subcategoría>'`. Para que además aparezca en otra sección, usa `also:{'<id>':'<subcategoría>'}`. Las ofertas se arman solas con los productos que tienen descuento o segunda unidad a mitad de precio.

## Cómo editar

1. Modifica `src.html` (textos, productos en la lista `P` del script, colores en `:root`).
2. Ejecuta `python3 build.py` (requiere Python 3).
3. Sube el `index.html` generado.

## Antes de publicar

Reemplaza los datos de ejemplo por los reales:

- Teléfono `600 260 1457` y WhatsApp `+56 9 2601 4578` (también en el enlace `wa.me/56926014578`).
- Direcciones de los locales, nombre del químico farmacéutico responsable y cifras ("27 años", "14 locales", reseñas).
- Productos, marcas y precios de la lista `P`.
