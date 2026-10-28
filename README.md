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

## Descuento automático de stock

Cuando un cliente presiona **Confirmar pedido** en el carro:

1. `api/pedido.js` (una función de Vercel) lee `data/inventario.csv` desde GitHub y revisa que haya stock de cada producto.
2. Si alcanza, descuenta las unidades, anota cada línea en `data/pedidos.csv` (número de pedido, fecha, SKU, cantidad, precio, stock anterior y nuevo) y guarda ambos archivos en un solo commit `Pedido SD-…`.
3. El cliente ve el número de pedido y lo envía por WhatsApp para coordinar pago y entrega.

Si dos clientes compran la última unidad al mismo tiempo, solo uno la obtiene; al otro se le avisa y se ajusta su carro. `api/stock.js` entrega el stock actual y la página lo consulta al abrirse y al abrir el carro, así muestra lo que realmente queda sin tener que regenerarse. `vercel.json` evita un nuevo despliegue cuando un commit solo cambia los CSV de inventario, pedidos o pagos.

`data/pedidos.csv` no guarda datos personales porque el repositorio es público; el nombre, teléfono y dirección del cliente llegan solo por WhatsApp.

### Configuración (una sola vez)

1. En GitHub crea un token: Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Repository access: solo `germancorzo9-blip/sandaniel`. Permissions → Contents: Read and write.
2. En Vercel abre el proyecto → Settings → Environment Variables y agrega `GITHUB_TOKEN` con ese token (Production).
3. En Vercel → Deployments, usa **Redeploy** en el último despliegue para que la función tome el token.

Sin el token la tienda sigue funcionando como antes: el carro envía el pedido por WhatsApp y el stock no se descuenta.

### Al editar el inventario a mano

Los pedidos hacen commits en `main`, así que antes de editar ejecuta `git pull`. Para reponer stock o anular un pedido, cambia la columna `stock` del producto en `data/inventario.csv` y sube el cambio.

## Pago con Mercado Pago

Al confirmar el pedido, además de reservar el stock, `api/pedido.js` crea un pago de Mercado Pago (Checkout Pro) con los productos, precios del inventario y el despacho ($2.990 bajo $29.990). El carro muestra **Pagar con Mercado Pago**, que lleva al cliente a pagar con tarjeta de débito, crédito o saldo de Mercado Pago, y deja la opción de coordinar el pago por WhatsApp.

1. Al terminar, Mercado Pago devuelve al cliente a la tienda (`/?pago=aprobado|pendiente|rechazado&pedido=SD-…`) y el carro le muestra el resultado. Si el pago falla, puede intentarlo de nuevo; las unidades siguen reservadas.
2. Mercado Pago avisa cada pago a `api/mercadopago.js`, que consulta el pago directamente en Mercado Pago y lo anota en `data/pagos.csv` (pedido, fecha, id del pago, estado, detalle, monto y medio de pago) con un commit `Pago SD-…: approved`.
3. Para saber si un pedido está pagado, busca su número en `data/pagos.csv`: `approved` es pagado; `pending` o `in_process` está en proceso; `rejected` o `cancelled` no se pagó. También lo ves en tu cuenta de Mercado Pago → Actividad, con el número del pedido como referencia.

Los pedidos rechazados o sin pagar mantienen el stock reservado: para liberarlo, súbelo a mano en `data/inventario.csv`.

### Configuración (una sola vez)

1. Entra a [Mercado Pago Developers → Tus integraciones](https://www.mercadopago.cl/developers/panel/app), crea una aplicación (producto **Pagos online → Checkout Pro**) y copia el **Access Token** de *Credenciales de producción*. Para probar sin cobrar, usa el de *Credenciales de prueba* (empieza con `TEST-`).
2. En Vercel → Settings → Environment Variables agrega `MP_ACCESS_TOKEN` con ese token (Production).
3. Opcional, recomendado: en tu aplicación de Mercado Pago → Webhooks, configura la URL `https://<tu-dominio>/api/mercadopago` con el evento **Pagos**, copia la **clave secreta** y agrégala en Vercel como `MP_WEBHOOK_SECRET`. Así la tienda rechaza avisos que no vengan de Mercado Pago.
4. Opcional: si la tienda usa un dominio propio, agrega `SITE_URL` (por ejemplo `https://farmaciasandaniel.cl`) para que Mercado Pago devuelva al cliente a ese dominio.
5. Usa **Redeploy** en el último despliegue.

Sin `MP_ACCESS_TOKEN` el carro funciona como antes: reserva el pedido y lo envía por WhatsApp. El registro de pagos usa el mismo `GITHUB_TOKEN` de los pedidos.

## Página de cada producto

Cada producto tiene su propia página, con su enlace: `/#producto-` seguido del SKU en minúsculas, por ejemplo `/#producto-med-001`. Se abre al hacer clic en cualquier tarjeta del catálogo y muestra foto, precio por unidad, disponibilidad, cantidad, favoritos, descripción, ficha técnica, advertencias y productos relacionados. En vitaminas y suplementos agrega la información nutricional; en medicamentos, la información del medicamento.

Todo sale del inventario: la tabla nutricional muestra la porción, las porciones por envase y la cantidad de cada componente según `principio_activo` y `concentracion`. Las calorías y otros nutrientes no están en el CSV, por eso la página remite a la etiqueta del envase.

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

Las fotos actuales son imágenes referenciales tomadas de farmacias chilenas (Farmacias Ahumada y Dr. Simi). En muchos casos muestran otra marca o laboratorio con el mismo principio activo y concentración, por eso la página indica "Imagen referencial". El origen de cada foto está en `data/fotos_fuentes.csv`. Antes de abrir la tienda a clientes conviene reemplazarlas por fotos propias o entregadas por cada laboratorio.

## Cómo editar

1. Modifica `src.html` (textos, productos en la lista `P` del script, colores en `:root`).
2. Ejecuta `python3 build.py` (requiere Python 3).
3. Sube el `index.html` generado.

## Antes de publicar

Reemplaza los datos de ejemplo por los reales:

- Teléfono `600 260 1457` y WhatsApp `+56 9 2601 4578` (también en el enlace `wa.me/56926014578`).
- Direcciones de los locales, nombre del químico farmacéutico responsable y cifras ("27 años", "14 locales", reseñas).
- En `api/_lib/mercadopago.js`, `FREE` y `SHIP` (despacho gratis y su costo) deben coincidir con los del carro en `src.html`.
- Textos comerciales que no vienen del inventario: beneficios del Club San Daniel, 10% de descuento por suscribirse, despacho gratis sobre $29.990, entrega express, años, locales y reseñas.
