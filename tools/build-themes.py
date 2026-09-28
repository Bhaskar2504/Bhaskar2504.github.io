#!/usr/bin/env python3
"""Generate themes.css: role-based colour overrides for the alternate site themes.

Why a generator: the site's styles hard-code ~550 colours across 14 stylesheets and
inline <style> blocks. Rather than hand-editing every file (high risk of regressions),
this script reads them, classifies each colour by the role it plays (surface, band,
text, border, accent) and emits an override that points to a design token:

    :root[data-theme] .card{background:var(--t-surface)}

Token values per theme live in themes-tokens.css. The default "classic" theme sets no
data-theme attribute, so none of these rules apply and the original design is untouched.

Run from the repository root after changing any stylesheet:
    python3 tools/build-themes.py
"""
import colorsys
import glob
import re

OUT = 'themes.css'
SKIP_FILES = {'nav.css', 'themes.css', 'themes-tokens.css'}   # nav has its own tokens
PREFIX = ':root[data-theme]'
COLOR_PROPS = re.compile(r'^(background(?:-color|-image)?|color|border(?:-(?:top|right|bottom|left))?(?:-color)?|outline(?:-color)?|fill|stroke|text-decoration-color|caret-color)$')
COLOR_RE = re.compile(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)|\bwhite\b')

# Colour custom properties defined by the existing stylesheets (name -> literal colour).
# Filled by collect_variables() so that `color:var(--navy)` is classified exactly like
# `color:#071722` - by how it is used, not by what the variable is called.
VARIABLES = {}
COLORED_BG_SELECTORS = set()      # filled by collect_colored_backgrounds()
BUTTONISH = re.compile(r'(button|btn|\.primary\b|badge|pill|chip|number|index|count|logo|\bdot\b|\.n\b|tag\b)', re.I)
INLINE_TAIL = re.compile(r'(^|[\s>+~])(a|button|span|small|b|strong|em|i|label)([.:#\[]|$)')
BANDISH = re.compile(r'hero|section|band|footer|header|strip|page|main|shell|intro|banner', re.I)


def is_control_selector(selector):
    """True when every selector in the list targets a small control (button, chip, badge...),
    judged by its last compound so '.hero .button' is a control but '.hero' is a band."""
    sels = split_selectors(selector)
    if not sels:
        return False
    for sel in sels:
        tail = re.split(r'[\s>+~]+', sel.strip())[-1]
        if BANDISH.search(tail) and not BUTTONISH.search(tail):
            return False
        if not BUTTONISH.search(tail):
            return False
    return True
VAR_RE = re.compile(r'var\((--[a-z0-9-]+)(?:\s*,[^)]*)?\)')


