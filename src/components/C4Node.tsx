import React from 'react';
import { Handle, Position } from 'reactflow';
import { C4Element } from '../types/c4';
import { User, Server, Box, Database, Globe } from 'lucide-react';

interface C4NodeProps {
  data: {
    element: C4Element;
  };
}

const getElementIcon = (type: string) => {
  switch (type) {
    case 'person':
      return <User size={20} />;
    case 'softwareSystem':
      return <Server size={20} />;
    case 'container':
      return <Box size={20} />;
    case 'component':
      return <Box size={16} />;
    case 'database':
      return <Database size={20} />;
    default:
      return <Globe size={20} />;
  }
};

const getElementClass = (type: string, tags?: string[]) => {
  const isExternal = tags?.includes('External') || type === 'external';
  
  if (isExternal) {
    return 'c4-node c4-node-external';
  }
  
  switch (type) {
    case 'person':
      return 'c4-node c4-node-person';
    case 'softwareSystem':
      return 'c4-node c4-node-system';
    case 'container':
      if (tags?.includes('Database')) {
        return 'c4-node c4-node-database';
      }
      return 'c4-node c4-node-container';
    case 'component':
      return 'c4-node c4-node-component';
    case 'database':
      return 'c4-node c4-node-database';
    default:
      return 'c4-node c4-node-system';
  }
};

export const C4Node: React.FC<C4NodeProps> = ({ data }) => {
  const { element } = data;
  const nodeClass = getElementClass(element.type, element.tags);
  const icon = getElementIcon(element.type);

  return (
    <div className={`${nodeClass} p-4 min-w-[200px] max-w-[300px] border-2 border-gray-300`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight mb-1">
            {element.name}
          </div>
          
          {element.description && (
            <div className="text-xs leading-relaxed opacity-90">
              {element.description}
            </div>
          )}
          
          {element.technology && (
            <div className="text-xs mt-2 opacity-75 font-mono">
              {element.technology}
            </div>
          )}
          
          {element.tags && element.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {element.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
};
