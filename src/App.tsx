import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './theme/theme.css'
import { RoughFilter } from './theme/RoughFilter'
import { CardNodeView, StickyNodeView, type WhiteboardNode } from './nodes'
import { useRoute, type Route } from './router'

const nodeTypes = { card: CardNodeView, sticky: StickyNodeView }

// Empty until later phases lay out the content as cards.
const nodes: WhiteboardNode[] = []

export default function App() {
  // Both routes render the same board for now; later the project route opens that project's detail.
  const route = useRoute()
  return <Board route={route} />
}

function Board({ route }: { route: Route }) {
  return (
    <main aria-label="Board" data-route={route.name} style={{ width: '100%', height: '100%' }}>
      <RoughFilter />
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        colorMode="system"
      >
        <Background
          variant={BackgroundVariant.Dots}
          bgColor="var(--wb-canvas)"
          color="var(--wb-grid)"
          gap={26}
          size={1.4}
        />
      </ReactFlow>
    </main>
  )
}
