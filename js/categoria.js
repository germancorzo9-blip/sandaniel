/* =========================================================
   Farmacias San Daniel - página de categoría (listado + filtros)
   ========================================================= */
(function () {
  const { $, fmt, discount, finalPrice, card, onClose, overlay } = SD;

  const PRICE_RANGES = [
    { id: 'p1', label: 'Menos de $5.000', min: 0, max: 4999 },
    { id: 'p2', label: '$5.000 - $10.000', min: 5000, max: 10000 },
    { id: 'p3', label: '$10.001 - $20.000', min: 10001, max: 20000 },
    { id: 'p4', label: 'Más de $20.000', min: 20001, max: Infinity },
    { id: 'all', label: 'Ver todos', min: 0, max: Infinity }
  ];
  const PROMOS = [
    { id: 'offer', label: 'Con descuento', test: p => !!p.offer },
    { id: 'units', label: '2da y 3ra unidad', test: p => !!p.promo }
  ];

  const state = {
    subcat: null,
    own: false,
    brands: new Set(),
    price: 'all',
    promos: new Set(),
    types: new Set(),
    query: '',
    sort: 'relevance',
    perPage: 24,
    page: 1
  };

  /* ---------- Qué listado mostrar: ?cat=, ?sub= y ?q= ---------- */
  // Si la URL perdió los parámetros al navegar, se usan los del último enlace elegido.
  let query = location.search.slice(1);
  try {
    if (!query) query = sessionStorage.getItem('sd-cat-query') || '';
    sessionStorage.removeItem('sd-cat-query');
    sessionStorage.removeItem('sd-query');
  } catch (err) { /* sin storage */ }
  const params = new URLSearchParams(query);
  const searchTerm = (params.get('q') || '').trim();
  const menuEntry = MENU.find(m => m.cat === params.get('cat'));
  const catKey = CATEGORIES[params.get('cat')] ? params.get('cat') : (searchTerm || menuEntry ? null : 'vitaminas');
  const config = catKey ? CATEGORIES[catKey] : null;
  const mode = config ? 'category' : searchTerm ? 'search' : 'soon';

  const CAT_PRODUCTS = mode === 'search' ? PRODUCTS
    : mode === 'category' ? PRODUCTS.filter(p => config.ownOnly ? p.own : p.cat === catKey)
    : [];
  const SUBCAT_ORDER = [...new Set([...(config ? config.subcats : []), ...CAT_PRODUCTS.map(p => p.subcat)])];
  const TYPES = ['Venta directa', 'Receta simple'].filter(t => CAT_PRODUCTS.some(p => p.type === t));

  if (searchTerm) {
    state.query = searchTerm.toLowerCase();
    $('#searchInput').value = searchTerm;
  }
  const sub = params.get('sub');
  if (sub && SUBCAT_ORDER.includes(sub)) state.subcat = sub;

  /* ---------- Cabecera de la página según la categoría ---------- */
  const pageName = mode === 'category' ? config.name : mode === 'search' ? `Resultados para “${searchTerm}”` : menuEntry.name;
  document.title = `${mode === 'search' ? 'Búsqueda' : pageName} | Farmacias San Daniel`;
  $('#catTitle').textContent = pageName;
  $('#catCrumbs').insertAdjacentHTML('beforeend',
    (config && config.parent ? `<span>/</span><a href="${SD.categoryUrl(catKey)}">${config.parent}</a>` : '') +
    `<span>/</span><span aria-current="page">${mode === 'search' ? 'Búsqueda' : pageName}</span>`);
  $('#catSeo').innerHTML = config ? `<p>${config.seo}</p>` : '';
  $('#catSeo').hidden = !config;

  function bannerArt(type) {
    if (type === 'boxes') return '<span class="b-box b-box--1"></span><span class="b-box b-box--2"></span><span class="b-box b-box--3"></span>';
    if (type === 'dermo') return '<span class="b-tube"></span><span class="b-jar"></span>';
    return '<span class="b-bottle b-bottle--1"></span><span class="b-bottle b-bottle--2"></span><span class="b-bottle b-bottle--3"></span>';
  }
  const bigText = b => b.unit ? `${b.big}<small>${b.unit}<em>dcto.</em></small>` : b.big;
  if (config) {
    const { main, side } = config.banners;
    $('#catBanners').innerHTML = `
      <a href="${SD.categoryUrl(catKey)}" class="banner banner--main">
        <div class="banner__text">
          <span class="banner__kicker">${main.kicker}</span>
          <span class="banner__sub">${main.sub}</span>
          <span class="banner__big${main.unit ? '' : ' banner__big--price'}">${bigText(main)}</span>
        </div>
        <div class="banner__badge"><strong>Cuídate</strong><span>y ahorra</span></div>
        <div class="banner__art banner__art--${main.art}" aria-hidden="true">${bannerArt(main.art)}</div>
      </a>
      <a href="${SD.categoryUrl(catKey)}" class="banner banner--side">
        <div class="banner__badge banner__badge--light"><strong>Cuídate</strong><span>y ahorra</span></div>
        <span class="banner__kicker">${side.kicker}</span>
        <span class="banner__big banner__big--sm">${bigText(side)}</span>
      </a>`;
  }
  $('#catBanners').hidden = !config;

  // En la página de marca propia el filtro de marca propia sobra
  if (config && config.ownOnly) $('#ownBrand').closest('label').hidden = true;

  // Categoría del menú que todavía no tiene productos online
  if (mode === 'soon') {
    $('#catSoon').hidden = false;
    document.querySelector('.listing').hidden = true;
    document.querySelector('.listing-head__controls').hidden = true;
  }

  /* ---------- Filtros ---------- */
  const baseList = () => CAT_PRODUCTS.filter(p =>
    !state.query || (p.brand + ' ' + p.name).toLowerCase().includes(state.query));

  function applyFilters(list, skip) {
    const range = PRICE_RANGES.find(r => r.id === state.price);
    return list.filter(p => {
      if (skip !== 'subcat' && state.subcat && p.subcat !== state.subcat) return false;
      if (skip !== 'own' && state.own && !p.own) return false;
      if (skip !== 'brand' && state.brands.size && !state.brands.has(p.brand)) return false;
      if (skip !== 'price') { const f = finalPrice(p); if (f < range.min || f > range.max) return false; }
      if (skip !== 'promo' && state.promos.size && ![...state.promos].some(id => PROMOS.find(x => x.id === id).test(p))) return false;
      if (skip !== 'type' && state.types.size && !state.types.has(p.type)) return false;
      return true;
    });
  }

  const countBy = (list, fn) => list.reduce((m, p) => { const k = fn(p); m[k] = (m[k] || 0) + 1; return m; }, {});
  const checkbox = (name, value, label, count, checked) => `
    <label class="check${count ? '' : ' is-disabled'}">
      <input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''} ${count || checked ? '' : 'disabled'}>
      <span class="check__box"></span>${label}<span class="count">${count || 0}</span>
    </label>`;

  function renderFilters() {
    const base = baseList();

    // Categorías
    const catCounts = countBy(applyFilters(base, 'subcat'), p => p.subcat);
    const allCats = SUBCAT_ORDER;
    $('#filterCats').innerHTML = `
      <li><button class="${!state.subcat ? 'is-active' : ''}" data-cat="">Todas<span class="count">${applyFilters(base, 'subcat').length}</span></button></li>` +
      allCats.filter(c => catCounts[c]).map(c => `
      <li><button class="${state.subcat === c ? 'is-active' : ''}" data-cat="${c}">${c}<span class="count">${catCounts[c]}</span></button></li>`).join('');

    // Marca propia
    $('#ownBrand').checked = state.own;
    $('#ownBrandCount').textContent = applyFilters(base, 'own').filter(p => p.own).length;

    // Marcas
    const brandCounts = countBy(applyFilters(base, 'brand'), p => p.brand);
    const q = $('#brandSearch').value.trim().toLowerCase();
    const brands = [...new Set(CAT_PRODUCTS.map(p => p.brand))].sort().filter(b => b.toLowerCase().includes(q));
    $('#filterBrands').innerHTML = brands.map(b => checkbox('brand', b, b, brandCounts[b], state.brands.has(b))).join('')
      || '<p class="muted">Sin coincidencias</p>';

    // Precio
    const priceBase = applyFilters(base, 'price');
    $('#filterPrices').innerHTML = PRICE_RANGES.map(r => {
      const n = priceBase.filter(p => finalPrice(p) >= r.min && finalPrice(p) <= r.max).length;
      return `<label class="radio">
        <input type="radio" name="price" value="${r.id}" ${state.price === r.id ? 'checked' : ''}>
        <span class="radio__dot"></span>${r.label}${r.id !== 'all' ? `<span class="count">${n}</span>` : ''}
      </label>`;
    }).join('');

    // Promociones
    const promoBase = applyFilters(base, 'promo');
    $('#filterPromos').innerHTML = PROMOS.map(pr =>
      checkbox('promo', pr.id, pr.label, promoBase.filter(pr.test).length, state.promos.has(pr.id))).join('');

    // Tipo
    const typeCounts = countBy(applyFilters(base, 'type'), p => p.type);
    $('#filterTypes').innerHTML = TYPES.map(t =>
      checkbox('type', t, t, typeCounts[t], state.types.has(t))).join('');
  }

  /* ---------- Render principal ---------- */
  function sortList(list) {
    const s = [...list];
    switch (state.sort) {
      case 'price-asc': return s.sort((a, b) => finalPrice(a) - finalPrice(b));
      case 'price-desc': return s.sort((a, b) => finalPrice(b) - finalPrice(a));
      case 'discount': return s.sort((a, b) => discount(b) - discount(a));
      case 'name': return s.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      default: return s;
    }
  }

  function renderChips() {
    const chips = [];
    if (state.query) chips.push(['query', '', `“${state.query}”`]);
    if (state.subcat) chips.push(['subcat', '', state.subcat]);
    if (state.own) chips.push(['own', '', 'Marca San Daniel']);
    state.brands.forEach(b => chips.push(['brand', b, b]));
    if (state.price !== 'all') chips.push(['price', '', PRICE_RANGES.find(r => r.id === state.price).label]);
    state.promos.forEach(id => chips.push(['promo', id, PROMOS.find(x => x.id === id).label]));
    state.types.forEach(t => chips.push(['type', t, t]));
    $('#activeChips').innerHTML = chips.map(([k, v, l]) =>
      `<button class="chip" data-k="${k}" data-v="${v}">${l}<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`).join('');
  }

  function renderPagination(total) {
    const pages = Math.ceil(total / state.perPage);
    const nav = $('#pagination');
    if (pages <= 1) { nav.innerHTML = ''; return; }
    let html = `<button class="pg pg--arrow" data-p="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Página anterior"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button class="pg ${i === state.page ? 'is-active' : ''}" data-p="${i}">${i}</button>`;
    }
    html += `<button class="pg pg--next" data-p="${state.page + 1}" ${state.page === pages ? 'disabled' : ''}>Siguiente<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`;
    nav.innerHTML = html;
  }

  function render() {
    renderFilters();
    renderChips();
    const list = sortList(applyFilters(baseList()));
    const pages = Math.max(1, Math.ceil(list.length / state.perPage));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.perPage;
    const pageItems = list.slice(start, start + state.perPage);

    $('#grid').innerHTML = pageItems.map(card).join('');
    $('#empty').hidden = list.length > 0;
    $('#resultsCount').innerHTML = list.length
      ? `Mostrando <b>${start + 1}-${start + pageItems.length}</b> de <b>${list.length}</b> productos`
      : '0 productos';
    $('#applyFilters').textContent = `Ver ${list.length} resultados`;
    renderPagination(list.length);
  }

  /* ---------- Eventos ---------- */
  const filters = $('#filters');

  $('#filterCats').addEventListener('click', e => {
    const b = e.target.closest('button[data-cat]');
    if (!b) return;
    state.subcat = b.dataset.cat || null;
    state.page = 1;
    render();
  });

  filters.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'ownBrand') state.own = t.checked;
    else if (t.name === 'brand') t.checked ? state.brands.add(t.value) : state.brands.delete(t.value);
    else if (t.name === 'price') state.price = t.value;
    else if (t.name === 'promo') t.checked ? state.promos.add(t.value) : state.promos.delete(t.value);
    else if (t.name === 'type') t.checked ? state.types.add(t.value) : state.types.delete(t.value);
    else return;
    state.page = 1;
    render();
  });

  $('#brandSearch').addEventListener('input', renderFilters);

  function clearAll() {
    Object.assign(state, { subcat: null, own: false, price: 'all', query: mode === 'search' ? state.query : '', page: 1 });
    state.brands.clear(); state.promos.clear(); state.types.clear();
    $('#brandSearch').value = '';
    if (mode !== 'search') $('#searchInput').value = '';
    render();
  }
  $('#clearFilters').addEventListener('click', clearAll);
  $('#emptyClear').addEventListener('click', clearAll);

  $('#activeChips').addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    const { k, v } = c.dataset;
    if (k === 'query') { state.query = ''; $('#searchInput').value = ''; }
    if (k === 'subcat') state.subcat = null;
    if (k === 'own') state.own = false;
    if (k === 'brand') state.brands.delete(v);
    if (k === 'price') state.price = 'all';
    if (k === 'promo') state.promos.delete(v);
    if (k === 'type') state.types.delete(v);
    state.page = 1;
    render();
  });

  $('#sortBy').addEventListener('change', e => { state.sort = e.target.value; state.page = 1; render(); });
  $('#perPage').addEventListener('change', e => { state.perPage = +e.target.value; state.page = 1; render(); });

  $('#pagination').addEventListener('click', e => {
    const b = e.target.closest('.pg');
    if (!b || b.disabled) return;
    state.page = +b.dataset.p;
    render();
    $('.listing-head').scrollIntoView({ behavior: 'smooth' });
  });

  let searchTimer;
  $('#searchInput').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = e.target.value.trim().toLowerCase();
      state.page = 1;
      render();
    }, 200);
  });

  // Filtros en móvil
  function closeFilters() {
    if (!filters.classList.contains('is-open')) return;
    filters.classList.remove('is-open');
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
  }
  onClose(closeFilters);
  $('#openFilters').addEventListener('click', () => {
    filters.classList.add('is-open');
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
  });
  $('#closeFilters').addEventListener('click', closeFilters);
  $('#applyFilters').addEventListener('click', closeFilters);

  render();
})();
