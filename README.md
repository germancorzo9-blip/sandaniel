# Farmacias San Daniel

Prototipo de tienda online de Farmacias San Daniel, hecho en HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Páginas

- `index.html`: portada (carrusel, beneficios, categorías, ofertas de la semana, más vendidos, Club San Daniel, servicios, marcas y consejos).
- `categoria.html`: listado de una categoría con filtros, orden y paginación.
- `producto.html?id=N`: detalle de producto con galería, precio, cantidad, opciones de entrega y ficha.
- `carro.html`: carro de compras con cantidades, cupón, forma de entrega y resumen.

## Archivos

- `css/styles.css`: todos los estilos. Los colores están en `:root` y salen del logo.
- `js/data.js`: menú de categorías y productos de ejemplo.
- `js/common.js`: header, mega menú, tarjetas de producto, carro (se guarda en el navegador) y avisos.
- `js/home.js`, `js/categoria.js`, `js/producto.js`, `js/carro.js`: lógica de cada página.
- `assets/logo.png`: logo.

## Cómo verlo

Abre `index.html` en el navegador, o publícalo en cualquier hosting estático (Vercel, Netlify, GitHub Pages). Con Vercel: `npx vercel deploy --prod` dentro de esta carpeta.

## Datos de ejemplo

Marcas, productos, precios, costos de despacho, comunas, cupones (`BIENVENIDA10`, `SANDANIEL5`), teléfono y correo son de ejemplo y hay que reemplazarlos por los reales antes de publicar.
