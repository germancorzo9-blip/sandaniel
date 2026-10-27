/* =========================================================
   Farmacias San Daniel - página de inicio
   ========================================================= */
(function () {
  const { $, card, discount, initRails } = SD;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Carrusel principal ---------- */
  const slides = [...document.querySelectorAll('#heroTrack .slide')];
  const dots = $('#heroDots');
  let current = 0;
  let timer;

  dots.innerHTML = slides.map((_, i) =>
    `<button class="hero__dot${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-label="Ir a la promoción ${i + 1}"></button>`).join('');

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === current));
    dots.querySelectorAll('.hero__dot').forEach((d, j) => d.classList.toggle('is-active', j === current));
  }
  function play() {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }
  $('#heroPrev').addEventListener('click', () => { goTo(current - 1); play(); });
  $('#heroNext').addEventListener('click', () => { goTo(current + 1); play(); });
  dots.addEventListener('click', e => {
    const d = e.target.closest('.hero__dot');
    if (d) { goTo(+d.dataset.i); play(); }
  });
  const hero = $('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', play);

  // Deslizar con el dedo en móvil
  let touchX = null;
  hero.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); play(); }
    touchX = null;
  });
  play();

  /* ---------- Categorías ---------- */
  $('#catGrid').innerHTML = MENU.map(c => `
    <a href="${SD.categoryUrl(c.cat)}" class="cat">
      <span class="cat__icon"><svg viewBox="0 0 24 24">${ICONS[c.icon]}</svg></span>
      <span class="cat__name">${c.name}</span>
    </a>`).join('');

  /* ---------- Carruseles de productos ---------- */
  const topOffers = cat => PRODUCTS.filter(p => p.offer && p.cat === cat && p.stock !== false).sort((a, b) => discount(b) - discount(a));
  const [v, m, r] = ['vitaminas', 'medicamentos', 'rostro'].map(topOffers);
  const offers = Array.from({ length: 4 }, (_, i) => [v[i], r[i], m[i]]).flat().filter(Boolean).slice(0, 10);
  const bestIds = [2, 40, 62, 5, 43, 9, 64, 21, 47, 12];
  const best = bestIds.map(id => PRODUCTS.find(p => p.id === id));
  $('#railOffers').innerHTML = offers.map(card).join('');
  $('#railBest').innerHTML = best.map(card).join('');

  initRails();

  /* ---------- Cuenta regresiva: las ofertas terminan el domingo 23:59 ---------- */
  function endOfWeek() {
    const d = new Date();
    const daysToSunday = (7 - d.getDay()) % 7;
    d.setDate(d.getDate() + daysToSunday);
    d.setHours(23, 59, 59, 999);
    return d;
  }
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    let ms = Math.max(0, endOfWeek() - new Date());
    const days = Math.floor(ms / 864e5); ms -= days * 864e5;
    const hours = Math.floor(ms / 36e5); ms -= hours * 36e5;
    const mins = Math.floor(ms / 6e4); ms -= mins * 6e4;
    $('#cdDays').textContent = days;
    $('#cdHours').textContent = pad(hours);
    $('#cdMins').textContent = pad(mins);
    $('#cdSecs').textContent = pad(Math.floor(ms / 1000));
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Marcas ---------- */
  const brands = [...new Set(PRODUCTS.map(p => p.brand))].slice(0, 16);
  $('#brandRow').innerHTML = brands.map(b => {
    const p = PRODUCTS.find(x => x.brand === b);
    return `<a href="${SD.categoryUrl(p.cat)}" class="brand" style="--c:${p.color}">${b}</a>`;
  }).join('');
})();
