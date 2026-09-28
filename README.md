# Bhaskar Anand — Professional Website

Personal professional website focused on Industrial AI, Asset Performance Management, Predictive Maintenance, Reliability Engineering, and Power & Process Industries.

Live site: https://Bhaskar2504.github.io

## Colour themes

Visitors can switch between three themes from the header (◐ button, or the Menu panel on phones). The choice is saved in `localStorage` and applied before first paint.

| Theme | Description |
|---|---|
| Classic (default) | The original navy/teal design. No `data-theme` attribute is set, so none of the theme overrides apply. |
| Midnight | Dark slate with cyan accents. Also used by default when the visitor's OS is in dark mode. |
| Daylight | All-light, high-readability variant; dark bands become soft light panels. |

How it works:

- `themes-tokens.css` — hand-written token values (`--t-surface`, `--t-text`, `--t-accent`, …) for Midnight and Daylight, plus header/footer and theme-picker styles.
- `themes.css` — **generated**. `tools/build-themes.py` reads every stylesheet and inline `<style>` block, classifies each colour by role (surface, band, text, border, accent, status) and writes a `:root[data-theme] …` override pointing at the matching token.
- `site.js` — theme picker behaviour; a small inline script in each page's `<head>` applies the saved theme before paint.

**After editing any stylesheet or inline `<style>`, regenerate the themes:**

```bash
python3 tools/build-themes.py
```

All three themes were checked for WCAG AA text contrast (4.5:1, or 3:1 for large text) on every page.
