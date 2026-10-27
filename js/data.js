/* =========================================================
   Datos de ejemplo: categorías del mega menú y productos.
   Reemplazar por datos reales (API / CMS) más adelante.
   ========================================================= */

const ICONS = {
  dermo: '<path d="M8 3h5v4H8zM7 7h7v14H7zM16 11h4v10h-4zM17 8h2v3h-2z"/>',
  meds: '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.5 8.3l5 7.4" />',
  personal: '<path d="M6 21l5-9M11 12l7-7 2 2-7 7zM13 4l2 2"/>',
  vitamins: '<rect x="6" y="7" width="12" height="14" rx="2"/><path d="M8 3h8v4H8zM9 12h6M12 10v6"/>',
  beauty: '<circle cx="12" cy="9" r="5"/><path d="M5 21c1-4 4-6 7-6s6 2 7 6M9 8.5h.01M15 8.5h.01"/>',
  baby: '<circle cx="12" cy="12" r="8"/><path d="M9 11h.01M15 11h.01M9.5 15a3.5 3.5 0 005 0M12 4c-1 1.5 0 3 1.5 2.5"/>',
  health: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/><path d="M3 21c3-3 6-3 9-3s6 0 9 3"/>',
  senior: '<circle cx="8" cy="6" r="2.5"/><circle cx="16" cy="6" r="2.5"/><path d="M4 21v-6a4 4 0 018 0v6M12 21v-6a4 4 0 018 0v6"/>',
  pets: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M10.5 14.5h3"/>',
  exclusive: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'
};

