---
name: whiteboard-design
description: Four-Pack whiteboard design system for this app (tokens, fonts, cards, sticky notes, hand-drawn styling, light and dark mode). Use when designing, building or restyling any UI here, or choosing colours, fonts or shadows.
---

# Whiteboard design (Four-Pack)

The app looks like a real office **whiteboard**: a white board, four **markers** (black, red, blue, green), Post-it sticky notes, and outlines that look drawn by hand and slightly **hand-placed**. Everything new should look like it was drawn on that board with those four markers.

The implementation lives in `src/theme/theme.css` (tokens and React Flow overrides), `src/theme/RoughFilter.tsx` (rough-line SVG filter) and `src/nodes.tsx` (card and sticky-note components). Read them before adding new styling, and build on them.

## Tokens

Define these once on `:root` (e.g. `src/theme/theme.css`) and style only through them. A new value becomes a new `--wb-*` token named for its role.

```css
:root {
  --wb-font-ui: 'Nunito', system-ui, sans-serif;
  --wb-font-handwriting: 'Shantell Sans', 'Comic Sans MS', cursive;
  --wb-font-handwriting-settings: 'INFM' 100, 'BNCE' 40; /* informal, bouncy baseline */

  --wb-marker-black: #1c1d20;
  --wb-ink: var(--wb-marker-black); /* structure: text, outlines, handles */
  --wb-marker-red: #d2433b;   /* emphasis: tags, active tool (sparingly) */
  --wb-marker-blue: #2b5fbf;  /* connections: edges, arrows, links */
  --wb-marker-green: #1e8a4c; /* selection and "go" */

  --wb-canvas: #fafbfb;       /* board, with a dot grid (gap 26, size 1.4) */
  --wb-grid: #dfe3e6;
  --wb-node-fill: #ffffff;
  --wb-node-muted: #5c6066;   /* secondary text */

  --wb-sticky-yellow: #f4e07d; /* default note */
  --wb-sticky-red: #f2b0a8;
  --wb-sticky-blue: #a7c5ee;
  --wb-sticky-green: #a6dbb4;

  --wb-border-width: 2px;
  --wb-wobble: 18px 9px 16px 7px / 8px 15px 9px 17px; /* hand-drawn corners */
  --wb-card-shadow: 0 1px 2px rgb(0 0 0 / 0.07), 0 5px 12px rgb(0 0 0 / 0.09);
  --wb-sticky-shadow: 0 1px 3px rgb(0 0 0 / 0.07);
}
```

Load Nunito (500–800) and Shantell Sans (with its `BNCE` and `INFM` axes) from Google Fonts. Text is `--wb-ink` everywhere, except on sticky notes (always marker black) and on a red or green fill (`--wb-accent-text`).

## Dark mode

The board follows the device's light or dark setting (`prefers-color-scheme`), with no toggle. Dark mode is a **dark glass board**: the black marker swaps for a white one, the coloured markers get brighter so they read on the dark surface, and sticky notes stay paper.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --wb-marker-red: #ff8577;
    --wb-marker-blue: #86afff;
    --wb-marker-green: #5fd08f;
    --wb-marker-white: #eceef0;
    --wb-ink: var(--wb-marker-white);

    --wb-canvas: #17191c;
    --wb-grid: #2f3338;
    --wb-node-fill: #212428;
    --wb-node-muted: #a3a8ae;
    --wb-accent-text: var(--wb-canvas); /* dark text on the bright red and green */

    --wb-sticky-yellow: #e9d575; /* the same papers, a touch dimmer */
    --wb-sticky-red: #e6a69e;
    --wb-sticky-blue: #9dbbe4;
    --wb-sticky-green: #9dd1aa;

    --wb-card-shadow: 0 1px 2px rgb(0 0 0 / 0.4), 0 6px 14px rgb(0 0 0 / 0.35);
    --wb-sticky-shadow: 0 1px 3px rgb(0 0 0 / 0.4);
  }
}
```

- Style through role tokens (`--wb-ink`, `--wb-canvas`, `--wb-node-fill`, the markers) so both modes come for free. Reach for `--wb-marker-black` only for text on sticky notes.
- A new colour needs a value for each mode, with text at 4.5:1 contrast or more against both `--wb-canvas` and `--wb-node-fill`.
- Set `colorMode="system"` on `<ReactFlow>` and `color-scheme: light dark` on `:root`. JavaScript colours that can't read CSS variables (e.g. arrowhead markers) must follow the mode too.

Always reference the handwriting font through `--wb-font-handwriting`: it will be replaced by the owner's own handwriting font (issue #5).

## Materials

Every element is one of three materials:

| | Card | Sticky note | Chrome (toolbars, panels, dialogs) |
|---|---|---|---|
| For | Structured content people read carefully | Loose thoughts, comments, annotations | The tool itself |
| Font | UI; title 16px/800, body 13px/500 muted | Handwriting, 17px/500, line-height 1.25 | UI, 14px/700 |
| Surface | `--wb-node-fill`, 2px `--wb-ink` outline, `--wb-wobble` | One sticky colour, no outline, 2px corners | Same as card |
| Shadow | `--wb-card-shadow` | `--wb-sticky-shadow` (fainter) | `--wb-card-shadow` |
| Tilt | up to ±0.8° | up to ±2.5° | none |

Derive tilt from the item's id so it stays stable across renders.

## Hand-drawn look

- Outlines and edges get a subtle SVG displacement filter (`feTurbulence` + `feDisplacementMap`, scale 2.5) so they wobble like marker lines. Keep text out of the filter by drawing the fill, outline and shadow on a pseudo-element:

```css
.wb-card { position: relative; isolation: isolate; border-radius: var(--wb-wobble); }
.wb-card::before {
  content: ''; position: absolute; inset: 0; z-index: -1;
  background: var(--wb-node-fill);
  border: var(--wb-border-width) solid var(--wb-ink);
  border-radius: var(--wb-wobble);
  box-shadow: var(--wb-card-shadow);
  filter: url(#wb-rough);
}
```

- Edges: curved, 2px, blue, dashed `7 5`, closed arrowhead.
- Selection: 2px dashed green outline, offset 6px.
- One clean outline per shape; the goal is "drawn carefully with a marker", not a doodle.

## Already decided

Explored on the prototype branch and set aside: handwriting on cards, a second offset pencil line, saturated fills with hard offset shadows, and cool, technical looks (neutral grey, blueprint). Start from the look above.
