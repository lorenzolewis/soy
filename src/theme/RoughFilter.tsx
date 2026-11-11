/**
 * SVG filter that makes outlines and edges look hand-drawn. Referenced from CSS as
 * `--wb-rough: url(#wb-rough)`. Render once per page.
 *
 * Uses a large user-space region so zero-width shapes (straight vertical or
 * horizontal edges) are not clipped away.
 */
export function RoughFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <filter id="wb-rough" filterUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="2.5" />
      </filter>
    </svg>
  )
}
