"""Convierte data/inventario.csv en la lista de productos que usa la página."""
import csv, datetime, json, pathlib, re, unicodedata

# Sección principal de cada categoría del CSV
SECCION = {
    'Medicamentos': 'medicamentos',
    'Vitaminas': 'vitaminas-y-suplementos',
    'Suplementos': 'vitaminas-y-suplementos',
    'Dermocosmética': 'dermocosmetica',
    'Cuidado personal': 'cuidado-personal',
    'Bebé y maternidad': 'bebe-y-maternidad',
    'Adulto mayor': 'adulto-mayor',
}

# Productos que además se muestran en otra sección, con su subcategoría allí
TAMBIEN = {
    'MED-005': {'bebe-y-maternidad': 'Niños'},
    'VIT-006': {'bebe-y-maternidad': 'Niños'},
    'VIT-009': {'bebe-y-maternidad': 'Niños'},
    'VIT-024': {'bebe-y-maternidad': 'Niños'},
    'VIT-019': {'bebe-y-maternidad': 'Embarazo'},
    'VIT-025': {'bebe-y-maternidad': 'Embarazo'},
    'VIT-023': {'adulto-mayor': 'Vitaminas'},
    'VIT-010': {'adulto-mayor': 'Huesos y articulaciones'},
    'SUP-007': {'adulto-mayor': 'Huesos y articulaciones'},
    'SUP-010': {'adulto-mayor': 'Huesos y articulaciones'},
    'SUP-022': {'adulto-mayor': 'Memoria'},
    'MED-009': {'adulto-mayor': 'Corazón'},
    'MED-045': {'adulto-mayor': 'Ojos'},
    'MED-048': {'adulto-mayor': 'Próstata'},
}

# Etiqueta corta que se imprime en el envase dibujado, cuando la automática no sirve
ETIQUETA = {
    'MED-009': 'AAS 100', 'SUP-001': 'OMEGA 3', 'MED-020': 'SUERO ORAL', 'MED-022': 'ANTIÁCIDO', 'MED-024': 'AMOXI CLAV',
    'MED-035': 'SALBUTAMOL', 'MED-039': 'FLUTICASONA', 'MED-045': 'LÁGRIMAS',
    'VIT-013': 'COMPLEJO B', 'VIT-015': 'B1 B6 B12', 'VIT-017': 'NIACINAMIDA',
    'VIT-020': 'MULTI ADULTO', 'VIT-021': 'MULTI MUJER', 'VIT-022': 'MULTI HOMBRE',
    'VIT-023': 'MULTI 50+', 'VIT-024': 'MULTI KIDS', 'VIT-025': 'PRENATAL',
    'VIT-006': 'VIT C KIDS', 'VIT-009': 'D3 GOTAS', 'VIT-010': 'D3 + K2', 'VIT-011': 'K2 MK-7',
    'VIT-004': 'VIT C + ZINC', 'VIT-005': 'C + D + ZINC',
    'SUP-002': 'OMEGA 3 MAX', 'SUP-004': 'MAGNESIO B6', 'SUP-006': 'HIERRO', 'SUP-007': 'CALCIO + D3',
    'SUP-008': 'COLÁGENO', 'SUP-009': 'COLÁGENO C', 'SUP-010': 'GLUCOSAMINA',
    'SUP-013': 'PROBIÓTICOS', 'SUP-014': 'PSYLLIUM', 'SUP-015': 'WHEY', 'SUP-018': 'ELECTROLITOS',
    'SUP-019': 'Q10', 'SUP-020': 'CÚRCUMA', 'SUP-024': 'CRANBERRY', 'SUP-025': 'LEVADURA',
}

PALETA = [('#2F78BD','#DCEBFA'),('#D51A2F','#FFE1E4'),('#1E9AA0','#D9F3F3'),('#E8772E','#FFEBDC'),
          ('#2E9E62','#DFF4E8'),('#7A4BB5','#EEE5FA'),('#E6A817','#FFF4D6'),('#1C4F85','#DCEBFA'),
          ('#D9488B','#FFE3EF'),('#8A5A3C','#F4E7DE')]

UNIDADES = {'comprimidos':'comprimido','comprimido':'comprimido','cápsulas':'cápsula','cápsula':'cápsula',
            'gomitas':'gomita','sobres':'sobre'}

