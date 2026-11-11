import { lazy, Suspense, useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './theme/theme.css'
import { RoughFilter } from './theme/RoughFilter'
import { CardNodeView, StickyNodeView, type WhiteboardNode } from './nodes'

const nodeTypes = { card: CardNodeView, sticky: StickyNodeView }

const initialNodes: WhiteboardNode[] = [
  { id: 'idea', type: 'card', position: { x: 0, y: 0 }, data: { title: 'Idea', body: 'Something worth exploring.' } },
  { id: 'next', type: 'card', position: { x: 0, y: 170 }, data: { title: 'Next step', body: 'What happens after.' } },
  { id: 'note', type: 'sticky', position: { x: 280, y: 20 }, data: { text: 'Jot thoughts on a sticky note', color: 'yellow' } },
]

const initialEdges: Edge[] = [{ id: 'idea-next', source: 'idea', target: 'next' }]

// PROTOTYPE: design directions, dev only. Open /?direction=expo (or fourpack, brights, drying, neon, all).
const DesignDirections =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('direction')
    ? lazy(() => import('./prototypes/design-directions/DesignDirections'))
    : null

export default function App() {
  if (DesignDirections) {
    return (
      <Suspense>
        <DesignDirections />
      </Suspense>
    )
  }
  return <Canvas />
}

function Canvas() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange: OnNodesChange<WhiteboardNode> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <RoughFilter />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={{
          // Matches --wb-marker-blue (marker colours can't read CSS variables)
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: '#2b5fbf' },
        }}
        fitView
        fitViewOptions={{ padding: 0.4 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          bgColor="var(--wb-canvas)"
          color="var(--wb-grid)"
          gap={26}
          size={1.4}
        />
        <Controls />
      </ReactFlow>
    </div>
  )
}
