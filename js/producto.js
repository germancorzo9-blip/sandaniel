/* =========================================================
   Farmacias San Daniel - detalle de producto
   ========================================================= */
(function () {
  const { $, fmt, discount, finalPrice, productArt, card, addToCart, showToast, initRails, lineTotal, SHIPPING, MAX_QTY } = SD;

  /* ---------- Producto a mostrar: ?id=, #id o el último elegido ---------- */
  function currentId() {
    const fromQuery = new URLSearchParams(location.search).get('id');
    const fromHash = location.hash.replace('#', '');
    let fromStorage = null;
    try { fromStorage = sessionStorage.getItem('sd-product'); } catch (err) { /* sin storage */ }
    return +(fromQuery || (/^\d+$/.test(fromHash) ? fromHash : '') || fromStorage || PRODUCTS[0].id);
  }
  const p = PRODUCTS.find(x => x.id === currentId()) || PRODUCTS[0];
  const sku = 'SD-' + String(p.id).padStart(5, '0');
  const isRx = p.type === 'Receta simple';
  const FREE_SHIPPING = SHIPPING.freeFrom;
  const plural = (unit, n) => n === 1 || unit === 'ml' ? unit : unit === 'porción' ? 'porciones' : unit + 's';

  document.title = `${p.brand} ${p.name} | Farmacias San Daniel`;

  /* ---------- Textos por subcategoría ---------- */
  const INFO = {
    'Vitamina C': {
      desc: 'La vitamina C contribuye al funcionamiento normal del sistema inmune y a la formación de colágeno. Además ayuda a proteger las células frente al daño oxidativo y mejora la absorción del hierro de los alimentos.',
      use: 'Adultos: 1 unidad al día, de preferencia junto a una comida. No superar la dosis diaria recomendada.',
      comp: ['Vitamina C (ácido ascórbico)', 'Zinc (citrato de zinc)', 'Agente de carga: celulosa microcristalina', 'Antiaglomerante: estearato de magnesio']
    },
    'Vitamina D': {
      desc: 'La vitamina D ayuda a mantener huesos y dientes en buen estado, favorece la absorción de calcio y contribuye al funcionamiento normal de los músculos y del sistema inmune. Es especialmente útil en los meses de menor exposición al sol.',
      use: 'Tomar 1 unidad al día junto a la comida principal, ya que se absorbe mejor con alimentos que contienen grasa.',
      comp: ['Vitamina D3 (colecalciferol)', 'Aceite de oliva extra virgen', 'Cápsula: gelatina bovina, glicerina, agua']
    },
    'Multivitamínicos': {
      desc: 'Fórmula completa de vitaminas y minerales que complementa tu alimentación diaria. Aporta energía, apoya las defensas y ayuda a reducir el cansancio y la fatiga.',
      use: 'Tomar 1 unidad al día con el desayuno y un vaso de agua.',
      comp: ['Vitaminas A, C, D3, E, K', 'Complejo B (B1, B2, B3, B5, B6, B12)', 'Ácido fólico', 'Hierro, zinc, magnesio, selenio']
    },
    'Suplementos minerales': {
      desc: 'Suplemento mineral de alta absorción que contribuye al funcionamiento normal del sistema nervioso y muscular, y a la disminución del cansancio y la fatiga.',
      use: 'Tomar 2 unidades al día, idealmente por la noche. Tragar con abundante agua.',
      comp: ['Mineral en forma quelada o de citrato', 'Vitamina B6 (piridoxina)', 'Cápsula vegetal: hidroxipropilmetilcelulosa']
    },
    'Omega 3 y aceites': {
      desc: 'Fuente de ácidos grasos esenciales EPA y DHA, que contribuyen al funcionamiento normal del corazón, del cerebro y de la visión. Aceite purificado y libre de metales pesados.',
      use: 'Adultos: 1 a 2 unidades al día junto a las comidas.',
      comp: ['Aceite de pescado concentrado', 'EPA (ácido eicosapentaenoico)', 'DHA (ácido docosahexaenoico)', 'Vitamina E como antioxidante']
    },
    'Colágeno': {
      desc: 'Colágeno hidrolizado de fácil absorción, combinado con vitamina C que contribuye a la formación normal de colágeno para el buen estado de piel, cabello, uñas y articulaciones.',
      use: 'Tomar 1 porción al día. Si es en polvo, disolver en 200 ml de agua, jugo o batido.',
      comp: ['Colágeno hidrolizado', 'Vitamina C', 'Ácido hialurónico', 'Saborizante natural']
    },
    'Probióticos': {
      desc: 'Combinación de cepas probióticas que ayudan a mantener el equilibrio de la flora intestinal y apoyan una digestión saludable.',
      use: 'Tomar 1 unidad al día, de preferencia en ayunas. Mantener refrigerado una vez abierto.',
      comp: ['Lactobacillus acidophilus', 'Bifidobacterium lactis', 'Lactobacillus rhamnosus', 'Prebiótico: inulina']
    },
    'Proteínas': {
      desc: 'Suplemento deportivo de alta calidad que contribuye al aumento y mantenimiento de la masa muscular. Ideal después del entrenamiento o como complemento de tu alimentación.',
      use: 'Mezclar 1 porción con 250 ml de agua o leche después de entrenar.',
      comp: ['Proteína de suero aislada', 'Cacao o saborizante natural', 'Edulcorante: sucralosa', 'Lecitina de girasol']
    },
    'Huesos y articulaciones': {
      desc: 'Fórmula pensada para el cuidado de huesos y articulaciones. Ayuda a mantener la movilidad y la salud del cartílago.',
      use: 'Tomar 2 unidades al día junto a las comidas, durante al menos 3 meses.',
      comp: ['Glucosamina', 'Condroitina', 'Calcio', 'Vitamina D3 y K2']
    },
    'Energía y vitalidad': {
      desc: 'Suplemento de origen natural que ayuda a combatir el cansancio y aporta energía para enfrentar el día con vitalidad.',
      use: 'Tomar 1 unidad al día por la mañana. No consumir de noche.',
      comp: ['Extracto vegetal estandarizado', 'Vitaminas del complejo B', 'Cápsula vegetal']
    },
    'Otras vitaminas': {
      desc: 'Vitamina esencial que contribuye al funcionamiento normal del organismo y a la reducción del cansancio y la fatiga.',
      use: 'Tomar 1 unidad al día o según indicación de tu médico.',
      comp: ['Principio activo indicado en el envase', 'Excipientes c.s.']
    }
  };
  const info = INFO[p.subcat] || INFO['Otras vitaminas'];

  /* ---------- Migas de pan ---------- */
  $('#pdpCrumbs').insertAdjacentHTML('beforeend',
    `<span>/</span><a href="categoria.html">${p.subcat}</a><span>/</span><span aria-current="page">${p.brand} ${p.name}</span>`);

  /* ---------- Galería ---------- */
  function contentArt() {
    const c = p.color;
    const u = p.unit;
    let piece;
    if (u === 'gomita') piece = (x, y) => `<path d="M${x - 14} ${y + 10}c0-16 6-24 14-24s14 8 14 24c0 6-6 8-14 8s-14-2-14-8z" fill="${c}" opacity=".9"/>`;
    else if (u === 'comprimido') piece = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="#d9e1ea" stroke-width="2"/><path d="M${x - 10} ${y}h20" stroke="#d9e1ea" stroke-width="2"/>`;
    else if (u === 'porción' || u === 'sobre') piece = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="${c}" opacity=".25"/><circle cx="${x - 4}" cy="${y - 3}" r="2" fill="${c}"/><circle cx="${x + 5}" cy="${y + 4}" r="2" fill="${c}"/>`;
    else piece = (x, y) => `<g transform="rotate(-30 ${x} ${y})"><rect x="${x - 18}" y="${y - 9}" width="36" height="18" rx="9" fill="#fff" stroke="#d9e1ea" stroke-width="2"/><path d="M${x - 9} ${y - 9}h9v18h-9a9 9 0 010-18z" fill="${c}"/></g>`;
    const spots = [[60, 70], [110, 60], [150, 85], [80, 115], [130, 120], [55, 150], [105, 160], [150, 150]];
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Contenido: ${p.format}">
      <rect x="20" y="30" width="160" height="150" rx="80" fill="${c}" opacity=".08"/>
      ${spots.map(([x, y]) => piece(x, y)).join('')}
    </svg>`;
  }
  const views = [
    { label: 'Envase', html: productArt(p) },
    { label: 'Etiqueta', html: productArt(p).replace('viewBox="0 0 200 200"', 'viewBox="40 70 120 100"') },
    { label: 'Contenido', html: contentArt() }
  ];
  const zoom = $('#zoom');
  $('#thumbs').innerHTML = views.map((v, i) => `
    <button class="thumb${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-label="Ver ${v.label.toLowerCase()}">${v.html}</button>`).join('');
  function showView(i) {
    zoom.innerHTML = views[i].html;
    document.querySelectorAll('.thumb').forEach((t, j) => t.classList.toggle('is-active', j === i));
  }
  $('#thumbs').addEventListener('click', e => {
    const t = e.target.closest('.thumb');
    if (t) showView(+t.dataset.i);
  });
  showView(0);

  const main = $('#galleryMain');
  main.addEventListener('mousemove', e => {
    const r = main.getBoundingClientRect();
    zoom.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    zoom.classList.add('is-zoomed');
  });
  main.addEventListener('mouseleave', () => zoom.classList.remove('is-zoomed'));

  const d = discount(p);
  $('#galleryBadges').innerHTML =
    (d ? `<span class="badge-off">-${d}%</span>` : '') +
    (p.own ? `<span class="badge-own">Marca San Daniel</span>` : '');

  /* ---------- Datos principales ---------- */
  $('#pdpBrand').textContent = p.brand;
  $('#pdpName').textContent = p.name;
  $('#pdpSku').textContent = 'Código: ' + sku;
  $('#pdpTags').innerHTML = `
    <span class="ptag">${p.format}</span>
    <span class="ptag ${isRx ? 'ptag--rx' : 'ptag--ok'}">${p.type}</span>
    ${p.offer ? '<span class="ptag ptag--offer">Oferta online</span>' : ''}`;
  $('#pdpRibbon').hidden = !p.promo;
  if (p.stock === false) {
    $('#pdpTags').insertAdjacentHTML('beforeend', '<span class="ptag ptag--out">Sin stock online</span>');
    document.querySelector('.buy__actions').innerHTML = `
      <button class="btn-add btn-add--notify" data-notify="${p.id}">Avísame cuando llegue</button>`;
    $('#buybarAdd').outerHTML = `<button class="btn-add btn-add--notify" data-notify="${p.id}">Avísame</button>`;
  }
  $('#pdpRx').hidden = !isRx;

  /* ---------- Precio y cantidad ---------- */
  const totalFor = qty => lineTotal(p, qty);

  const qtyInput = $('#qtyInput');
  const getQty = () => qtyInput ? Math.min(MAX_QTY, Math.max(1, parseInt(qtyInput.value, 10) || 1)) : 1;

  function renderPrice() {
    const qty = getQty();
    const total = totalFor(qty);
    const plain = finalPrice(p) * qty;
    const per = finalPrice(p) / p.units;
    $('#pdpPrice').innerHTML = `
      ${p.offer ? `<span class="price-box__normal">Precio normal <s>${fmt(p.price)}</s></span>` : ''}
      <div class="price-box__main">
        ${p.offer ? '<span class="tag-offer">Oferta</span>' : ''}
        <strong class="${p.offer ? 'is-offer' : ''}">${fmt(finalPrice(p))}</strong>
        ${p.offer ? `<span class="price-box__save">Ahorras ${fmt(p.price - p.offer)}</span>` : ''}
      </div>
      <span class="price-box__unit">${fmt(per)} x ${p.unit}</span>
      ${qty > 1 ? `
        <div class="price-box__total">
          <span>Total por ${qty} unidades</span>
          <strong>${fmt(total)}</strong>
          ${total < plain ? `<em>Ahorras ${fmt(plain - total)} con la promoción por unidades</em>` : ''}
        </div>` : ''}`;
    $('#buybarPrice').innerHTML = `<strong>${fmt(qty > 1 ? total : finalPrice(p))}</strong><span>${qty > 1 ? qty + ' unidades' : p.format}</span>`;
    if (p.stock !== false) {
      $('#qtyMinus').disabled = qty <= 1;
      $('#qtyPlus').disabled = qty >= MAX_QTY;
    }
    $('#qtyNote').textContent = p.stock === false ? '' : p.promo && qty === 1
      ? `Lleva 2 y pagas ${fmt(totalFor(2))} en total.`
      : qty >= MAX_QTY ? `Máximo ${MAX_QTY} unidades por compra.` : '';
    renderDelivery();
  }

  if (p.stock !== false) {
    $('#qtyMinus').addEventListener('click', () => { qtyInput.value = getQty() - 1; renderPrice(); });
    $('#qtyPlus').addEventListener('click', () => { qtyInput.value = getQty() + 1; renderPrice(); });
    qtyInput.addEventListener('change', () => { qtyInput.value = getQty(); renderPrice(); });

    const add = () => {
      addToCart(p, getQty());
      const btn = $('#addBtn');
      btn.classList.add('is-added');
      setTimeout(() => btn.classList.remove('is-added'), 1400);
    };
    $('#addBtn').addEventListener('click', add);
    $('#buybarAdd').addEventListener('click', add);

    $('#favBtn').addEventListener('click', e => {
      const b = e.currentTarget;
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on);
      showToast(on ? 'Guardado en tus favoritos' : 'Eliminado de tus favoritos');
    });
  }

  /* ---------- Opciones de entrega ---------- */
  const communeSelect = $('#communeSelect');
  communeSelect.value = SD.getCommune();
  communeSelect.addEventListener('change', () => SD.setCommune(communeSelect.value));
  document.addEventListener('sd:commune', e => { communeSelect.value = e.detail; renderDelivery(); });

  function renderDelivery() {
    if (p.stock === false) {
      $('#deliveryList').innerHTML = `<li class="is-off"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>
        <div><strong>Sin stock por ahora</strong><span>Déjanos tu aviso y te escribimos apenas vuelva a estar disponible.</span></div></li>`;
      return;
    }
    const commune = communeSelect.value;
    const total = totalFor(getQty());
    const freeShip = total >= FREE_SHIPPING;
    const ship = freeShip ? '<b class="is-free">Gratis</b>' : `<b>${fmt(SHIPPING.home)}</b>`;
    const missing = FREE_SHIPPING - total;
    const stores = commune ? ((p.id * 7 + commune.length * 3) % 5) + 1 : null;
    const express = !commune || SHIPPING.expressCommunes.includes(commune);

    const icon = {
      home: '<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>',
      store: '<svg viewBox="0 0 24 24"><path d="M4 10l2-6h12l2 6M4 10v10h16V10M4 10h16M10 20v-5h4v5"/></svg>',
      fast: '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>'
    };
    $('#deliveryList').innerHTML = `
      <li>
        ${icon.home}
        <div><strong>Despacho a domicilio</strong>
          <span>${commune ? `Llega a ${commune} en 1 a 2 días hábiles` : 'Llega en 1 a 3 días hábiles'}</span>
          ${!freeShip ? `<span class="delivery__hint">Te faltan ${fmt(missing)} para despacho gratis</span>` : ''}
        </div>
        ${ship}
      </li>
      <li>
        ${icon.store}
        <div><strong>Retiro en tienda</strong>
          <span>${commune ? `Disponible en ${stores} ${stores === 1 ? 'local' : 'locales'} de ${commune}` : 'Selecciona tu comuna para ver stock'}</span>
        </div>
        <b class="is-free">Gratis</b>
      </li>
      <li class="${express ? '' : 'is-off'}">
        ${icon.fast}
        <div><strong>Despacho express</strong>
          <span>${express ? 'Recíbelo hoy en menos de 2 horas' : `No disponible en ${commune}`}</span>
        </div>
        ${express ? `<b>${fmt(SHIPPING.express)}</b>` : ''}
      </li>`;
  }

  /* ---------- Pestañas ---------- */
  $('#panel-desc').innerHTML = `
    <p>${info.desc}</p>
    <ul class="checklist">
      <li>Formato: ${p.format}</li>
      <li>Rinde ${p.units} ${plural(p.unit, p.units)}</li>
      ${p.own ? '<li>Marca propia San Daniel, con la misma calidad a un mejor precio</li>' : ''}
    </ul>`;
  $('#panel-use').innerHTML = `<p>${info.use}</p><p class="muted-p">Mantener en un lugar fresco y seco, a menos de 25 °C y fuera del alcance de los niños.</p>`;
  $('#panel-comp').innerHTML = `<p>Cada ${p.unit} contiene:</p><ul class="checklist">${info.comp.map(c => `<li>${c}</li>`).join('')}</ul>`;
  $('#panel-warn').innerHTML = isRx
    ? `<p>Medicamento de venta bajo receta médica simple. No exceder la dosis indicada por tu médico. Ante cualquier reacción adversa, suspende su uso y consulta a un profesional de la salud.</p>`
    : `<p>Este suplemento alimentario no es un medicamento y no reemplaza una alimentación equilibrada. No superar la dosis diaria recomendada. Embarazadas, mujeres en período de lactancia y personas en tratamiento médico deben consultar a su médico antes de consumirlo.</p>`;
  $('#panel-spec').innerHTML = `
    <table class="spec">
      <tr><th>Marca</th><td>${p.brand}</td></tr>
      <tr><th>Formato</th><td>${p.format}</td></tr>
      <tr><th>Contenido</th><td>${p.units} ${plural(p.unit, p.units)}</td></tr>
      <tr><th>Categoría</th><td>Vitaminas y suplementos / ${p.subcat}</td></tr>
      <tr><th>Tipo de venta</th><td>${p.type}</td></tr>
      <tr><th>Marca propia</th><td>${p.own ? 'Sí' : 'No'}</td></tr>
      <tr><th>Código</th><td>${sku}</td></tr>
    </table>`;

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }
  $('#tabs').addEventListener('click', e => {
    const t = e.target.closest('[role="tab"]');
    if (t) selectTab(t);
  });
  $('#tabs').addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length]);
    if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length]);
  });

  $('#reviewBtn').addEventListener('click', () => showToast('Inicia sesión para escribir tu opinión.'));

  /* ---------- Relacionados ---------- */
  const related = [
    ...PRODUCTS.filter(x => x.id !== p.id && x.subcat === p.subcat),
    ...PRODUCTS.filter(x => x.id !== p.id && x.subcat !== p.subcat && x.brand === p.brand),
    ...PRODUCTS.filter(x => x.id !== p.id && x.subcat !== p.subcat && x.brand !== p.brand && x.offer)
  ].slice(0, 10);
  $('#railRelated').innerHTML = related.map(card).join('');

  initRails();

  renderPrice();
})();
