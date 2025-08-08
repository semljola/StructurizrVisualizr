import { C4Element, C4Relationship } from '../types/c4';

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  element: C4Element;
}

export interface LayoutEdge {
  source: string;
  target: string;
  relationship: C4Relationship;
}

export class LayoutEngine {
  private nodes: LayoutNode[] = [];
  private edges: LayoutEdge[] = [];
  private nodeSpacing = 200;
  private layerSpacing = 300;
  private elementWidth = 200;
  private elementHeight = 100;

  layout(workspace: { elements: C4Element[]; relationships: C4Relationship[] }, viewType: string): LayoutNode[] {
    this.nodes = [];
    this.edges = [];
    
    // Filter elements based on view type
    const relevantElements = this.filterElementsForView(workspace.elements, viewType);
    const relevantRelationships = this.filterRelationshipsForView(workspace.relationships, relevantElements);
    
    // Create layout nodes
    relevantElements.forEach(element => {
      this.nodes.push({
        id: element.id,
        x: 0,
        y: 0,
        width: this.elementWidth,
        height: this.elementHeight,
        element
      });
    });
    
    // Create layout edges
    relevantRelationships.forEach(relationship => {
      this.edges.push({
        source: relationship.source,
        target: relationship.target,
        relationship
      });
    });
    
    // Apply layout algorithm
    this.applyLayout(viewType);
    
    return this.nodes;
  }

  private filterElementsForView(elements: C4Element[], viewType: string): C4Element[] {
    let topLevelElements: C4Element[] = [];

    switch (viewType) {
      case 'systemContext':
        topLevelElements = elements.filter(el => el.type === 'person' || el.type === 'softwareSystem');
        break;
      case 'container':
        topLevelElements = elements.filter(el => el.type === 'person' || el.type === 'softwareSystem' || el.type === 'container');
        break;
      case 'component':
        topLevelElements = elements.filter(el => el.type === 'person' || el.type === 'softwareSystem' || el.type === 'container' || el.type === 'component');
        break;
      default:
        return elements;
    }

    const elementMap = new Map(elements.map(el => [el.id, el]));
    const relevantElements = new Set<C4Element>();

    topLevelElements.forEach(el => {
      relevantElements.add(el);
      let parent = el.parent ? elementMap.get(el.parent) : undefined;
      while (parent) {
        relevantElements.add(parent);
        parent = parent.parent ? elementMap.get(parent.parent) : undefined;
      }
    });

    return Array.from(relevantElements);
  }

  private filterRelationshipsForView(relationships: C4Relationship[], elements: C4Element[]): C4Relationship[] {
    const elementIds = new Set(elements.map(el => el.id));
    return relationships.filter(rel => 
      elementIds.has(rel.source) && elementIds.has(rel.target)
    );
  }

  private applyLayout(viewType: string): void {
    switch (viewType) {
      case 'systemContext':
        this.applySystemContextLayout();
        break;
      case 'container':
        this.applyContainerLayout();
        break;
      case 'component':
        this.applyComponentLayout();
        break;
      default:
        this.applyDefaultLayout();
    }
  }

  private applySystemContextLayout(): void {
    const people = this.nodes.filter(n => n.element.type === 'person');
    const systems = this.nodes.filter(n => n.element.type === 'softwareSystem');
    
    // Position people on the left
    people.forEach((node, index) => {
      node.x = 100;
      node.y = 200 + index * this.nodeSpacing;
    });
    
    // Position systems in the center
    systems.forEach((node, index) => {
      node.x = 400;
      node.y = 200 + index * this.nodeSpacing;
    });
  }

  private applyContainerLayout(): void {
    const people = this.nodes.filter(n => n.element.type === 'person');
    const systems = this.nodes.filter(n => n.element.type === 'softwareSystem');
    const containers = this.nodes.filter(n => n.element.type === 'container');
    
    // Position people on the left
    people.forEach((node, index) => {
      node.x = 100;
      node.y = 200 + index * this.nodeSpacing;
    });
    
    // Position main system in the center
    if (systems.length > 0) {
      systems[0].x = 400;
      systems[0].y = 300;
    }
    
    // Position containers around the main system
    containers.forEach((node, index) => {
      const angle = (index / containers.length) * 2 * Math.PI;
      const radius = 250;
      node.x = 400 + Math.cos(angle) * radius;
      node.y = 300 + Math.sin(angle) * radius;
    });
  }

  private applyComponentLayout(): void {
    const people = this.nodes.filter(n => n.element.type === 'person');
    const systems = this.nodes.filter(n => n.element.type === 'softwareSystem');
    const containers = this.nodes.filter(n => n.element.type === 'container');
    const components = this.nodes.filter(n => n.element.type === 'component');
    
    // Position people on the left
    people.forEach((node, index) => {
      node.x = 100;
      node.y = 200 + index * this.nodeSpacing;
    });
    
    // Position main system in the center
    if (systems.length > 0) {
      systems[0].x = 400;
      systems[0].y = 300;
    }
    
    // Position containers around the main system
    containers.forEach((node, index) => {
      const angle = (index / containers.length) * 2 * Math.PI;
      const radius = 250;
      node.x = 400 + Math.cos(angle) * radius;
      node.y = 300 + Math.sin(angle) * radius;
    });
    
    // Position components within their containers
    components.forEach((node, index) => {
      // Find parent container
      const parentContainer = containers.find(c => c.element.id === node.element.parent);
      if (parentContainer) {
        const offsetX = (index % 3 - 1) * 150;
        const offsetY = Math.floor(index / 3) * 120;
        node.x = parentContainer.x + offsetX;
        node.y = parentContainer.y + offsetY;
      } else {
        // Fallback positioning
        node.x = 600 + (index % 4) * 200;
        node.y = 200 + Math.floor(index / 4) * 150;
      }
    });
  }

  private applyDefaultLayout(): void {
    // Simple grid layout
    const cols = Math.ceil(Math.sqrt(this.nodes.length));
    this.nodes.forEach((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      node.x = 100 + col * this.nodeSpacing;
      node.y = 100 + row * this.nodeSpacing;
    });
  }
}

export const layoutEngine = new LayoutEngine();
