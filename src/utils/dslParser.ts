import { ParsedDSL, C4Workspace, C4Element, C4Relationship, C4View, C4Style } from '../types/c4';

export class DSLParser {
  private lines: string[] = [];
  private currentLine = 0;
  private workspace: C4Workspace = {
    name: '',
    elements: [],
    relationships: [],
    views: []
  };
  private styles: C4Style[] = [];
  private errors: string[] = [];
  private elementMap = new Map<string, C4Element>();
  private inModel = false;
  private inViews = false;
  private inStyles = false;
  private currentParent: C4Element | null = null;

  parse(dslText: string): ParsedDSL {
    this.reset();
    this.lines = dslText.split('\n');
    
    for (let i = 0; i < this.lines.length; i++) {
      this.currentLine = i + 1;
      const line = this.lines[i].trim();
      
      if (!line || line.startsWith('#')) continue;
      
      this.parseLine(line);
    }
    
    return {
      workspace: this.workspace,
      styles: this.styles,
      errors: this.errors
    };
  }

  private reset(): void {
    this.workspace = {
      name: '',
      elements: [],
      relationships: [],
      views: []
    };
    this.styles = [];
    this.errors = [];
    this.elementMap.clear();
    this.inModel = false;
    this.inViews = false;
    this.inStyles = false;
    this.currentParent = null;
  }

  private parseLine(line: string): void {
    // Track sections
    if (line === 'model {') {
      this.inModel = true;
      this.inViews = false;
      this.inStyles = false;
      return;
    }
    
    if (line === 'views {') {
      this.inModel = false;
      this.inViews = true;
      this.inStyles = false;
      return;
    }
    
    if (line === 'styles {') {
      this.inStyles = true;
      return;
    }
    
    if (line.endsWith('{')) {
      const parentId = line.split(' ')[0];
      this.currentParent = this.elementMap.get(parentId) || null;
    } else if (line === '}') {
      if (this.currentParent) {
        this.currentParent = this.currentParent.parent ? this.elementMap.get(this.currentParent.parent) || null : null;
      } else {
        // Handle closing braces - only close the outermost section
        if (this.inStyles) {
          this.inStyles = false;
        } else if (this.inViews) {
          this.inViews = false;
        } else if (this.inModel) {
          this.inModel = false;
        }
      }
      return;
    }

    // Parse workspace declaration
    if (line.startsWith('workspace')) {
      this.parseWorkspace(line);
      return;
    }

    // Parse elements in model section
    if (this.inModel) {
      // Handle nested containers (indented lines)
      const trimmedLine = line.trim();
      if (trimmedLine.includes('=') && (trimmedLine.includes('person') || trimmedLine.includes('softwareSystem') || trimmedLine.includes('container'))) {
        this.parseElement(trimmedLine, this.currentParent);
        return;
      }
      
      if (line.includes('->')) {
        this.parseRelationship(line);
        return;
      }
    }

    // Parse views
    if (this.inViews && !this.inStyles) {
      if (line.includes('systemContext') || line.includes('container') || line.includes('component')) {
        this.parseView(line);
        return;
      }
    }

    // Parse styles
    if (this.inStyles) {
      if (line.includes('element')) {
        this.parseStyle(line);
        return;
      }
    }
  }

  private parseWorkspace(line: string): void {
    const match = line.match(/workspace\s+"([^"]+)"/);
    if (match) {
      this.workspace.name = match[1];
    } else {
      this.errors.push(`Line ${this.currentLine}: Invalid workspace declaration`);
    }
  }

  private parseElement(line: string, parentElement: C4Element | null): void {
    // Handle person declarations
    const personMatch = line.match(/(\w+)\s*=\s*person\s+"([^"]+)"(?:\s+"([^"]*)")?/);
    if (personMatch) {
      const element: C4Element = {
        id: parentElement ? `${parentElement.id}.${personMatch[1]}` : personMatch[1],
        name: personMatch[1],
        description: personMatch[2],
        technology: personMatch[3] || undefined,
        type: 'person',
        parent: parentElement ? parentElement.id : undefined,
      };
      this.addElement(element);
      return;
    }

    // Handle software system declarations
    const systemMatch = line.match(/(\w+)\s*=\s*softwareSystem\s+"([^"]+)"(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?/);
    if (systemMatch) {
      const element: C4Element = {
        id: parentElement ? `${parentElement.id}.${systemMatch[1]}` : systemMatch[1],
        name: systemMatch[1],
        description: systemMatch[2],
        technology: systemMatch[3] || undefined,
        tags: systemMatch[4] ? [systemMatch[4]] : undefined,
        type: 'softwareSystem',
        parent: parentElement ? parentElement.id : undefined,
      };
      this.addElement(element);
      return;
    }

    // Handle container declarations
    const containerMatch = line.match(/(\w+)\s*=\s*container\s+"([^"]+)"(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?/);
    if (containerMatch) {
      const element: C4Element = {
        id: parentElement ? `${parentElement.id}.${containerMatch[1]}` : containerMatch[1],
        name: containerMatch[1],
        description: containerMatch[2],
        technology: containerMatch[3] || undefined,
        tags: containerMatch[4] ? [containerMatch[4]] : undefined,
        type: 'container',
        parent: parentElement ? parentElement.id : undefined,
      };
      this.addElement(element);
      return;
    }

    this.errors.push(`Line ${this.currentLine}: Invalid element declaration: ${line}`);
  }

  private parseRelationship(line: string): void {
    // Remove comments
    const cleanLine = line.replace(/#.*$/, '').trim();
    
    const match = cleanLine.match(/([\w.]+)\s*->\s*([\w.]+)(?:\s+"([^"]*)")?/);
    if (match) {
      const relationship: C4Relationship = {
        id: `${match[1]}-${match[2]}`,
        source: match[1],
        target: match[2],
        description: match[3] || undefined
      };
      this.workspace.relationships.push(relationship);
    } else {
      this.errors.push(`Line ${this.currentLine}: Invalid relationship: ${line}`);
    }
  }

  private parseView(line: string): void {
    const match = line.match(/(systemContext|container|component)\s+(\w+)(?:\s+"([^"]*)")?/);
    if (match) {
      const view: C4View = {
        id: `${match[1]}-${match[2]}`,
        name: match[2],
        type: match[1] as any,
        elementId: match[2],
        title: match[3] || undefined
      };
      this.workspace.views.push(view);
    } else {
      this.errors.push(`Line ${this.currentLine}: Invalid view declaration: ${line}`);
    }
  }

  private parseStyle(line: string): void {
    const match = line.match(/element\s+"([^"]+)"/);
    if (match) {
      const style: C4Style = {
        element: match[1]
      };
      this.styles.push(style);
    }
  }

  private addElement(element: C4Element): void {
    this.workspace.elements.push(element);
    this.elementMap.set(element.id, element);
  }
}

export const dslParser = new DSLParser();