def envase(cat, forma):
    f = forma.lower()
    if 'gel' in f or 'crema' in f or 'ungüento' in f or 'efervescente' in f: return 'tube'
    if 'polvo' in f: return 'box' if 'solución' in f else 'tub'
    if 'gomita' in f: return 'jar'
    if any(k in f for k in ('jarabe','suspensión','solución','gotas','spray','aerosol')): return 'bottle'
    return 'box' if cat == 'Medicamentos' else 'bottle'

def etiqueta(sku, nombre):
    if sku in ETIQUETA: return ETIQUETA[sku]
    base = re.split(r'\s(?=\d)', nombre)[0].upper()
    words = base.split()
    out = words[0]  # la primera palabra va completa; el dibujo achica la letra si es larga
    for w in words[1:]:
        if len(out + ' ' + w) > 12: break
        out += ' ' + w
    return out

FOTOS = pathlib.Path(__file__).parent / 'images'

def foto(sku, fila):
    # columna opcional "imagen" (URL o ruta); si no, images/<SKU>.webp|jpg|jpeg|png
    if (fila.get('imagen') or '').strip(): return fila['imagen'].strip()
    for ext in ('webp', 'jpg', 'jpeg', 'png'):
        if (FOTOS / f'{sku}.{ext}').exists(): return f'images/{sku}.{ext}'
    return None

def cargar(ruta, hoy=None):
    hoy = hoy or datetime.date.today()
    productos, avisos, skus, colores = [], [], set(), {}
    with open(ruta, encoding='utf-8-sig', newline='') as fh:
        for n, r in enumerate(csv.DictReader(fh), start=2):
            sku = r['sku'].strip()
            if not sku: continue
            if sku in skus: avisos.append(f'fila {n}: SKU repetido {sku}, se ignora'); continue
            skus.add(sku)
            if r['activo'].strip() != '1': avisos.append(f'{sku}: inactivo, no se muestra'); continue
            venc = datetime.date.fromisoformat(r['fecha_vencimiento'].strip())
            if venc <= hoy: avisos.append(f'{sku}: vencido el {venc}, no se muestra'); continue
            cat = r['categoria'].strip()
            if cat not in SECCION: avisos.append(f'{sku}: categoría "{cat}" sin sección en la página, no se muestra'); continue
            try: precio = int(r['precio_clp'])
            except ValueError: avisos.append(f'{sku}: precio inválido "{r["precio_clp"]}", no se muestra'); continue
            stock, minimo = int(r['stock'] or 0), int(r['stock_minimo'] or 0)
            if stock <= minimo: avisos.append(f'{sku}: stock bajo ({stock}, mínimo {minimo})')
            sub = r['subcategoria'].strip()
            c, c2 = PALETA[colores.setdefault(sub, len(colores) % len(PALETA))]
            contenido = r['contenido'].strip()
            m = re.match(r'^(\d+)\s+(\S+)$', contenido)
            unidad = UNIDADES.get(m.group(2).lower()) if m else None
            unidades = int(m.group(1)) if m and unidad else 1
            productos.append({
                'id': sku, 'sec': SECCION[cat], 'cat': sub, 'also': TAMBIEN.get(sku),
                'name': r['nombre'].strip(), 'brand': r['laboratorio'].strip(), 'pa': r['principio_activo'].strip(),
                'pres': contenido, 'forma': r['forma_farmaceutica'].strip(), 'desc': r['descripcion'].strip(),
                'rx': r['requiere_receta'].strip() == '1', 'price': precio, 'stock': stock, 'min': minimo,
                'units': unidades, 'unit': unidad, 'shape': envase(cat, r['forma_farmaceutica']),
                'c': c, 'c2': c2, 'lbl': etiqueta(sku, r['nombre']), 'dose': r['concentracion'].strip(),
                'badge': f'{unidades} u' if unidades > 1 else contenido, 'flags': [],
                'img': foto(sku, r),
                'kind': cat, 'venc': venc.strftime('%m/%Y'),
            })
    sin = [p['id'] for p in productos if not p['img']]
    if sin: avisos.append(f'{len(sin)} productos sin foto (se muestra el envase dibujado)')
    return productos, avisos

if __name__ == '__main__':
    ps, av = cargar(pathlib.Path(__file__).parent / 'data' / 'inventario.csv')
    print(len(ps), 'productos'); print('\n'.join(av))
    for p in ps: print(p['id'], p['shape'], p['lbl'], '|', p['badge'], '|', p['dose'])
