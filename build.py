import base64, re, pathlib
here = pathlib.Path(__file__).parent
ph = here/'icons'  # Phosphor Icons (MIT), only the ones the page uses
src = (here/'src.html').read_text()
names = sorted(set(re.findall(r'#i-([a-z0-9-]+(?:--fill)?)', src)) | {'heart--fill','trash','minus'})
syms = []
for n in names:
    weight = 'fill' if n.endswith('--fill') else 'regular'
    base = n.replace('--fill', '')
    f = ph/weight/(base + ('-fill' if weight=='fill' else '') + '.svg')
    svg = f.read_text()
    inner = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1)
    syms.append(f'<symbol id="i-{n}" viewBox="0 0 256 256">{inner}</symbol>')
sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(syms) + '</svg>'
logo = 'data:image/webp;base64,' + base64.b64encode((here/'logo.webp').read_bytes()).decode()
out = src.replace('<!--SPRITE-->', sprite).replace('__LOGO__', logo)
(here/'artifact.html').write_text(out)
head = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
body_at = out.index('<!--BODY-->') if '<!--BODY-->' in out else out.index('</style>')+8
(here/'index.html').write_text(head + out[:body_at] + '\n</head>\n<body>\n' + out[body_at:] + '\n</body>\n</html>\n')
print('icons', len(names), 'bytes', len(out))