const MENU = [
  { name: 'Dermocosmética', cat: 'rostro', icon: 'dermo', groups: [
    { title: 'Rostro', items: ['Limpieza', 'Hidratación', 'Antiedad', 'Sérum', 'Contorno de ojos'] },
    { title: 'Protección solar', items: ['Rostro', 'Cuerpo', 'Niños', 'After sun'] },
    { title: 'Cuerpo', items: ['Cremas corporales', 'Piel atópica', 'Antiestrías'] },
    { title: 'Cabello', items: ['Shampoo dermatológico', 'Anticaída', 'Tratamientos'] }
  ]},
  { name: 'Medicamentos', cat: 'medicamentos', icon: 'meds', groups: [
    { title: 'Anticonceptivos y hormonas', items: ['Oral', 'No oral', 'Urinarios', 'Hormonas', 'Infecciones', 'Embarazo'] },
    { title: 'Sistema nervioso', items: ['Antiepiléptico', 'Antidepresivos', 'Antipsicóticos', 'Hipnóticos y ansiolíticos', 'Tranquilizantes'] },
    { title: 'Sistema cardiovascular', items: ['Cardiovascular', 'Antianémicos', 'Antihipertensivos', 'Colesterol', 'Toma presión', 'Várices'] },
    { title: 'Sistema respiratorio y alergias', items: ['Resfrío y gripe', 'Antialérgicos', 'Descongestionantes', 'Antiasmáticos', 'Antivirales'] },
    { title: 'Sistema digestivo', items: ['Antidiarreicos', 'Laxantes', 'Antiácidos', 'Antiulcerosos', 'Antinauseosos', 'Hemorroides'] },
    { title: 'Dolor, fiebre y antiinflamatorios', items: ['Analgésico tópico', 'Antigripales', 'Analgésico general', 'Dolor de cabeza', 'Antibióticos', 'Antiinflamatorio'] }
  ]},
  { name: 'Cuidado personal', cat: 'cuidado-personal', icon: 'personal', groups: [
    { title: 'Higiene', items: ['Desodorantes', 'Jabones', 'Shampoo', 'Acondicionador'] },
    { title: 'Cuidado bucal', items: ['Pastas dentales', 'Cepillos', 'Enjuagues', 'Hilo dental'] },
    { title: 'Afeitado', items: ['Máquinas', 'Espumas', 'Depilación'] }
  ]},
  { name: 'Vitaminas y suplementos', cat: 'vitaminas', icon: 'vitamins', groups: [
    { title: 'Vitaminas y minerales', items: ['Vitamina C', 'Vitamina D', 'Multivitamínicos', 'Suplementos minerales', 'Otras vitaminas'] },
    { title: 'Suplementos alimenticios', items: ['Dieta', 'Energía y vitalidad', 'Vida fitness', 'Salud y bienestar', 'Huesos y articulaciones', 'Probióticos'] },
    { title: 'Nutrición deportiva', items: ['Proteínas', 'Omega 3 y aceites', 'Creatina', 'Suplementos deportivos'] },
    { title: 'Vida deportiva', items: ['Colágeno', 'Vendas', 'Compresas frías y calientes', 'Relajantes musculares', 'Masajeadores'] },
    { title: 'Alimentación y bebidas nutricionales', items: ['Leche y fórmulas', 'Té variedades', 'Barras proteicas', 'Bebidas energéticas', 'Endulzantes', 'Aguas minerales'] }
  ]},
  { name: 'Belleza', cat: 'belleza', icon: 'beauty', groups: [
    { title: 'Maquillaje', items: ['Rostro', 'Ojos', 'Labios', 'Uñas'] },
    { title: 'Fragancias', items: ['Mujer', 'Hombre', 'Colonias'] },
    { title: 'Accesorios', items: ['Brochas', 'Esponjas', 'Organizadores'] }
  ]},
  { name: 'Infantil y mamá', cat: 'infantil', icon: 'baby', groups: [
    { title: 'Bebé', items: ['Pañales', 'Toallitas húmedas', 'Cremas', 'Colonias'] },
    { title: 'Alimentación', items: ['Fórmulas lácteas', 'Mamaderas', 'Chupetes'] },
    { title: 'Mamá', items: ['Embarazo', 'Lactancia', 'Cuidado post parto'] }
  ]},
  { name: 'Cuidado de la salud', cat: 'salud', icon: 'health', groups: [
    { title: 'Primeros auxilios', items: ['Curitas', 'Gasas', 'Antisépticos', 'Termómetros'] },
    { title: 'Control', items: ['Glucómetros', 'Tiras reactivas', 'Toma presión'] },
    { title: 'Ortopedia', items: ['Rodilleras', 'Muñequeras', 'Fajas'] }
  ]},
  { name: 'Adulto mayor', cat: 'adulto-mayor', icon: 'senior', groups: [
    { title: 'Incontinencia', items: ['Pañales adulto', 'Apósitos', 'Sabanillas'] },
    { title: 'Movilidad', items: ['Bastones', 'Andadores', 'Sillas de ruedas'] },
    { title: 'Nutrición', items: ['Suplementos', 'Espesantes'] }
  ]},
  { name: 'Mascotas', cat: 'mascotas', icon: 'pets', groups: [
    { title: 'Perros', items: ['Antiparasitarios', 'Suplementos', 'Higiene'] },
    { title: 'Gatos', items: ['Antiparasitarios', 'Suplementos', 'Higiene'] }
  ]},
  { name: 'Marcas exclusivas', cat: 'marca-san-daniel', icon: 'exclusive', groups: [
    { title: 'Marca San Daniel', items: ['Vitaminas', 'Cuidado personal', 'Primeros auxilios'] }
  ]}
];

