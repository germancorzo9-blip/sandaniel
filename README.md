# Farmacia San Daniel

Tienda online de Farmacia San Daniel: catálogo de vitaminas y suplementos con filtros, carro de compras y pedido por WhatsApp.

## Archivos

- `index.html`: la página completa y lista para publicar. No necesita servidor ni dependencias; basta con subirla a cualquier hosting estático (GitHub Pages, Netlify, etc.).
- `src.html`: el archivo fuente que se edita.
- `data/inventario.csv`: el inventario de la farmacia. Es la fuente de todos los productos, precios y stock de la página.
- `inventario.py`: lee el inventario y decide en qué sección del menú aparece cada producto.
- `build.py`: genera `index.html` a partir de `src.html` y del inventario, incrustando el logo y los íconos usados.
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

Las secciones sin productos en el inventario no se muestran en el menú. Hoy el inventario tiene medicamentos, vitaminas y suplementos, así que Dermocosmética, Cuidado personal y Ofertas están ocultas. Aparecen solas cuando el CSV traiga productos de esas categorías.

## Actualizar productos, precios y stock

1. Reemplaza `data/inventario.csv` por la versión nueva, con las mismas columnas.
2. Ejecuta `python3 build.py`. Muestra cuántos productos cargó y avisa de stock bajo, SKU repetidos o categorías desconocidas.
3. Sube los cambios a GitHub; Vercel publica solo.

Reglas que aplica la página:

- `categoria` define la sección: Medicamentos va a Medicamentos; Vitaminas y Suplementos van a Vitaminas y suplementos. Para usar una categoría nueva, agrégala en `SECCION` dentro de `inventario.py`.
- `subcategoria` es el filtro que aparece dentro de cada sección.
- Los productos para niños, embarazo y adulto mayor también se muestran en esas secciones. La lista está en `TAMBIEN` dentro de `inventario.py`.
- No se muestran los productos con `activo` distinto de 1 ni los vencidos.
- Con `stock` igual o menor a `stock_minimo` el producto muestra "Últimas unidades"; con stock 0 aparece como agotado. Nadie puede pedir más unidades que el stock (máximo 10 por producto).
- `requiere_receta` = 1 muestra "Requiere receta" y lo marca en el pedido de WhatsApp.

## Fotos de productos

Guarda la foto de cada producto en `images/` con el SKU como nombre, por ejemplo `images/MED-001.jpg` (sirven .webp, .jpg, .jpeg o .png). También puedes agregar al CSV una columna `imagen` con la dirección de la foto. `build.py` avisa cuántos productos siguen sin foto; esos muestran el envase dibujado.

## Cómo editar

1. Modifica `src.html` (textos, productos en la lista `P` del script, colores en `:root`).
2. Ejecuta `python3 build.py` (requiere Python 3).
3. Sube el `index.html` generado.

## Antes de publicar

Reemplaza los datos de ejemplo por los reales:

- Teléfono `600 260 1457` y WhatsApp `+56 9 2601 4578` (también en el enlace `wa.me/56926014578`).
- Direcciones de los locales, nombre del químico farmacéutico responsable y cifras ("27 años", "14 locales", reseñas).
- Textos comerciales que no vienen del inventario: beneficios del Club San Daniel, 10% de descuento por suscribirse, despacho gratis sobre $29.990, entrega express, años, locales y reseñas.
