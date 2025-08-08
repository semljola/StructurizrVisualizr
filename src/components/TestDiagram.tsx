import React from 'react';
import ReactFlow, { Node, Edge, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

const TestDiagram: React.FC = () => {
  const nodes: Node[] = [
    {
      id: '1',
      type: 'default',
      position: { x: 100, y: 100 },
      data: { label: 'Test Node 1' },
    },
    {
      id: '2',
      type: 'default',
      position: { x: 300, y: 100 },
      data: { label: 'Test Node 2' },
    },
  ];

  const edges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      label: 'Test Edge',
    },
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          style={{ width: '100%', height: '100%' }}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default TestDiagram;
