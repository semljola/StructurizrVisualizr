import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  ReactFlowProvider
} from 'reactflow';
import { C4Node } from './C4Node';
import { C4Element, C4Relationship } from '../types/c4';
import { LayoutNode } from '../utils/layoutEngine';

interface C4DiagramProps {
  elements: C4Element[];
  relationships: C4Relationship[];
  layoutNodes: LayoutNode[];
  viewType: string;
  workspaceName: string;
}

const nodeTypes: NodeTypes = {
  c4Node: C4Node,
};

export const C4Diagram: React.FC<C4DiagramProps> = ({
  elements,
  relationships,
  layoutNodes,
  viewType,
  workspaceName
}) => {
  // Convert layout nodes to React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return layoutNodes.map((layoutNode) => ({
      id: layoutNode.id,
      type: 'c4Node',
      position: { x: layoutNode.x, y: layoutNode.y },
      data: { element: layoutNode.element },
      draggable: true,
      style: {
        width: layoutNode.width,
        height: layoutNode.height,
      },
    }));
  }, [layoutNodes]);

  // Convert relationships to React Flow edges
  const initialEdges: Edge[] = useMemo(() => {
    return relationships
      .filter(rel => {
        const sourceExists = elements.some(el => el.id === rel.source);
        const targetExists = elements.some(el => el.id === rel.target);
        return sourceExists && targetExists;
      })
      .map((relationship) => ({
        id: relationship.id,
        source: relationship.source,
        target: relationship.target,
        type: 'default',
        animated: true,
        style: { stroke: '#6b7280', strokeWidth: 3 },
        label: relationship.description || '',
        labelStyle: {
          fontSize: '14px',
          fontWeight: 600,
          fill: '#374151',
        },
        labelBgStyle: {
          fill: '#f9fafb',
          fillOpacity: 0.8,
        },
        labelBgPadding: [4, 4],
        labelBgBorderRadius: 4,
      }));
  }, [relationships, elements]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getViewTitle = () => {
    switch (viewType) {
      case 'systemContext':
        return 'System Context';
      case 'container':
        return 'Container';
      case 'component':
        return 'Component';
      default:
        return 'C4 Model';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{workspaceName}</h2>
          <p className="text-sm text-gray-600">{getViewTitle()} View</p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{elements.length} elements</span>
          <span>•</span>
          <span>{relationships.length} relationships</span>
        </div>
      </div>

      {/* Diagram */}
      <div className="flex-1 relative" style={{ minHeight: '500px' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.1 }}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            attributionPosition="bottom-left"
            className="bg-gray-50"
            style={{ width: '100%', height: '100%' }}
          >
            <Controls />
            <Background color="#e5e7eb" gap={20} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-c4-person rounded"></div>
            <span>Person</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-c4-system rounded"></div>
            <span>System</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-c4-container rounded"></div>
            <span>Container</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-c4-component rounded"></div>
            <span>Component</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-c4-external rounded"></div>
            <span>External</span>
          </div>
        </div>
      </div>
    </div>
  );
};
