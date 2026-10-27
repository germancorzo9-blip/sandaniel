/* =========================================================
   Farmacias San Daniel - componentes comunes
   (header, mega menú, tarjetas de producto, carro, toast)
   ========================================================= */
window.SD = (function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const fmt = n => '$' + Math.round(n).toLocaleString('es-CL');
  const discount = p => (p.offer ? Math.round((1 - p.offer / p.price) * 100) : 0);
  const finalPrice = p => p.offer || p.price;
  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;
  const CATEGORY_URL = 'categoria.html';
  const productUrl = p => 'producto.html?id=' + p.id;

  /* ---------- Imagen SVG de producto (placeholder) ---------- */
  function productArt(p) {
    const c = p.color;
    const label = p.brand.toUpperCase();
    // Texto corto que quepa en la etiqueta del envase
    const max = p.shape === 'tubo' ? 11 : 14;
    let short = '';
    for (const w of p.name.split(' ')) {
      if ((short + ' ' + w).trim().length > max) break;
      short = (short + ' ' + w).trim();
    }
    // Evitar que la etiqueta termine en una palabra suelta ("Aceite de")
    short = short.replace(/\s+(de|del|con|y|en|para|\+)$/i, '') || p.name.split(' ')[0];
    const text = (y, size = 10) => `
      <text x="100" y="${y}" text-anchor="middle" font-family="Montserrat,Arial" font-weight="800" font-size="${size}" fill="#fff">${label}</text>
      <text x="100" y="${y + 14}" text-anchor="middle" font-family="Montserrat,Arial" font-weight="600" font-size="${size * .82}" fill="#fff">${short}</text>`;
    const shapes = {
      frasco: `<rect x="74" y="28" width="52" height="24" rx="4" fill="#2f3a48"/>
        <rect x="58" y="50" width="84" height="128" rx="18" fill="#fff" stroke="#d9e1ea" stroke-width="2"/>
        <rect x="58" y="86" width="84" height="64" fill="${c}"/>
        <rect x="58" y="146" width="84" height="5" fill="#fff" opacity=".5"/>` + text(112),
      caja: `<path d="M48 64l16-14h104l-16 14z" fill="#eef2f6" stroke="#d9e1ea" stroke-width="2"/>
        <path d="M152 64l16-14v104l-16 14z" fill="${c}" opacity=".75"/>
        <rect x="48" y="64" width="104" height="104" fill="#fff" stroke="#d9e1ea" stroke-width="2"/>
        <rect x="48" y="96" width="104" height="44" fill="${c}"/>
        <circle cx="134" cy="80" r="7" fill="${c}" opacity=".35"/>` + text(115),
      tarro: `<rect x="46" y="38" width="108" height="28" rx="6" fill="#2f3a48"/>
        <rect x="42" y="62" width="116" height="116" rx="14" fill="#fff" stroke="#d9e1ea" stroke-width="2"/>
        <rect x="42" y="88" width="116" height="66" fill="${c}"/>` + text(117),
      tubo: `<rect x="80" y="22" width="40" height="20" rx="4" fill="#2f3a48"/>
        <rect x="70" y="40" width="60" height="140" rx="12" fill="#fff" stroke="#d9e1ea" stroke-width="2"/>
        <rect x="70" y="72" width="60" height="78" fill="${c}"/>` + text(106, 8),
      sobre: `<rect x="52" y="42" width="96" height="132" rx="6" fill="${c}"/>
        <path d="M52 52h96M52 164h96" stroke="#fff" stroke-dasharray="3 3" opacity=".7"/>
        <rect x="62" y="88" width="76" height="46" rx="6" fill="#fff" opacity=".2"/>` + text(110)
    };
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${p.brand} ${p.name}">
      <ellipse cx="100" cy="182" rx="62" ry="6" fill="#000" opacity=".06"/>
      ${shapes[p.shape] || shapes.frasco}
    </svg>`;
  }

  /* ---------- Tarjeta de producto ---------- */
  function card(p) {
    const d = discount(p);
    const per = finalPrice(p) / p.units;
    return `
      <article class="card${p.stock === false ? ' is-out' : ''}">
        ${p.promo ? `<div class="ribbon"><span><b>20%</b>2da unidad</span><span><b>30%</b>3ra unidad</span><span><b>40%</b>4ta unidad</span></div>` : ''}
        <a href="${productUrl(p)}" class="card__img" data-product="${p.id}">
          ${d ? `<span class="badge-off">-${d}%</span>` : ''}
          ${p.own ? `<span class="badge-own">Marca San Daniel</span>` : ''}
          ${p.stock === false ? `<span class="badge-out">Sin stock</span>` : ''}
          ${productArt(p)}
        </a>
        <div class="card__body">
          <span class="card__brand">${p.brand}</span>
          <a href="${productUrl(p)}" class="card__name" data-product="${p.id}">${p.name}</a>
          <span class="card__format">Formato: ${p.format}</span>
          ${p.offer ? `
            <span class="card__normal">Precio normal: <s>${fmt(p.price)}</s></span>
            <div class="card__price"><span class="tag-offer">Oferta</span><strong>${fmt(p.offer)}</strong></div>
          ` : `
            <span class="card__normal card__normal--empty">&nbsp;</span>
            <div class="card__price"><strong>${fmt(p.price)}</strong></div>
          `}
          <span class="card__unit">${fmt(per)} x ${p.unit}</span>
          <ul class="card__ship">
            <li><svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>Despacho a domicilio</li>
            <li><svg viewBox="0 0 24 24"><path d="M4 10l2-6h12l2 6M4 10v10h16V10M4 10h16M10 20v-5h4v5"/></svg>Retiro en tienda</li>
            ${p.type === 'Receta simple'
              ? `<li class="is-rx"><svg viewBox="0 0 24 24"><path d="M7 3h10v18H7z"/><path d="M10 8h4M12 6v4"/></svg>Requiere receta simple</li>`
              : `<li><svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>Despacho express</li>`}
          </ul>
          ${p.stock === false
            ? `<button class="btn-cart btn-cart--off" data-notify="${p.id}">Avísame cuando llegue</button>`
            : `<button class="btn-cart" data-id="${p.id}">Añadir al carro</button>`}
        </div>
      </article>`;
  }

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  function showToast(html) {
    toast.innerHTML = html;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
  }

  /* ---------- Overlay compartido (mega menú / paneles) ---------- */
  const overlay = $('#overlay');
  const closeHandlers = [];
  const onClose = fn => closeHandlers.push(fn);
  const closeAll = () => closeHandlers.forEach(fn => fn());
  overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* ---------- Mega menú ---------- */
  const megaMenu = $('#megaMenu');
  const menuBtn = $('#menuBtn');
  const megaCats = $('#megaCats');
  const megaPanel = $('#megaPanel');

  megaCats.innerHTML = MENU.map((c, i) => `
    <li>
      <button class="mega__cat" data-i="${i}">
        <svg viewBox="0 0 24 24" class="mega__icon">${ICONS[c.icon]}</svg>
        <span>${c.name}</span>
        <svg viewBox="0 0 24 24" class="mega__arrow"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    </li>`).join('');

  function showMegaPanel(i) {
    const cat = MENU[i];
    megaCats.querySelectorAll('.mega__cat').forEach(b => b.classList.toggle('is-active', +b.dataset.i === i));
    megaPanel.innerHTML = `
      <div class="mega__panel-head">
        <button class="mega__back" type="button" aria-label="Volver">
          <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <a href="${CATEGORY_URL}" class="mega__all">Ver todo ${cat.name}</a>
      </div>
      <div class="mega__groups">
        ${cat.groups.map(g => `
          <div class="mega__group">
            <a href="${CATEGORY_URL}" class="mega__group-title">${g.title}</a>
            ${g.items.map(it => `<a href="${CATEGORY_URL}">${it}</a>`).join('')}
          </div>`).join('')}
      </div>`;
    megaMenu.classList.add('has-panel');
  }
  function toggleMega(open) {
    const willOpen = open ?? megaMenu.hidden;
    megaMenu.hidden = !willOpen;
    overlay.hidden = !willOpen;
    menuBtn.setAttribute('aria-expanded', willOpen);
    menuBtn.classList.toggle('is-open', willOpen);
    if (willOpen && !isMobile()) showMegaPanel(3);
    if (willOpen && isMobile()) megaMenu.classList.remove('has-panel');
  }

  menuBtn.addEventListener('click', () => toggleMega());
  $('#burger').addEventListener('click', () => toggleMega(true));
  onClose(() => { if (!megaMenu.hidden) toggleMega(false); });
  megaCats.addEventListener('mouseover', e => {
    const b = e.target.closest('.mega__cat');
    if (b && !isMobile()) showMegaPanel(+b.dataset.i);
  });
  megaCats.addEventListener('click', e => {
    const b = e.target.closest('.mega__cat');
    if (b) showMegaPanel(+b.dataset.i);
  });
  megaPanel.addEventListener('click', e => {
    if (e.target.closest('.mega__back')) megaMenu.classList.remove('has-panel');
  });

  /* ---------- Comuna (header) ---------- */
  const COMMUNES = ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'Puente Alto', 'Vitacura', 'San Miguel'];
  let commune = '';
  try { commune = localStorage.getItem('sd-commune') || ''; } catch (err) { /* sin storage */ }
  const locationBtn = $('#locationBtn');
  const locationPop = $('#locationPop');

  function setCommune(value) {
    commune = value;
    try { localStorage.setItem('sd-commune', value); } catch (err) { /* sin storage */ }
    $('#locationLabel').textContent = value || 'Elige tu comuna';
    $('#locationList').querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b.dataset.c === value));
    document.dispatchEvent(new CustomEvent('sd:commune', { detail: value }));
  }
  function toggleLocation(open) {
    const willOpen = open ?? locationPop.hidden;
    locationPop.hidden = !willOpen;
    locationBtn.setAttribute('aria-expanded', willOpen);
  }
  $('#locationList').innerHTML = COMMUNES.map(c => `<button type="button" data-c="${c}">${c}</button>`).join('');
  locationBtn.addEventListener('click', e => { e.stopPropagation(); toggleLocation(); });
  $('#locationList').addEventListener('click', e => {
    const b = e.target.closest('button[data-c]');
    if (!b) return;
    setCommune(b.dataset.c);
    toggleLocation(false);
    showToast(`Mostrando despacho y stock para <b>${b.dataset.c}</b>`);
  });
  document.addEventListener('click', e => {
    if (!locationPop.hidden && !e.target.closest('.location-wrap')) toggleLocation(false);
  });
  onClose(() => toggleLocation(false));
  if (commune) setCommune(commune);

  /* ---------- Buscador ---------- */
  // Fuera de la página de categoría, buscar lleva al listado con el término.
  const searchInput = $('#searchInput');
  searchInput.closest('form').addEventListener('submit', e => {
    e.preventDefault();
    if (document.body.dataset.page === 'categoria') return;
    const q = searchInput.value.trim();
    try { sessionStorage.setItem('sd-query', q); } catch (err) { /* sin storage */ }
    location.href = CATEGORY_URL + (q ? '?q=' + encodeURIComponent(q) : '');
  });

  /* ---------- Precios y despacho compartidos ---------- */
  // Promo por unidades: 2da 20%, 3ra 30%, 4ta en adelante 40% de descuento.
  const UNIT_PROMO = [0, .2, .3, .4];
  function lineTotal(p, qty) {
    let total = 0;
    for (let i = 0; i < qty; i++) total += finalPrice(p) * (1 - (p.promo ? UNIT_PROMO[Math.min(i, 3)] : 0));
    return Math.round(total);
  }
  const SHIPPING = {
    freeFrom: 29990,
    home: 2990,
    express: 4990,
    expressCommunes: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Vitacura']
  };
  const MAX_QTY = 10;

  /* ---------- Carro (se guarda en este navegador) ---------- */
  let cartItems = [];
  try { cartItems = JSON.parse(localStorage.getItem('sd-cart')) || []; } catch (err) { cartItems = []; }
  cartItems = cartItems.filter(it => PRODUCTS.some(p => p.id === it.id && p.stock !== false));

  const cart = {
    items: () => cartItems.map(it => ({ ...it, product: PRODUCTS.find(p => p.id === it.id) })),
    count: () => cartItems.reduce((n, it) => n + it.qty, 0),
    qtyOf: id => (cartItems.find(it => it.id === id) || {}).qty || 0,
    set(id, qty) {
      qty = Math.max(0, Math.min(MAX_QTY, qty));
      const it = cartItems.find(x => x.id === id);
      if (!qty) cartItems = cartItems.filter(x => x.id !== id);
      else if (it) it.qty = qty;
      else cartItems.push({ id, qty });
      save();
    },
    remove(id) { cart.set(id, 0); },
    restore(items) { cartItems = items; save(); }
  };
  function save() {
    try { localStorage.setItem('sd-cart', JSON.stringify(cartItems)); } catch (err) { /* sin storage */ }
    renderCount(true);
    document.dispatchEvent(new CustomEvent('sd:cart'));
  }
  function renderCount(bump) {
    const count = $('#cartCount');
    count.textContent = cart.count();
    if (bump) { count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump'); }
  }
  renderCount(false);

  function addToCart(p, qty = 1) {
    const before = cart.qtyOf(p.id);
    cart.set(p.id, before + qty);
    const added = cart.qtyOf(p.id) - before;
    if (!added) {
      showToast(`Ya tienes el máximo de ${MAX_QTY} unidades de <b>${p.brand} ${p.name}</b> en tu carro`);
      return;
    }
    showToast(`<b>${added > 1 ? added + ' x ' : ''}${p.brand}</b> ${p.name} se agregó al carro <a href="carro.html" class="toast__link">Ver carro</a>`);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.btn-cart[data-id]');
    if (!b) return;
    addToCart(PRODUCTS.find(x => x.id === +b.dataset.id));
    b.classList.add('is-added');
    b.textContent = 'Agregado ✓';
    setTimeout(() => { b.classList.remove('is-added'); b.textContent = 'Añadir al carro'; }, 1400);
  });

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-notify]');
    if (!b) return;
    const p = PRODUCTS.find(x => x.id === +b.dataset.notify);
    showToast(`Te avisaremos cuando <b>${p.brand} ${p.name}</b> vuelva a estar disponible`);
  });

  // Recordar el producto elegido por si la URL pierde el ?id= al navegar
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-product]');
    if (!a) return;
    try { sessionStorage.setItem('sd-product', a.dataset.product); } catch (err) { /* sin storage */ }
  });

  /* ---------- Carruseles horizontales de productos ---------- */
  function initRails() {
    document.querySelectorAll('[data-rail]').forEach(rail => {
      const track = rail.querySelector('.rail__track');
      const prev = rail.querySelector('.rail__arrow--prev');
      const next = rail.querySelector('.rail__arrow--next');
      const step = () => track.clientWidth * 0.9;
      const update = () => {
        prev.disabled = track.scrollLeft <= 4;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      };
      prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ---------- Suscripción ---------- */
  $('#subscribeForm').addEventListener('submit', e => {
    e.preventDefault();
    e.target.reset();
    showToast('¡Gracias! Te avisaremos de nuestras promociones.');
  });

  return { $, fmt, discount, finalPrice, productArt, card, productUrl, addToCart, cart, lineTotal, SHIPPING, MAX_QTY, initRails, showToast, onClose, overlay, COMMUNES, getCommune: () => commune, setCommune };
})();
