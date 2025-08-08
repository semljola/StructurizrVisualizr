import React from 'react';
import { Layers, Users, Box, Package } from 'lucide-react';
import clsx from 'clsx';

export type ViewType = 'systemContext' | 'container' | 'component';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  availableViews: ViewType[];
}

const viewConfig = {
  systemContext: {
    label: 'System Context',
    description: 'High-level system interactions',
    icon: Layers,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  container: {
    label: 'Container',
    description: 'System internals and containers',
    icon: Box,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600'
  },
  component: {
    label: 'Component',
    description: 'Detailed component interactions',
    icon: Package,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600'
  }
};

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onViewChange,
  availableViews
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">C4 Model Views</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users size={16} />
          <span>Select view layer</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(viewConfig).map(([viewType, config]) => {
          const Icon = config.icon;
          const isAvailable = availableViews.includes(viewType as ViewType);
          const isActive = currentView === viewType;
          
          return (
            <button
              key={viewType}
              onClick={() => isAvailable && onViewChange(viewType as ViewType)}
              disabled={!isAvailable}
              className={clsx(
                'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                {
                  'border-transparent bg-gray-50 text-gray-400 cursor-not-allowed': !isAvailable,
                  'border-blue-500 bg-blue-50 text-blue-700': isActive && isAvailable,
                  'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50': !isActive && isAvailable
                }
              )}
            >
              <div className={clsx(
                'p-2 rounded-lg',
                isAvailable ? config.color : 'bg-gray-300'
              )}>
                <Icon size={20} className="text-white" />
              </div>
              
              <div className="flex-1 text-left">
                <div className="font-medium">{config.label}</div>
                <div className="text-sm opacity-75">{config.description}</div>
              </div>
              
              {isActive && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> Start with System Context for high-level overview, then drill down to Container and Component views for more detail.
          </div>
        </div>
      </div>
    </div>
  );
};
