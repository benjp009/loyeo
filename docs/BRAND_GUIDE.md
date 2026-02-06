# Loyeo — Brand Guide

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Coral Red | `#FF4D4D` | CTAs, links, interactive elements, accents |
| Navy Dark | `#1A1A2E` | Primary text color. **Never use pure #000000** |
| Warm Cream | `#FFF8F0` | Page backgrounds. **Never use pure white for page bg** |
| White | `#FFFFFF` | Cards, containers, input fields |
| Text Grey | `#8E8E93` | Secondary text, labels, placeholders |

## Tailwind Config

```js
colors: {
  'coral': '#FF4D4D',
  'navy': '#1A1A2E',
  'cream': '#FFF8F0',
  'text-grey': '#8E8E93',
}
```

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | Sora | Bold (700), SemiBold (600) | Page titles, section headings, hero text |
| Body | DM Sans | Regular (400), Medium (500) | Paragraphs, descriptions, UI copy |
| Data | Space Mono | Regular (400) | Metrics, badges, technical labels, code |

**Fallback stack:** Arial, Helvetica, sans-serif
**All fonts:** Google Fonts (free)

## Logo Rules

- **Long Dark** — Full wordmark on cream/light backgrounds
- **Long Light** — Reversed wordmark on navy backgrounds
- **Short Dark** — Planet icon only, cream/light backgrounds
- **Short Light** — Planet icon only, navy backgrounds (favicons, app icons)
- **Clear space:** Height of the "L" on all sides
- **Min size:** 120px wide (digital), 30mm (print). Icon min: 24×24px
- **Always** lock aspect ratio when scaling

## Do's and Don'ts

### ✅ DO
- Use logo on cream or white backgrounds
- Use reversed logo on navy backgrounds
- Use Coral Red for CTAs and interactive elements
- Use Warm Cream (#FFF8F0) as page background
- Maintain type hierarchy: Sora → DM Sans → Space Mono
- Left-align body text, center only hero headlines

### ❌ DON'T
- Place logo on busy photos without container
- Rotate, skew, distort, or add effects to logo
- Use black backgrounds for any surface
- Mix brand colors with unapproved hues
- Use more than 2 font families in one layout
- Use all-caps for body text (overlines only)
- Use italic for emphasis (use bold or color instead)

## Taglines (approved French)
- "Vos clients reviennent, votre commerce grandit."
- "Scannez, cumulez, profitez."
- "La fidélité, simplifiée."

## UI Component Patterns

### Buttons
- **Primary:** bg-coral text-white, rounded-lg, hover:bg-coral/90
- **Secondary:** border-coral text-coral bg-transparent, hover:bg-coral/10
- **Destructive:** bg-red-600 text-white (not coral — coral is brand, red-600 is danger)

### Cards
- bg-white rounded-xl shadow-sm border border-gray-100
- On cream backgrounds, white cards provide visual separation

### Inputs
- bg-white border border-gray-200 rounded-lg
- Focus: ring-2 ring-coral/50 border-coral
