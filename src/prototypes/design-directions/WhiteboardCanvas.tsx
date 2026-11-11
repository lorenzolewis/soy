// PROTOTYPE — throwaway. One React Flow whiteboard rendered with a given direction's tokens.
import { useCallback, useState, type CSSProperties } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeProps,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react'
import type { Direction, FontToken, Palette } from './tokens'

type CardData = { title: string; body: string; tag?: string; tilt: number }
type StickyData = { text: string; color: number; tilt: number }
type CardNode = Node<CardData, 'card'>
type StickyNode = Node<StickyData, 'sticky'>

function CardNodeView({ data }: NodeProps<CardNode>) {
  return (
    <div className="wb-card" style={{ '--wb-tilt': `${data.tilt}deg` } as CSSProperties}>
      <Handle type="target" position={Position.Top} />
      <div className="wb-card-title">{data.title}</div>
      <div className="wb-card-body">{data.body}</div>
      {data.tag && <span className="wb-tag">{data.tag}</span>}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />
    </div>
  )
}

function StickyNodeView({ data }: NodeProps<StickyNode>) {
  return (
    <div
      className="wb-sticky"
      style={
        {
          '--wb-sticky-bg': `var(--wb-sticky-${data.color})`,
          '--wb-tilt': `${data.tilt}deg`,
        } as CSSProperties
      }
    >
      <Handle type="target" position={Position.Left} />
      {data.text}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

const nodeTypes = { card: CardNodeView, sticky: StickyNodeView }

const initialNodes: (CardNode | StickyNode)[] = [
  { id: 'research', type: 'card', position: { x: 0, y: 0 }, data: { title: 'Research', body: 'Interview 8 users about how they plan launches.', tag: 'Done', tilt: -0.8 } },
  { id: 'scope', type: 'card', position: { x: 0, y: 190 }, selected: true, data: { title: 'Define scope', body: 'Pick the 3 jobs v1 must do well.', tilt: 0.5 } },
  { id: 'proto', type: 'card', position: { x: 300, y: 190 }, data: { title: 'Prototype', body: 'Clickable flow for onboarding + boards.', tilt: -0.5 } },
  { id: 'ship', type: 'card', position: { x: 300, y: 380 }, data: { title: 'Ship v1', body: 'Private beta with 20 teams.', tag: 'Q1', tilt: 0.7 } },
  { id: 's1', type: 'sticky', position: { x: 330, y: -40 }, data: { text: 'What about offline mode?', color: 0, tilt: -2.5 } },
  { id: 's2', type: 'sticky', position: { x: 520, y: 0 }, data: { text: 'Pricing: ask Sam', color: 1, tilt: 2 } },
  { id: 's3', type: 'sticky', position: { x: -250, y: 120 }, data: { text: 'Onboarding feels long', color: 2, tilt: 1.5 } },
  { id: 's4', type: 'sticky', position: { x: -250, y: 330 }, data: { text: 'Try a template gallery!', color: 3, tilt: -1.5 } },
  { id: 's5', type: 'sticky', position: { x: 580, y: 330 }, data: { text: 'Beta invite copy', color: 4, tilt: 2.5 } },
]

const initialEdges: Edge[] = [
  { id: 'e-r-s', source: 'research', target: 'scope' },
  { id: 'e-s-p', source: 'scope', sourceHandle: 'r', target: 'proto', targetHandle: 'l', label: 'next', selected: true },
  { id: 'e-p-sh', source: 'proto', target: 'ship', animated: true },
  { id: 'e-s3-s', source: 's3', target: 'scope', targetHandle: 'l' },
]

const gridVariant = {
  dots: BackgroundVariant.Dots,
  lines: BackgroundVariant.Lines,
  cross: BackgroundVariant.Cross,
}

function fontVars(prefix: string, f: FontToken) {
  return {
    [`--wb-${prefix}-family`]: f.family,
    [`--wb-${prefix}-size`]: `${f.size}px`,
    [`--wb-${prefix}-weight`]: f.weight,
    [`--wb-${prefix}-lh`]: f.lineHeight ?? 1.3,
    [`--wb-${prefix}-ls`]: f.letterSpacing ?? 'normal',
    [`--wb-${prefix}-fvs`]: f.variation ?? 'normal',
  }
}

function cssVars(d: Direction, p: Palette): CSSProperties {
  const s = d.shape
  return {
    ...fontVars('ui', d.fonts.ui),
    ...fontVars('title', d.fonts.nodeTitle),
    ...fontVars('node', d.fonts.node),
    ...fontVars('sticky', d.fonts.sticky),
    ...Object.fromEntries(p.stickies.map((c, i) => [`--wb-sticky-${i}`, c])),
    '--wb-canvas': p.canvas,
    '--wb-node-fill': p.nodeFill,
    '--wb-node-border': p.nodeBorder,
    '--wb-node-text': p.nodeText,
    '--wb-node-muted': p.nodeMuted,
    '--wb-selection': p.selection,
    '--wb-accent': p.accent,
    '--wb-accent-text': p.accentText,
    '--wb-chrome-bg': p.chromeBg,
    '--wb-chrome-fg': p.chromeFg,
    '--wb-chrome-border': p.chromeBorder,
    '--wb-sticky-text': p.stickyText,
    '--wb-radius': `${s.radius}px`,
    '--wb-border-width': `${s.borderWidth}px`,
    '--wb-node-shadow': s.nodeShadow,
    '--wb-sticky-shadow': s.stickyShadow,
    '--wb-sticky-radius': `${s.stickyRadius}px`,
    '--wb-tilt-enabled': s.stickyTilt ? 1 : 0,
    '--wb-edge-dash': s.edgeDash ?? 'none',
    '--wb-wobble': s.sketch?.wobbleRadius ?? `${s.radius}px`,
    '--wb-rough': s.sketch ? `url(#wb-rough-${d.id})` : 'none',
    '--wb-card-tilt-enabled': s.sketch?.cardTilt ? 1 : 0,
    // React Flow's own theming variables
    '--xy-edge-stroke': p.edge,
    '--xy-edge-stroke-width': s.edgeWidth,
    '--xy-edge-stroke-selected': p.edgeSelected,
    '--xy-connectionline-stroke': p.edgeSelected,
    '--xy-selection-background-color': p.selectionFill,
    '--xy-selection-border': `1px solid ${p.selection}`,
    '--xy-handle-background-color': p.nodeBorder,
    '--xy-handle-border-color': p.nodeFill,
    '--xy-edge-label-background-color': p.canvas,
    '--xy-edge-label-color': p.nodeMuted,
    '--xy-controls-button-background-color': p.chromeBg,
    '--xy-controls-button-background-color-hover': p.selectionFill,
    '--xy-controls-button-color': p.chromeFg,
    '--xy-controls-button-color-hover': p.chromeFg,
    '--xy-controls-button-border-color': p.chromeBorder,
  } as CSSProperties
}

const tools = ['Select', 'Hand', 'Sticky', 'Shape', 'Text', 'Connect']

export function WhiteboardCanvas({
  direction: d,
  mode,
  compact = false,
}: {
  direction: Direction
  mode: 'light' | 'dark'
  compact?: boolean
}) {
  const palette = (mode === 'dark' ? (d.dark ?? d.light) : (d.light ?? d.dark))!
  const shownMode = palette === d.dark ? 'dark' : 'light'
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange: OnNodesChange<CardNode | StickyNode> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )
  const onConnect: OnConnect = useCallback((c) => setEdges((eds) => addEdge(c, eds)), [])

  return (
    <div
      className={`wb ${compact ? 'wb-compact' : ''} ${d.shape.sketch ? 'wb-sketch' : ''}`}
      style={cssVars(d, palette)}
    >
      {d.shape.sketch && (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          {/* Huge user-space region so zero-width (straight) edge paths still render */}
          <filter
            id={`wb-rough-${d.id}`}
            filterUnits="userSpaceOnUse"
            x="-5000"
            y="-5000"
            width="10000"
            height="10000"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale={d.shape.sketch.roughness} />
          </filter>
        </svg>
      )}
      <ReactFlow
        id={`wb-${d.id}`}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={shownMode}
        defaultEdgeOptions={{
          type: d.shape.edgeType,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: palette.edge },
        }}
        minZoom={0.2}
        fitView
        fitViewOptions={{ padding: compact ? 0.08 : 0.25 }}
        onInit={(rf) => requestAnimationFrame(() => rf.fitView({ padding: compact ? 0.08 : 0.25 }))}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          bgColor={palette.canvas}
          color={palette.grid}
          variant={gridVariant[d.shape.grid]}
          gap={d.shape.gridGap}
          size={d.shape.gridSize}
        />
        <Controls />
        <Panel position="top-left" className="wb-toolbar">
          {tools.map((t, i) => (
            <button key={t} className={i === 2 ? 'active' : ''}>
              {t}
            </button>
          ))}
        </Panel>
        <Panel position="top-right" className="wb-tokens">
          <div className="wb-tokens-name">
            {d.name} <span>{shownMode}</span>
          </div>
          {compact ? null : (
            <>
          <div className="wb-tokens-mood">{d.mood}</div>
          <div className="wb-tokens-fonts">
            UI: {d.fonts.ui.family.split(',')[0].replaceAll("'", '')} · Notes:{' '}
            {d.fonts.sticky.family.split(',')[0].replaceAll("'", '')}
          </div>
          <div className="wb-swatches">
            {(
              [
                ['canvas', palette.canvas],
                ['fill', palette.nodeFill],
                ['border', palette.nodeBorder],
                ['text', palette.nodeText],
                ['edge', palette.edge],
                ['select', palette.selection],
                ['accent', palette.accent],
              ] as const
            ).map(([label, c]) => (
              <span key={label} title={`${label} ${c}`} style={{ background: c }} />
            ))}
            <i />
            {palette.stickies.map((c, i) => (
              <span key={i} title={`sticky ${c}`} style={{ background: c }} />
            ))}
          </div>
            </>
          )}
        </Panel>
      </ReactFlow>
    </div>
  )
}
