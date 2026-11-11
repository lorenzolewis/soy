import type { CSSProperties } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

export type CardNode = Node<{ title: string; body?: string }, 'card'>
export type StickyColor = 'yellow' | 'red' | 'blue' | 'green'
export type StickyNode = Node<{ text: string; color: StickyColor }, 'sticky'>
export type WhiteboardNode = CardNode | StickyNode

/** A small, stable tilt in degrees derived from the node id, so things look hand-placed. */
function tilt(id: string, max: number) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0
  return ((Math.abs(h) % 1000) / 1000 - 0.5) * 2 * max
}

export function CardNodeView({ id, data }: NodeProps<CardNode>) {
  return (
    <div className="wb-card" style={{ '--wb-tilt': `${tilt(id, 0.8)}deg` } as CSSProperties}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} id="left" />
      <div className="wb-card-title">{data.title}</div>
      {data.body && <div className="wb-card-body">{data.body}</div>}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  )
}

export function StickyNodeView({ id, data }: NodeProps<StickyNode>) {
  return (
    <div
      className="wb-sticky"
      style={
        {
          '--wb-sticky-bg': `var(--wb-sticky-${data.color})`,
          '--wb-tilt': `${tilt(id, 2.5)}deg`,
        } as CSSProperties
      }
    >
      <Handle type="target" position={Position.Left} />
      {data.text}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