/*
  Categorías con listado propio. La página categoria.html?cat=<clave> usa esta configuración.
  banners.art: bottles | boxes | dermo
*/
const CATEGORIES = {
  vitaminas: {
    name: 'Vitaminas y Suplementos',
    subcats: ['Vitamina C', 'Vitamina D', 'Multivitamínicos', 'Suplementos minerales', 'Otras vitaminas', 'Omega 3 y aceites',
      'Colágeno', 'Probióticos', 'Proteínas', 'Huesos y articulaciones', 'Energía y vitalidad'],
    banners: {
      main: { kicker: 'Suplementos deportivos', sub: 'Productos seleccionados', big: '20', unit: '%', art: 'bottles' },
      side: { kicker: 'Especial Omega 3', big: '30', unit: '%' }
    },
    seo: 'En <strong>Farmacias San Daniel</strong> encontrarás una amplia variedad de <strong>vitaminas y suplementos</strong> para acompañar tu bienestar: multivitamínicos, vitamina C, vitamina D, omega 3, colágeno, magnesio, probióticos y nutrición deportiva. Compra online con despacho a domicilio o retira en tu local más cercano. Recuerda que los suplementos no reemplazan una alimentación equilibrada; ante cualquier duda, consulta con tu médico o con nuestro químico farmacéutico.'
  },
  medicamentos: {
    name: 'Medicamentos',
    subcats: ['Dolor y fiebre', 'Antiinflamatorios', 'Resfrío y gripe', 'Antialérgicos', 'Sistema digestivo',
      'Cardiovascular', 'Colesterol', 'Diabetes', 'Hormonas', 'Anticonceptivos', 'Sistema nervioso'],
    banners: {
      main: { kicker: 'Medicamentos para tu bienestar', sub: 'Marcas y bioequivalentes seleccionados', big: '30', unit: '%', art: 'boxes' },
      side: { kicker: 'Bioequivalentes', big: '25', unit: '%' }
    },
    seo: 'En <strong>Farmacias San Daniel</strong> encontrarás <strong>medicamentos</strong> para el dolor y la fiebre, resfrío y gripe, alergias, sistema digestivo, cardiovascular y más, junto a alternativas <strong>bioequivalentes</strong> con el mismo principio activo a un mejor precio. Los medicamentos con receta requieren que adjuntes la receta médica al comprar; nuestro químico farmacéutico la validará antes del despacho. Lee siempre las instrucciones del folleto y, si los síntomas persisten, consulta a tu médico.'
  },
  rostro: {
    name: 'Rostro',
    parent: 'Dermocosmética',
    subcats: ['Limpieza', 'Hidratación', 'Sérum', 'Antiedad', 'Contorno de ojos', 'Protección solar'],
    banners: {
      main: { kicker: 'Sérum vitamina C 15%', sub: 'Luminosidad y antioxidante · 30 ml', big: '$19.990', unit: '', art: 'dermo' },
      side: { kicker: 'Protección solar facial', big: '20', unit: '%' }
    },
    seo: 'Cuida tu piel con la selección de <strong>dermocosmética para el rostro</strong> de <strong>Farmacias San Daniel</strong>: limpiadores, hidratantes, sérums, tratamientos antiedad, contorno de ojos y protección solar. Si tienes dudas sobre qué producto usar según tu tipo de piel, consulta con nuestro equipo o con tu dermatólogo.'
  },
  'marca-san-daniel': {
    name: 'Marca San Daniel',
    ownOnly: true,
    subcats: [],
    banners: {
      main: { kicker: 'Marca San Daniel', sub: 'Calidad garantizada a un precio justo', big: '-30', unit: '%', art: 'bottles' },
      side: { kicker: 'Vitaminas marca propia', big: '20', unit: '%' }
    },
    seo: 'Los productos <strong>Marca San Daniel</strong> son elaborados por laboratorios certificados con los mismos estándares de calidad que las marcas tradicionales, a un precio más conveniente.'
  }
};


