import React, { useState, useEffect, useMemo } from 'react';
import { DSLEditor } from './components/DSLEditor';
import { C4Diagram } from './components/C4Diagram';

import { ViewSelector, ViewType } from './components/ViewSelector';
import { dslParser } from './utils/dslParser';
import { layoutEngine } from './utils/layoutEngine';
import { C4Element, C4Relationship } from './types/c4';
import { flygTaxiDSL } from './sampleData';

// Use FlygTaxi DSL as the default sample
const sampleDSL = flygTaxiDSL;

function App() {
  const [dslText, setDslText] = useState(sampleDSL);
  const [currentView, setCurrentView] = useState<ViewType>('systemContext');
  const [parsedData, setParsedData] = useState<{
    workspace: { name: string; elements: C4Element[]; relationships: C4Relationship[] };
    errors: string[];
  }>({ workspace: { name: '', elements: [], relationships: [] }, errors: [] });

  // Parse DSL when text changes
  useEffect(() => {
    try {
      const result = dslParser.parse(dslText);
      setParsedData({
        workspace: result.workspace,
        errors: result.errors
      });
    } catch (error) {
      setParsedData({
        workspace: { name: '', elements: [], relationships: [] },
        errors: [`Parse error: ${error}`]
      });
    }
  }, [dslText]);

  // Generate layout for current view
  const layoutNodes = useMemo(() => {
    if (parsedData.workspace.elements.length === 0) return [];
    return layoutEngine.layout(parsedData.workspace, currentView);
  }, [parsedData.workspace, currentView]);

  // Determine available views based on elements
  const availableViews = useMemo(() => {
    const views: ViewType[] = [];
    const hasPeople = parsedData.workspace.elements.some(el => el.type === 'person');
    const hasSystems = parsedData.workspace.elements.some(el => el.type === 'softwareSystem');
    const hasContainers = parsedData.workspace.elements.some(el => el.type === 'container');
    const hasComponents = parsedData.workspace.elements.some(el => el.type === 'component');

    if (hasPeople || hasSystems) views.push('systemContext');
    if (hasPeople || hasSystems || hasContainers) views.push('container');
    if (hasPeople || hasSystems || hasContainers || hasComponents) views.push('component');

    return views;
  }, [parsedData.workspace.elements]);

  // Filter elements and relationships for current view
  const filteredElements = useMemo(() => {
    return layoutNodes.map(node => node.element);
  }, [layoutNodes]);

  const filteredRelationships = useMemo(() => {
    const elementIds = new Set(filteredElements.map(el => el.id));
    return parsedData.workspace.relationships.filter(rel => 
      elementIds.has(rel.source) && elementIds.has(rel.target)
    );
  }, [parsedData.workspace.relationships, filteredElements]);

  const handleFileImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setDslText(content);
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const blob = new Blob([dslText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedData.workspace.name || 'c4-model'}.dsl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Structurizr DSL Viewer</h1>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Interactive C4 Model
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Built with React + TypeScript</span>
              <span>•</span>
              <span>Powered by React Flow</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - DSL Editor */}
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              <DSLEditor
                value={dslText}
                onChange={setDslText}
                errors={parsedData.errors}
                onExport={handleExport}
                onImport={handleFileImport}
              />
            </div>
            
            <div className="mt-4">
              <ViewSelector
                currentView={currentView}
                onViewChange={setCurrentView}
                availableViews={availableViews}
              />
            </div>
          </div>

          {/* Right Panel - Diagram */}
          <div className="flex flex-col space-y-4">
            <C4Diagram
              elements={filteredElements}
              relationships={filteredRelationships}
              layoutNodes={layoutNodes}
              viewType={currentView}
              workspaceName={parsedData.workspace.name || 'Untitled Workspace'}
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <span>Elements: {filteredElements.length}</span>
              <span>Relationships: {filteredRelationships.length}</span>
              <span>Current View: {currentView}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {parsedData.errors.length > 0 && (
                <span className="text-red-600">
                  {parsedData.errors.length} parsing error{parsedData.errors.length !== 1 ? 's' : ''}
                </span>
              )}
              <span className="text-green-600">Ready</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