def parse_color(c):
    c = c.strip().lower()
    if c == 'white':
        return (255, 255, 255, 1.0)
    if c.startswith('#'):
        h = c[1:]
        if len(h) == 3:
            h = ''.join(x * 2 for x in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (1.0,)
    parts = [p for p in re.split(r'[\s,/]+', c[c.find('(') + 1:-1]) if p]
    try:
        vals = [float(p.rstrip('%')) for p in parts[:4]]
    except ValueError:
        return None
    if len(vals) < 3:
        return None
    return (vals[0], vals[1], vals[2], vals[3] if len(vals) > 3 else 1.0)


def luminance(r, g, b):
    f = lambda x: (x / 255) / 12.92 if x / 255 <= 0.03928 else ((x / 255 + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def hue_family(r, g, b):
    """accent = the site's teal/cyan; warm = amber/orange/rust status colours;
    neutral = greys plus the navy/slate blues used for text and dark bands."""
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if l < 0.2 or l > 0.9 or s <= 0.35:
        return 'neutral'
    deg = h * 360
    if 150 <= deg <= 205:
        return 'accent'
    if 205 < deg <= 260:
        return 'neutral'
    if deg < 60 or deg > 330:
        return 'warm'
    return 'other'


def role_for(kind, rgba, rule_has_colored_bg, solid=False):
    """Return a token name (without --t-) or None to leave the colour as authored."""
    r, g, b, a = rgba
    L = luminance(r, g, b)
    fam = hue_family(r, g, b)
    if fam == 'other':
        return None                      # other chromatic colours keep their meaning
    if fam == 'warm':                    # amber/rust status text is re-tuned for contrast per theme
        return ('warm-text' if L < 0.25 else 'warm-on-band') if kind == 'text' else None
    if kind == 'bg':
        if a < 0.5:
            return 'veil' if L > 0.6 else ('shade' if L < 0.08 else None)
        if fam == 'accent':
            return 'band-accent' if L < 0.08 else ('accent' if L < 0.45 else 'surface-3')
        if solid and L < 0.08: return 'solid'   # dark button/chip fill, not a page band
        if L > 0.97: return 'surface'
        if L > 0.85: return 'surface-2'
        if L > 0.6: return 'surface-3'
        if L < 0.02: return 'band-deep'
        if L < 0.08: return 'band'
        return None
    if kind == 'text':
        if fam == 'accent':
            return 'accent-on-band' if L > 0.2 else 'accent-text'
        if L > 0.6:
            return None if rule_has_colored_bg else 'on-band'   # white on a button stays white
        if L < 0.03: return 'text-strong'
        if L < 0.08: return 'text'
        if L < 0.25: return 'text-muted'
        return 'text-faint'
    if kind == 'border':
        if fam == 'accent':
            return 'accent-border'
        if L > 0.6:
            return 'border' if a >= 0.5 else 'border-on-band'
        return None
    return None


def prop_kind(prop):
    if prop.startswith('background'): return 'bg'
    if prop in ('color', 'caret-color', 'fill', 'text-decoration-color'): return 'text'
    if prop == 'stroke' or prop.startswith('border') or prop.startswith('outline'): return 'border'
    return None


# ---------------- minimal CSS parser (handles nesting of @media/@supports) ----------------
def strip_comments(css):
    return re.sub(r'/\*.*?\*/', '', css, flags=re.S)


def parse_blocks(css):
    """Yield (prelude, body) pairs at the current nesting level."""
    i, n = 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0:
            return
        prelude = css[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == '{': depth += 1
            elif css[k] == '}': depth -= 1
            k += 1
        yield prelude, css[j + 1:k - 1]
        i = k


def split_selectors(sel):
    out, depth, cur = [], 0, ''
    for ch in sel:
        if ch in '([': depth += 1
        elif ch in ')]': depth -= 1
        if ch == ',' and depth == 0:
            out.append(cur.strip()); cur = ''
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    return out


def scope(sel):
    s = sel.strip()
    if s.startswith(':root'):
        return PREFIX + s[len(':root'):]
    if re.match(r'html\b', s):
        return PREFIX + s[4:]
    return PREFIX + ' ' + s


PSEUDO_RE = re.compile(r':{1,2}[a-z-]+(\([^)]*\))?')


def on_colored_background(selector):
    """True when the selector is, or sits inside, an element that paints a coloured or solid fill.
    Pseudo-classes are ignored so '.tile' matches a fill set on '.tile:nth-child(2)'."""
    for sel in split_selectors(selector):
        base = PSEUDO_RE.sub('', sel).strip()
        for c in COLORED_BG_SELECTORS:
            cb = PSEUDO_RE.sub('', c).strip()
            if base == cb or base.startswith(cb + ' ') or base.startswith(cb + '>'):
                return True
    return False


def transform_rule(selector, body):
    decls = []
    raw = [d for d in body.split(';') if ':' in d]
    parsed = []
    for d in raw:
        prop, val = d.split(':', 1)
        parsed.append((prop.strip().lower(), val.strip()))
    colored_bg = any(
        prop_kind(p) == 'bg' and any(
            (lambda c: c and c[3] >= 0.5 and hue_family(*c[:3]) in ('accent', 'warm', 'other') and luminance(*c[:3]) >= 0.08)(parse_color(m))
            for m in COLOR_RE.findall(v))
        for p, v in parsed) or on_colored_background(selector)
    # A rule that paints a dark fill AND light text is a solid control (button, chip, badge)
    def _has(kind_test):
        for p, v in parsed:
            v2 = VAR_RE.sub(lambda m: VARIABLES.get(m.group(1), m.group(0)), v)
            for c in COLOR_RE.findall(v2):
                rgba = parse_color(c)
                if rgba and kind_test(p, rgba):
                    return True
        return False
    dark_fill = _has(lambda p, c: prop_kind(p) == 'bg' and c[3] >= 0.5 and luminance(*c[:3]) < 0.08)
    light_text = _has(lambda p, c: p == 'color' and luminance(*c[:3]) > 0.6)
    # dark fill on a control, or on a tile whose sibling variants are coloured tiles
    solid = dark_fill and (is_control_selector(selector) or on_colored_background(selector))
    if solid:
        colored_bg = True
    for prop, val in parsed:
        important = '!important' in val
        if prop.startswith('--'):
            continue
        original = val.replace('!important', '').strip()
        val = VAR_RE.sub(lambda m: VARIABLES.get(m.group(1), m.group(0)), val)
        if not COLOR_PROPS.match(prop):
            continue
        kind = prop_kind(prop) or ('bg' if prop == 'background-image' else None)
        if not kind:
            continue
        changed = False

        def swap(m):
            nonlocal changed
            c = parse_color(m.group(0))
            if not c:
                return m.group(0)
            role = role_for(kind, c, colored_bg, solid)
            if not role:
                return m.group(0)
            changed = True
            return f'var(--t-{role})'
        new = COLOR_RE.sub(swap, val.replace('!important', '').strip())
        # Emit colour declarations even when unchanged (e.g. background:transparent) so that,
        # under the theme prefix, the original cascade order between rules is preserved.
        decls.append((f'{prop}:{new if changed else original}' + ('!important' if important else ''), changed))
    if not decls:
        return None
    decls = [d for d, _ in decls]
    sels = [s for s in split_selectors(selector) if s]
    return ','.join(scope(s) for s in sels) + '{' + ';'.join(decls) + '}'


def transform(css):
    out = []
    for prelude, body in parse_blocks(css):
        if prelude.startswith('@media') or prelude.startswith('@supports'):
            if 'print' in prelude:
                continue
            inner = transform(body)
            if inner:
                out.append(prelude + '{' + ''.join(inner) + '}')
        elif prelude.startswith('@'):
            continue                                    # keyframes, font-face, import
        else:
            r = transform_rule(prelude, body)
            if r:
                out.append(r)
    return out


def sources():
    for f in sorted(glob.glob('**/*.css', recursive=True)):
        if f.split('/')[-1] in SKIP_FILES or f.startswith('tools/'):
            continue
        yield f, open(f, encoding='utf-8').read()
    for f in sorted(glob.glob('**/*.html', recursive=True)):
        for i, m in enumerate(re.finditer(r'<style>(.*?)</style>', open(f, encoding='utf-8').read(), re.S)):
            yield f'{f} <style #{i + 1}>', m.group(1)


def collect_colored_backgrounds():
    def walk(css):
        for prelude, body in parse_blocks(css):
            if prelude.startswith('@media') or prelude.startswith('@supports'):
                walk(body); continue
            if prelude.startswith('@'):
                continue
            dark_fill = light_text = colored = False
            for d in body.split(';'):
                if ':' not in d: continue
                prop, val = d.split(':', 1)
                prop = prop.strip().lower()
                val = VAR_RE.sub(lambda m: VARIABLES.get(m.group(1), m.group(0)), val)
                for c in COLOR_RE.findall(val):
                    rgba = parse_color(c)
                    if not rgba: continue
                    if prop.startswith('background') and rgba[3] >= 0.5:
                        if hue_family(*rgba[:3]) in ('accent', 'warm', 'other') and 0.08 <= luminance(*rgba[:3]) < 0.45:
                            colored = True
                        elif luminance(*rgba[:3]) < 0.08:
                            dark_fill = True
                    if prop == 'color' and luminance(*rgba[:3]) > 0.6:
                        light_text = True
            # coloured fills, and solid dark fills that are clearly controls (button/chip)
            if colored or (dark_fill and is_control_selector(prelude)):
                COLORED_BG_SELECTORS.update(split_selectors(prelude))
    for _, css in sources():
        walk(strip_comments(css))


def collect_variables():
    for _, css in sources():
        for m in re.finditer(r'(--[a-z0-9-]+)\s*:\s*([^;}]+)', strip_comments(css)):
            name, val = m.group(1), m.group(2).strip()
            if COLOR_RE.fullmatch(val) and name not in VARIABLES:
                VARIABLES[name] = val


def main():
    collect_variables()
    collect_colored_backgrounds()
    chunks, total = [], 0
    for name, css in sources():
        rules = transform(strip_comments(css))
        if rules:
            total += len(rules)
            chunks.append(f'/* {name} */\n' + '\n'.join(rules))
    header = ('/* GENERATED by tools/build-themes.py - do not edit by hand.\n'
              '   Role-based colour overrides for alternate themes; token values are in themes-tokens.css. */\n')
    open(OUT, 'w', encoding='utf-8').write(header + '\n'.join(chunks) + '\n')
    print(f'{OUT}: {total} rules from {len(chunks)} sources')


if __name__ == '__main__':
    main()
