export interface C4Element {
  id: string;
  name: string;
  description: string;
  technology?: string;
  tags?: string[];
  type: 'person' | 'softwareSystem' | 'container' | 'component' | 'database';
  parent?: string;
  position?: { x: number; y: number };
}

export interface C4Relationship {
  id: string;
  source: string;
  target: string;
  description?: string;
  technology?: string;
  tags?: string[];
}

export interface C4View {
  id: string;
  name: string;
  type: 'systemContext' | 'container' | 'component' | 'dynamic' | 'deployment';
  elementId: string;
  title?: string;
  description?: string;
  includes?: string[];
  excludes?: string[];
  autoLayout?: 'tb' | 'lr' | 'td' | 'bt' | 'rl' | 'dt';
}

export interface C4Workspace {
  name: string;
  description?: string;
  elements: C4Element[];
  relationships: C4Relationship[];
  views: C4View[];
}

export interface C4Style {
  element: string;
  background?: string;
  color?: string;
  border?: string;
  shape?: string;
  icon?: string;
}

export interface ParsedDSL {
  workspace: C4Workspace;
  styles: C4Style[];
  errors: string[];
}
