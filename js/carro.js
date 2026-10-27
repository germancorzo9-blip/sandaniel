/* =========================================================
   Farmacias San Daniel - carro de compras
   ========================================================= */
(function () {
  const { $, fmt, finalPrice, productArt, productUrl, card, cart, lineTotal, SHIPPING, MAX_QTY, showToast, initRails, COMMUNES } = SD;

  // Cupones de ejemplo para el prototipo
  const COUPONS = {
    BIENVENIDA10: { pct: 0.10, label: '10% de bienvenida' },
    SANDANIEL5: { pct: 0.05, label: '5% Club San Daniel' }
  };

  const state = {
    method: 'home',  // home | store | express
    coupon: null
  };

  /* ---------- Cálculos ---------- */
  function totals() {
    const items = cart.items();
    const normal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
    const offers = items.reduce((s, it) => s + (it.product.price - finalPrice(it.product)) * it.qty, 0);
    const subtotal = items.reduce((s, it) => s + lineTotal(it.product, it.qty), 0);
    const promos = normal - offers - subtotal;
    const coupon = state.coupon ? Math.round(subtotal * COUPONS[state.coupon].pct) : 0;
    const commune = $('#cartCommune').value;
    const expressOk = !commune || SHIPPING.expressCommunes.includes(commune);
    if (state.method === 'express' && !expressOk) state.method = 'home';
    const shipping =
      state.method === 'store' ? 0 :
      state.method === 'express' ? SHIPPING.express :
      subtotal >= SHIPPING.freeFrom ? 0 : SHIPPING.home;
    return { items, normal, offers, promos, subtotal, coupon, shipping, expressOk, commune, total: subtotal - coupon + shipping };
  }

  /* ---------- Render ---------- */
  function itemRow(it) {
    const p = it.product;
    const total = lineTotal(p, it.qty);
    const saved = p.price * it.qty - total;
    return `
      <li class="ci" data-id="${p.id}">
        <a href="${productUrl(p)}" class="ci__img" data-product="${p.id}" tabindex="-1" aria-hidden="true">${productArt(p)}</a>
        <div class="ci__info">
          <span class="card__brand">${p.brand}</span>
          <a href="${productUrl(p)}" class="ci__name" data-product="${p.id}">${p.name}</a>
          <span class="ci__format">${p.format}</span>
          <div class="ci__tags">
            ${p.type === 'Receta simple' ? '<span class="ptag ptag--rx">Receta simple</span>' : ''}
            ${p.promo ? '<span class="ptag ptag--promo">2da unidad 20% · 3ra 30%</span>' : ''}
          </div>
          <span class="ci__unit">
            ${p.offer ? `<s>${fmt(p.price)}</s> ` : ''}<b class="${p.offer ? 'is-offer' : ''}">${fmt(finalPrice(p))}</b> c/u
          </span>
        </div>
        <div class="ci__qty">
          <div class="qty qty--sm" role="group" aria-label="Cantidad de ${p.name}">
            <button type="button" data-step="-1" aria-label="Quitar una unidad" ${it.qty <= 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
            <input type="number" value="${it.qty}" min="1" max="${MAX_QTY}" aria-label="Cantidad" data-qty>
            <button type="button" data-step="1" aria-label="Agregar una unidad" ${it.qty >= MAX_QTY ? 'disabled' : ''}><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
          </div>
          ${it.qty >= MAX_QTY ? `<span class="ci__max">Máximo ${MAX_QTY} unidades</span>` : ''}
        </div>
        <div class="ci__total">
          <strong>${fmt(total)}</strong>
          ${saved > 0 ? `<span>Ahorras ${fmt(saved)}</span>` : ''}
        </div>
        <button class="ci__remove" data-remove="${p.id}" aria-label="Eliminar ${p.name}">
          <svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/></svg>
          <span>Eliminar</span>
        </button>
      </li>`;
  }

  function render() {
    const t = totals();
    const count = cart.count();
    const empty = t.items.length === 0;

    $('#cartLayout').hidden = empty;
    $('#cartEmpty').hidden = !empty;
    $('#cartbar').hidden = empty;
    document.body.classList.toggle('cart-is-empty', empty);
    $('#cartTitleCount').textContent = empty ? '' : `(${count} ${count === 1 ? 'producto' : 'productos'})`;
    $('#suggestTitle').textContent = empty ? 'Te puede interesar' : 'Agrega a tu compra';
    if (empty) return;

    $('#cartList').innerHTML = t.items.map(itemRow).join('');
    $('#cartRx').hidden = !t.items.some(it => it.product.type === 'Receta simple');

    // Progreso hacia el despacho gratis
    const missing = SHIPPING.freeFrom - t.subtotal;
    const pct = Math.min(100, (t.subtotal / SHIPPING.freeFrom) * 100);
    $('#shipProgress').innerHTML = `
      <div class="ship-progress__text">
        <svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>
        ${missing > 0
          ? `Te faltan <b>${fmt(missing)}</b> para tener <b>despacho gratis</b>`
          : '<b>¡Tienes despacho gratis a domicilio!</b>'}
      </div>
      <div class="ship-progress__bar" role="progressbar" aria-label="Avance hacia el despacho gratis" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}">
        <span style="width:${pct}%"></span>
      </div>`;
    $('#shipProgress').classList.toggle('is-done', missing <= 0);

    // Opciones de entrega
    const homeCost = t.subtotal >= SHIPPING.freeFrom ? 'Gratis' : fmt(SHIPPING.home);
    const opts = [
      { id: 'home', title: 'Despacho a domicilio', sub: t.commune ? `Llega a ${t.commune} en 1 a 2 días hábiles` : 'Llega en 1 a 3 días hábiles', cost: homeCost },
      { id: 'store', title: 'Retiro en tienda', sub: t.commune ? `En tu local de ${t.commune}, desde mañana` : 'Elige tu local en el siguiente paso', cost: 'Gratis' },
      { id: 'express', title: 'Despacho express', sub: t.expressOk ? 'Recíbelo hoy en menos de 2 horas' : `No disponible en ${t.commune}`, cost: fmt(SHIPPING.express), off: !t.expressOk }
    ];
    $('#shipOptions').innerHTML = opts.map(o => `
      <label class="ship-opt${o.off ? ' is-off' : ''}">
        <input type="radio" name="ship" value="${o.id}" ${state.method === o.id ? 'checked' : ''} ${o.off ? 'disabled' : ''}>
        <span class="radio__dot"></span>
        <span class="ship-opt__text"><strong>${o.title}</strong><span>${o.sub}</span></span>
        <b class="${o.cost === 'Gratis' ? 'is-free' : ''}">${o.off ? '' : o.cost}</b>
      </label>`).join('');

    // Resumen
    const row = (label, value, cls = '') => `<div class="${cls}"><dt>${label}</dt><dd>${value}</dd></div>`;
    $('#summaryRows').innerHTML =
      row(`Productos (${count})`, fmt(t.normal)) +
      (t.offers ? row('Descuento por ofertas', '-' + fmt(t.offers), 'is-save') : '') +
      (t.promos ? row('Promoción por unidades', '-' + fmt(t.promos), 'is-save') : '') +
      (t.coupon ? row(`Cupón ${state.coupon}`, '-' + fmt(t.coupon), 'is-save') : '') +
      row(state.method === 'store' ? 'Retiro en tienda' : 'Despacho', t.shipping ? fmt(t.shipping) : 'Gratis', t.shipping ? '' : 'is-free') +
      row('Total', fmt(t.total), 'is-total');

    const saved = t.offers + t.promos + t.coupon;
    $('#cartbarTotal').innerHTML = `<strong>${fmt(t.total)}</strong><span>${saved ? `Ahorras ${fmt(saved)}` : `${count} ${count === 1 ? 'producto' : 'productos'}`}</span>`;
  }

  /* ---------- Eventos de la lista ---------- */
  const list = $('#cartList');
  list.addEventListener('click', e => {
    const li = e.target.closest('.ci');
    if (!li) return;
    const id = +li.dataset.id;
    const step = e.target.closest('[data-step]');
    if (step) cart.set(id, cart.qtyOf(id) + +step.dataset.step);
    if (e.target.closest('[data-remove]')) removeItem(id);
  });
  list.addEventListener('change', e => {
    if (!e.target.matches('[data-qty]')) return;
    const id = +e.target.closest('.ci').dataset.id;
    const qty = parseInt(e.target.value, 10);
    cart.set(id, Number.isFinite(qty) && qty > 0 ? qty : 1);
  });

  // Eliminar con opción de deshacer
  let undoItems = null;
  function removeItem(id) {
    const p = PRODUCTS.find(x => x.id === id);
    undoItems = cart.items().map(({ id, qty }) => ({ id, qty }));
    cart.remove(id);
    showToast(`Eliminaste <b>${p.brand} ${p.name}</b> <button type="button" class="toast__link" data-undo>Deshacer</button>`);
  }
  $('#toast').addEventListener('click', e => {
    if (!e.target.closest('[data-undo]') || !undoItems) return;
    cart.restore(undoItems);
    undoItems = null;
    showToast('Listo, lo devolvimos a tu carro');
  });

  // Vaciar carro: pide confirmar con un segundo clic
  const clearBtn = $('#clearCart');
  let clearTimer;
  clearBtn.addEventListener('click', () => {
    if (!clearBtn.classList.contains('is-confirm')) {
      clearBtn.classList.add('is-confirm');
      clearBtn.querySelector('span').textContent = '¿Vaciar? Haz clic para confirmar';
      clearTimeout(clearTimer);
      clearTimer = setTimeout(resetClear, 3500);
      return;
    }
    resetClear();
    undoItems = cart.items().map(({ id, qty }) => ({ id, qty }));
    cart.restore([]);
    showToast('Vaciaste tu carro <button type="button" class="toast__link" data-undo>Deshacer</button>');
  });
  function resetClear() {
    clearBtn.classList.remove('is-confirm');
    clearBtn.querySelector('span').textContent = 'Vaciar carro';
  }

  /* ---------- Entrega y comuna ---------- */
  const communeSel = $('#cartCommune');
  communeSel.insertAdjacentHTML('beforeend', COMMUNES.map(c => `<option>${c}</option>`).join(''));
  communeSel.value = SD.getCommune();
  communeSel.addEventListener('change', () => SD.setCommune(communeSel.value));
  document.addEventListener('sd:commune', e => { communeSel.value = e.detail; render(); });

  $('#shipOptions').addEventListener('change', e => {
    if (e.target.name === 'ship') { state.method = e.target.value; render(); }
  });

  /* ---------- Cupón ---------- */
  $('#couponForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#couponInput');
    const msg = $('#couponMsg');
    const code = input.value.trim().toUpperCase();
    if (!code) {
      msg.className = 'coupon__msg is-error';
      msg.textContent = 'Escribe el código de tu cupón.';
      return;
    }
    if (!COUPONS[code]) {
      msg.className = 'coupon__msg is-error';
      msg.textContent = `El cupón ${code} no es válido o ya expiró. Revisa que esté bien escrito.`;
      return;
    }
    state.coupon = code;
    input.value = '';
    msg.className = 'coupon__msg is-ok';
    msg.innerHTML = `Cupón <b>${code}</b> aplicado: ${COUPONS[code].label}. <button type="button" id="couponRemove">Quitar</button>`;
    render();
  });
  $('#couponMsg').addEventListener('click', e => {
    if (e.target.id !== 'couponRemove') return;
    state.coupon = null;
    $('#couponMsg').textContent = '';
    render();
  });

  /* ---------- Continuar ---------- */
  const checkout = () => showToast('El paso de despacho y pago estará disponible pronto.');
  $('#checkoutBtn').addEventListener('click', checkout);
  $('#cartbarBtn').addEventListener('click', checkout);

  /* ---------- Sugerencias ---------- */
  const inCart = new Set(cart.items().map(it => it.id));
  const suggest = PRODUCTS.filter(p => p.offer && p.stock !== false && !inCart.has(p.id)).slice(0, 10);
  $('#railSuggest').innerHTML = suggest.map(card).join('');
  initRails();

  document.addEventListener('sd:cart', render);
  render();
})();