/*
  shape: frasco | caja | tarro | tubo | sobre
  promo: true => cinta "2da / 3ra unidad"
  stock: false => producto agotado
  cat: clave de CATEGORIES (por defecto 'vitaminas')
  bioeq: true => medicamento bioequivalente
  club: precio exclusivo socios Club San Daniel
  type:  'Venta directa' | 'Receta simple'
*/
const PRODUCTS = [
  { id: 1,  brand: 'NutriAndes', name: 'Colágeno hidrolizado con vitamina C sabor frutilla', format: '60 gomitas', units: 60, unit: 'gomita', price: 17990, offer: 13379, subcat: 'Colágeno', shape: 'frasco', color: '#e94b7a', type: 'Venta directa', promo: false, club: 12629 },
  { id: 2,  brand: 'PureOmega', name: 'Omega 3 ultra puro alta concentración EPA DHA', format: '60 cápsulas blandas', units: 60, unit: 'cápsula', price: 27990, offer: 21590, subcat: 'Omega 3 y aceites', shape: 'frasco', color: '#1d6fbe', type: 'Venta directa', promo: false, club: 19990 },
  { id: 3,  brand: 'NutriAndes', name: 'Vitamina B complejo + B12 activa', format: '90 cápsulas', units: 90, unit: 'cápsula', price: 13699, offer: null, subcat: 'Multivitamínicos', shape: 'frasco', color: '#7a4fd0', type: 'Venta directa', promo: true },
  { id: 4,  brand: 'BioVital', name: 'Vitamina C 1000 mg + zinc efervescente', format: '20 comprimidos', units: 20, unit: 'comprimido', price: 9990, offer: 6990, subcat: 'Vitamina C', shape: 'tubo', color: '#f08a1c', type: 'Venta directa', promo: false },
  { id: 5,  brand: 'San Daniel', name: 'Vitamina D3 2000 UI', format: '60 cápsulas blandas', units: 60, unit: 'cápsula', price: 8990, offer: null, subcat: 'Vitamina D', shape: 'frasco', color: '#d0142c', type: 'Venta directa', promo: false, own: true },
  { id: 6,  brand: 'Vitanova', name: 'Multivitamínico mujer A-Z con hierro y ácido fólico', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 15990, offer: null, subcat: 'Multivitamínicos', shape: 'caja', color: '#c2357e', type: 'Venta directa', promo: true },
  { id: 7,  brand: 'BioVital', name: 'Magnesio citrato + vitamina B6', format: '120 cápsulas', units: 120, unit: 'cápsula', price: 21990, offer: null, subcat: 'Suplementos minerales', shape: 'frasco', color: '#14a37f', type: 'Venta directa', promo: false },
  { id: 8,  brand: 'Naturalia', name: 'Probiótico 10 cepas 20 mil millones UFC', format: '30 cápsulas', units: 30, unit: 'cápsula', price: 24990, offer: 19990, subcat: 'Probióticos', shape: 'caja', color: '#2b9fd6', type: 'Venta directa', promo: false },
  { id: 9,  brand: 'ActiveFit', name: 'Proteína whey isolate sabor vainilla', format: '908 g', units: 30, unit: 'porción', price: 44990, offer: 35990, subcat: 'Proteínas', shape: 'tarro', color: '#1b2f57', type: 'Venta directa', promo: false, club: 32990 },
  { id: 10, brand: 'San Daniel', name: 'Vitamina C 500 mg masticable sabor naranja', format: '100 comprimidos', units: 100, unit: 'comprimido', price: 5490, offer: null, subcat: 'Vitamina C', shape: 'frasco', color: '#d0142c', type: 'Venta directa', promo: true, own: true },
  { id: 11, brand: 'Vitanova', name: 'Glucosamina + condroitina + MSM', format: '90 comprimidos', units: 90, unit: 'comprimido', price: 23990, offer: 17990, subcat: 'Huesos y articulaciones', shape: 'frasco', color: '#4a6fd8', type: 'Venta directa', promo: false },
  { id: 12, brand: 'Kidsvit', name: 'Multivitamínico infantil gomitas ositos', format: '60 gomitas', units: 60, unit: 'gomita', price: 12990, offer: 9990, subcat: 'Multivitamínicos', shape: 'tarro', color: '#f5b400', type: 'Venta directa', promo: false },
  { id: 13, brand: 'PureOmega', name: 'Aceite de krill antártico 500 mg', format: '60 cápsulas blandas', units: 60, unit: 'cápsula', price: 32990, offer: null, subcat: 'Omega 3 y aceites', shape: 'frasco', color: '#c0392b', type: 'Venta directa', promo: true, stock: false },
  { id: 14, brand: 'Naturalia', name: 'Colágeno marino en polvo sin sabor', format: '300 g', units: 30, unit: 'porción', price: 26990, offer: 21590, subcat: 'Colágeno', shape: 'tarro', color: '#3aa6b9', type: 'Venta directa', promo: false },
  { id: 15, brand: 'BioVital', name: 'Calcio + vitamina D3 + K2', format: '60 comprimidos', units: 60, unit: 'comprimido', price: 11490, offer: null, subcat: 'Huesos y articulaciones', shape: 'caja', color: '#1d6fbe', type: 'Venta directa', promo: false },
  { id: 16, brand: 'ActiveFit', name: 'Creatina monohidratada micronizada', format: '300 g', units: 60, unit: 'porción', price: 22990, offer: 18390, subcat: 'Proteínas', shape: 'tarro', color: '#e0472b', type: 'Venta directa', promo: false },
  { id: 17, brand: 'Vitanova', name: 'Ginseng + jalea real energía', format: '30 ampollas bebibles', units: 30, unit: 'ampolla', price: 18990, offer: null, subcat: 'Energía y vitalidad', shape: 'caja', color: '#d48b12', type: 'Venta directa', promo: true },
  { id: 18, brand: 'NutriAndes', name: 'Hierro bisglicinato + vitamina C', format: '60 cápsulas', units: 60, unit: 'cápsula', price: 10990, offer: 8790, subcat: 'Suplementos minerales', shape: 'frasco', color: '#8f0d0d', type: 'Venta directa', promo: false },
  { id: 19, brand: 'Kidsvit', name: 'Vitamina D3 gotas infantiles 400 UI', format: '10 ml', units: 10, unit: 'ml', price: 7990, offer: null, subcat: 'Vitamina D', shape: 'tubo', color: '#27a0e6', type: 'Venta directa', promo: false },
  { id: 20, brand: 'Naturalia', name: 'Cúrcuma + pimienta negra antiinflamatorio natural', format: '60 cápsulas', units: 60, unit: 'cápsula', price: 14990, offer: 11990, subcat: 'Energía y vitalidad', shape: 'frasco', color: '#e8a317', type: 'Venta directa', promo: false },
  { id: 21, brand: 'San Daniel', name: 'Omega 3 1000 mg aceite de pescado', format: '100 cápsulas blandas', units: 100, unit: 'cápsula', price: 9990, offer: 7990, subcat: 'Omega 3 y aceites', shape: 'frasco', color: '#d0142c', type: 'Venta directa', promo: false, own: true, club: 6990 },
  { id: 22, brand: 'BioVital', name: 'Probiótico infantil en sobres', format: '10 sobres', units: 10, unit: 'sobre', price: 13990, offer: null, subcat: 'Probióticos', shape: 'sobre', color: '#5bb85d', type: 'Venta directa', promo: true },
  { id: 23, brand: 'Vitanova', name: 'Vitamina B12 sublingual 1000 mcg', format: '60 comprimidos', units: 60, unit: 'comprimido', price: 8490, offer: null, subcat: 'Otras vitaminas', shape: 'frasco', color: '#b03a8c', type: 'Venta directa', promo: false },
  { id: 24, brand: 'NutriAndes', name: 'Melatonina 3 mg + magnesio', format: '60 comprimidos', units: 60, unit: 'comprimido', price: 12490, offer: 9990, subcat: 'Suplementos minerales', shape: 'frasco', color: '#3b3f9e', type: 'Venta directa', promo: false },
  { id: 25, brand: 'ActiveFit', name: 'Barra proteica chocolate maní 20 g proteína', format: '12 unidades', units: 12, unit: 'barra', price: 19990, offer: 15990, subcat: 'Proteínas', shape: 'caja', color: '#6b3a1e', type: 'Venta directa', promo: false },
  { id: 26, brand: 'Vitanova', name: 'Ácido fólico 5 mg', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 3990, offer: null, subcat: 'Otras vitaminas', shape: 'caja', color: '#2a8a4a', type: 'Receta simple', promo: false },
  { id: 27, brand: 'PureOmega', name: 'Omega 3-6-9 aceite de linaza y borraja', format: '90 cápsulas blandas', units: 90, unit: 'cápsula', price: 16990, offer: 12740, subcat: 'Omega 3 y aceites', shape: 'frasco', color: '#e2a72e', type: 'Venta directa', promo: false },
  { id: 28, brand: 'Naturalia', name: 'Vitamina D3 10.000 UI semanal', format: '12 cápsulas', units: 12, unit: 'cápsula', price: 9490, offer: null, subcat: 'Vitamina D', shape: 'caja', color: '#f0b323', type: 'Receta simple', promo: false },
  { id: 29, brand: 'BioVital', name: 'Zinc + selenio + vitamina E defensas', format: '60 comprimidos', units: 60, unit: 'comprimido', price: 10490, offer: 8390, subcat: 'Suplementos minerales', shape: 'frasco', color: '#0f8fa8', type: 'Venta directa', promo: false },
  { id: 30, brand: 'Kidsvit', name: 'Omega 3 kids sabor limón', format: '120 ml', units: 120, unit: 'ml', price: 14490, offer: null, subcat: 'Omega 3 y aceites', shape: 'frasco', color: '#7cc242', type: 'Venta directa', promo: true, stock: false },
  { id: 31, brand: 'San Daniel', name: 'Colágeno + ácido hialurónico en polvo', format: '250 g', units: 25, unit: 'porción', price: 15990, offer: 12790, subcat: 'Colágeno', shape: 'tarro', color: '#d0142c', type: 'Venta directa', promo: false, own: true },
  { id: 32, brand: 'Vitanova', name: 'Vitamina C liposomal 1000 mg', format: '60 cápsulas', units: 60, unit: 'cápsula', price: 21990, offer: null, subcat: 'Vitamina C', shape: 'frasco', color: '#ff7a00', type: 'Venta directa', promo: false },
  { id: 33, brand: 'Naturalia', name: 'Magnesio + colágeno + vitamina C en polvo', format: '400 g', units: 40, unit: 'porción', price: 18490, offer: 14790, subcat: 'Huesos y articulaciones', shape: 'tarro', color: '#8a5cc7', type: 'Venta directa', promo: false },
  { id: 34, brand: 'NutriAndes', name: 'Energizante natural maca andina', format: '90 cápsulas', units: 90, unit: 'cápsula', price: 11990, offer: null, subcat: 'Energía y vitalidad', shape: 'frasco', color: '#5d4037', type: 'Venta directa', promo: false },
  { id: 35, brand: 'BioVital', name: 'Multivitamínico hombre 50+', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 16490, offer: 13190, subcat: 'Multivitamínicos', shape: 'caja', color: '#1b4f8f', type: 'Venta directa', promo: false },
  { id: 36, brand: 'Naturalia', name: 'Kéfir probiótico liofilizado', format: '30 cápsulas', units: 30, unit: 'cápsula', price: 12990, offer: null, subcat: 'Probióticos', shape: 'frasco', color: '#4caf8f', type: 'Venta directa', promo: true },
  /* ---------- Medicamentos ---------- */
  { id: 40, cat: 'medicamentos', brand: 'Andesfarma', name: 'Paracetamol 500 mg', format: '16 comprimidos', units: 16, unit: 'comprimido', price: 1990, offer: null, subcat: 'Dolor y fiebre', shape: 'caja', color: '#1d6fbe', type: 'Venta directa', promo: false, bioeq: true },
  { id: 41, cat: 'medicamentos', brand: 'Lab Austral', name: 'Ibuprofeno 400 mg', format: '20 comprimidos recubiertos', units: 20, unit: 'comprimido', price: 2490, offer: 1990, subcat: 'Antiinflamatorios', shape: 'caja', color: '#e0472b', type: 'Venta directa', promo: false, bioeq: true },
  { id: 42, cat: 'medicamentos', brand: 'San Daniel', name: 'Paracetamol 500 mg', format: '16 comprimidos', units: 16, unit: 'comprimido', price: 1290, offer: null, subcat: 'Dolor y fiebre', shape: 'caja', color: '#d0142c', type: 'Venta directa', promo: false, own: true, bioeq: true },
  { id: 43, cat: 'medicamentos', brand: 'Medisur', name: 'Loratadina 10 mg', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 3990, offer: 2990, subcat: 'Antialérgicos', shape: 'caja', color: '#14a37f', type: 'Venta directa', promo: false, bioeq: true, club: 2590 },
  { id: 44, cat: 'medicamentos', brand: 'Pacífico Lab', name: 'Cetirizina 10 mg', format: '10 comprimidos', units: 10, unit: 'comprimido', price: 2790, offer: null, subcat: 'Antialérgicos', shape: 'caja', color: '#2b9fd6', type: 'Venta directa', promo: false },
  { id: 45, cat: 'medicamentos', brand: 'Andesfarma', name: 'Omeprazol 20 mg', format: '30 cápsulas', units: 30, unit: 'cápsula', price: 4990, offer: 3490, subcat: 'Sistema digestivo', shape: 'caja', color: '#7a4fd0', type: 'Venta directa', promo: false, bioeq: true },
  { id: 46, cat: 'medicamentos', brand: 'Lab Austral', name: 'Losartán potásico 50 mg', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 5990, offer: null, subcat: 'Cardiovascular', shape: 'caja', color: '#c2357e', type: 'Receta simple', promo: false, bioeq: true },
  { id: 47, cat: 'medicamentos', brand: 'Medisur', name: 'Atorvastatina 20 mg', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 8990, offer: 6990, subcat: 'Colesterol', shape: 'caja', color: '#f08a1c', type: 'Receta simple', promo: false, bioeq: true },
  { id: 48, cat: 'medicamentos', brand: 'Pacífico Lab', name: 'Levotiroxina 100 mcg', format: '50 comprimidos', units: 50, unit: 'comprimido', price: 4490, offer: null, subcat: 'Hormonas', shape: 'caja', color: '#4a6fd8', type: 'Receta simple', promo: false, bioeq: true, stock: false },
  { id: 49, cat: 'medicamentos', brand: 'Andesfarma', name: 'Anticonceptivo oral levonorgestrel + etinilestradiol', format: '21 comprimidos', units: 21, unit: 'comprimido', price: 6990, offer: 5590, subcat: 'Anticonceptivos', shape: 'caja', color: '#e94b7a', type: 'Receta simple', promo: true },
  { id: 50, cat: 'medicamentos', brand: 'Medisur', name: 'Ambroxol jarabe adultos 30 mg/5 ml', format: '120 ml', units: 120, unit: 'ml', price: 3490, offer: null, subcat: 'Resfrío y gripe', shape: 'frasco', color: '#f5b400', type: 'Venta directa', promo: false },
  { id: 51, cat: 'medicamentos', brand: 'Lab Austral', name: 'Antigripal día y noche', format: '12 cápsulas', units: 12, unit: 'cápsula', price: 4290, offer: 3390, subcat: 'Resfrío y gripe', shape: 'caja', color: '#1b4f8f', type: 'Venta directa', promo: false, club: 2990 },
  { id: 52, cat: 'medicamentos', brand: 'Pacífico Lab', name: 'Diclofenaco gel 1%', format: '50 g', units: 50, unit: 'g', price: 4990, offer: null, subcat: 'Antiinflamatorios', shape: 'tubo', color: '#0f8fa8', type: 'Venta directa', promo: true },
  { id: 53, cat: 'medicamentos', brand: 'San Daniel', name: 'Naproxeno sódico 550 mg', format: '10 comprimidos', units: 10, unit: 'comprimido', price: 2290, offer: null, subcat: 'Antiinflamatorios', shape: 'caja', color: '#d0142c', type: 'Venta directa', promo: false, own: true, bioeq: true },
  { id: 54, cat: 'medicamentos', brand: 'Andesfarma', name: 'Sales de rehidratación oral sabor naranja', format: '5 sobres', units: 5, unit: 'sobre', price: 2990, offer: null, subcat: 'Sistema digestivo', shape: 'sobre', color: '#ff7a00', type: 'Venta directa', promo: false },
  { id: 55, cat: 'medicamentos', brand: 'Medisur', name: 'Metformina 850 mg', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 2990, offer: null, subcat: 'Diabetes', shape: 'caja', color: '#2a8a4a', type: 'Receta simple', promo: false, bioeq: true },
  { id: 56, cat: 'medicamentos', brand: 'Lab Austral', name: 'Sertralina 50 mg', format: '30 comprimidos', units: 30, unit: 'comprimido', price: 7990, offer: 6390, subcat: 'Sistema nervioso', shape: 'caja', color: '#3b3f9e', type: 'Receta simple', promo: false, bioeq: true },
  { id: 57, cat: 'medicamentos', brand: 'Pacífico Lab', name: 'Clorfenamina maleato 4 mg', format: '20 comprimidos', units: 20, unit: 'comprimido', price: 1690, offer: null, subcat: 'Antialérgicos', shape: 'caja', color: '#5bb85d', type: 'Venta directa', promo: true },

  /* ---------- Dermocosmética: rostro ---------- */
  { id: 60, cat: 'rostro', brand: 'DermaPure', name: 'Gel limpiador purificante piel grasa', format: '200 ml', units: 200, unit: 'ml', price: 12990, offer: 9490, subcat: 'Limpieza', shape: 'tubo', color: '#2b9fd6', type: 'Venta directa', promo: false },
  { id: 61, cat: 'rostro', brand: 'Hydraskin', name: 'Agua micelar desmaquillante piel sensible', format: '400 ml', units: 400, unit: 'ml', price: 10990, offer: 8790, subcat: 'Limpieza', shape: 'frasco', color: '#7cc5e8', type: 'Venta directa', promo: false },
  { id: 62, cat: 'rostro', brand: 'Lumière Lab', name: 'Sérum vitamina C 15% antioxidante', format: '30 ml', units: 30, unit: 'ml', price: 24990, offer: 19990, subcat: 'Sérum', shape: 'frasco', color: '#f08a1c', type: 'Venta directa', promo: false, club: 18490 },
  { id: 63, cat: 'rostro', brand: 'Aquaderm', name: 'Crema hidratante con ácido hialurónico', format: '50 ml', units: 50, unit: 'ml', price: 18990, offer: null, subcat: 'Hidratación', shape: 'tarro', color: '#1d6fbe', type: 'Venta directa', promo: false },
  { id: 64, cat: 'rostro', brand: 'SolCare', name: 'Protector solar facial FPS 50+ toque seco', format: '50 ml', units: 50, unit: 'ml', price: 15990, offer: 12790, subcat: 'Protección solar', shape: 'tubo', color: '#f5b400', type: 'Venta directa', promo: true },
  { id: 65, cat: 'rostro', brand: 'Lumière Lab', name: 'Retinol noche tratamiento antiedad', format: '30 ml', units: 30, unit: 'ml', price: 29990, offer: null, subcat: 'Antiedad', shape: 'frasco', color: '#8a5cc7', type: 'Venta directa', promo: false },
  { id: 66, cat: 'rostro', brand: 'DermaPure', name: 'Contorno de ojos antiojeras con cafeína', format: '15 ml', units: 15, unit: 'ml', price: 16990, offer: 13590, subcat: 'Contorno de ojos', shape: 'tubo', color: '#c2357e', type: 'Venta directa', promo: false },
  { id: 67, cat: 'rostro', brand: 'Hydraskin', name: 'Sérum ácido hialurónico hidratación intensa', format: '30 ml', units: 30, unit: 'ml', price: 21990, offer: null, subcat: 'Sérum', shape: 'frasco', color: '#3aa6b9', type: 'Venta directa', promo: true },
  { id: 68, cat: 'rostro', brand: 'SolCare', name: 'Protector solar con color FPS 50', format: '40 ml', units: 40, unit: 'ml', price: 17990, offer: null, subcat: 'Protección solar', shape: 'tubo', color: '#d48b12', type: 'Venta directa', promo: false },
  { id: 69, cat: 'rostro', brand: 'Aquaderm', name: 'Crema antiedad día FPS 20', format: '50 ml', units: 50, unit: 'ml', price: 26990, offer: 21590, subcat: 'Antiedad', shape: 'tarro', color: '#b03a8c', type: 'Venta directa', promo: false, club: 19990 },
  { id: 70, cat: 'rostro', brand: 'San Daniel', name: 'Gel limpiador facial suave', format: '150 ml', units: 150, unit: 'ml', price: 5990, offer: null, subcat: 'Limpieza', shape: 'tubo', color: '#d0142c', type: 'Venta directa', promo: false, own: true },
  { id: 71, cat: 'rostro', brand: 'Hydraskin', name: 'Crema hidratante piel sensible', format: '40 ml', units: 40, unit: 'ml', price: 14990, offer: null, subcat: 'Hidratación', shape: 'tubo', color: '#4caf8f', type: 'Venta directa', promo: false },
  { id: 72, cat: 'rostro', brand: 'DermaPure', name: 'Tónico facial con niacinamida', format: '200 ml', units: 200, unit: 'ml', price: 11990, offer: 9590, subcat: 'Limpieza', shape: 'frasco', color: '#14a37f', type: 'Venta directa', promo: false },
  { id: 73, cat: 'rostro', brand: 'Lumière Lab', name: 'Mascarilla hidratante de noche', format: '50 ml', units: 50, unit: 'ml', price: 19990, offer: null, subcat: 'Hidratación', shape: 'tarro', color: '#3b3f9e', type: 'Venta directa', promo: false }
];

PRODUCTS.forEach(p => { p.cat = p.cat || 'vitaminas'; });
