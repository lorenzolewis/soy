import { lazy, Suspense, useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 0, y: 120 }, data: { label: 'Node 2' } },
]

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }]

// PROTOTYPE: design directions, dev only. Open /?direction=sketchpop (or sketchbook, pop, all).
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

  const onNodesChange: OnNodesChange = useCallback(
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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
