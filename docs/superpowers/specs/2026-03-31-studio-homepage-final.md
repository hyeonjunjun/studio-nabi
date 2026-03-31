# Studio Homepage — Final Design

Single viewport. Light background. Poetic headline. Three project cards. Live clock. No scroll.

## Layout
- Background: `#f5f3ef` (warm paper)
- Dark mode: `#111110`
- One viewport, `height: 100dvh`, `overflow: hidden`
- Vertical flex: nav (top) → headline (upper third) → projects (lower half) → footer (bottom)

## Nav
- Left: `HKJ` — General Sans, 14px, 500 weight
- Right: `About · Contact` — Fragment Mono, 11px, muted
- Padding: `16px var(--pad)`

## Headline
- "where craft meets intention"
- General Sans, `clamp(28px, 4vw, 48px)`, weight 400, lowercase
- Left-aligned
- Color: `var(--fg)`
- Below it: generous whitespace

## Project Cards
- 3 cards in a row, `grid-template-columns: repeat(3, 1fr)`, gap `clamp(16px, 2vw, 32px)`
- Each card: `border-radius: 6px`, `overflow: hidden`, `aspect-ratio: 3/2`
- Image: `object-fit: cover`, fills the card
- No image: `background: var(--fg-4)` + centered status text
- Below each card: project name (14px, 500) + tags/year (mono, 10px, muted)
- Hover: image dims to 90% brightness, project name color `var(--fg)`. 400ms transition.

## Footer
- Left: `New York · HH:MM PM` — live clock, Fragment Mono, 10px, muted
- Right: `LinkedIn  GitHub  Twitter` + `Est. 2025` — mono, 10px, muted
- Padding: `12px var(--pad)`

## Entrance
- GSAP timeline:
  - 0ms: nav fades in (300ms)
  - 100ms: headline fades in (400ms)
  - 300ms: cards stagger in, 100ms apart (400ms each)
  - 500ms: footer fades in (300ms)

## Files
- `src/app/page.tsx` — rewrite
- `src/app/globals.css` — rewrite
