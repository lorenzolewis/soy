// PROTOTYPE — throwaway. Shared shape of a whiteboard design direction ("design ticket").
// The whiteboard direction shares fonts + shape (whiteboard.ts); variants differ only by palette.

export type FontToken = {
  family: string
  size: number // px
  weight: number
  lineHeight?: number
  letterSpacing?: string
  variation?: string // font-variation-settings
}

export type Palette = {
  canvas: string
  grid: string
  nodeFill: string
  nodeBorder: string
  nodeText: string
  nodeMuted: string
  edge: string
  edgeSelected: string
  selection: string // selected-node ring / marquee border
  selectionFill: string // marquee fill
  accent: string
  accentText: string
  chromeBg: string // toolbars + controls
  chromeFg: string
  chromeBorder: string
  stickyText: string
  stickies: string[] // 4–6 colours
}

export type Direction = {
  id: string
  name: string
  mood: string
  googleFonts: string // `family=...&family=...` part of a css2 URL
  fonts: {
    ui: FontToken
    node: FontToken
    nodeTitle: FontToken
    sticky: FontToken
  }
  shape: {
    radius: number
    borderWidth: number
    nodeShadow: string
    stickyShadow: string
    stickyRadius: number
    stickyTilt: boolean
    edgeType: 'default' | 'smoothstep' | 'step' | 'straight'
    edgeWidth: number
    edgeDash?: string
    grid: 'dots' | 'lines' | 'cross'
    gridGap: number
    gridSize: number
    // Optional hand-drawn treatment: wobbly outlines and edges, tilted cards.
    sketch?: {
      roughness: number // displacement in px applied to outlines and edges
      wobbleRadius: string // irregular border-radius for cards and chrome
      cardTilt: boolean
    }
  }
  // At least one of these; the canvas falls back to whichever exists.
  light?: Palette
  dark?: Palette
}
