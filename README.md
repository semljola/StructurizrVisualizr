# Structurizr DSL Viewer

An interactive web-based C4 model viewer for Structurizr DSL, built with React, TypeScript, and React Flow. This application allows you to visualize C4 model diagrams interactively, similar to IcePanel.

## Features

- **DSL Parsing**: Parse valid Structurizr DSL input with real-time validation
- **Interactive Visualization**: View C4 models across different layers (Context, Container, Component)
- **Layer Toggling**: Switch between C4 model layers with intuitive controls
- **Interactive Elements**: Draggable, zoomable nodes representing people, systems, containers, and components
- **Relationship Visualization**: Labeled edges showing relationships between elements
- **Real-time Editing**: Edit DSL in a side panel with live diagram updates
- **Import/Export**: Load and save DSL files
- **Syntax Highlighting**: Color-coded DSL editor with error highlighting
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **React Flow** for interactive diagram rendering
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Custom DSL Parser** for Structurizr DSL parsing
- **Layout Engine** for automatic diagram positioning

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd structurizrvisualizr
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

### Basic Workflow

1. **Load DSL**: The application starts with a sample C4 model. You can:
   - Edit the DSL directly in the left panel
   - Import a `.dsl` file using the upload button
   - Copy/paste DSL content

2. **View Layers**: Use the view selector to switch between:
   - **System Context**: High-level system interactions
   - **Container**: System internals and containers
   - **Component**: Detailed component interactions

3. **Interact with Diagram**:
   - Drag nodes to reposition them
   - Zoom in/out using mouse wheel or controls
   - Pan by dragging the background
   - Hover over elements to see details

4. **Export**: Save your DSL using the download button

### DSL Syntax Support

The viewer supports the following Structurizr DSL elements:

#### Elements
```dsl
# People
user = person "User" "A user of the system"

# Software Systems
webApp = softwareSystem "Web Application" "Provides functionality" "Technology"

# Containers
webApp.api = container "API Server" "Provides REST API" "Spring Boot"

# Components
webApp.api.controller = component "User Controller" "Handles user requests" "Spring MVC"
```

#### Relationships
```dsl
user -> webApp "Uses"
webApp.api -> database "Stores data"
```

#### Views
```dsl
views {
    systemContext webApp "SystemContext" {
        include *
        autoLayout lr
    }
    
    container webApp "Containers" {
        include *
        autoLayout lr
    }
}
```

### Example DSL

```dsl
workspace "E-commerce System" {
    model {
        # People
        customer = person "Customer" "A customer using the e-commerce platform"
        admin = person "Admin" "System administrator"
        
        # Software Systems
        ecommerceSystem = softwareSystem "E-commerce System" "Provides online shopping functionality" "Spring Boot"
        paymentGateway = softwareSystem "Payment Gateway" "Processes payments" "External"
        inventorySystem = softwareSystem "Inventory System" "Manages product inventory" "External"
        
        # Containers
        ecommerceSystem.webApp = container "Web Application" "Provides web interface" "React"
        ecommerceSystem.api = container "API Gateway" "Provides REST API" "Spring Boot"
        ecommerceSystem.database = container "Database" "Stores application data" "PostgreSQL"
        
        # Relationships
        customer -> ecommerceSystem.webApp "Uses"
        ecommerceSystem.webApp -> ecommerceSystem.api "Calls"
        ecommerceSystem.api -> ecommerceSystem.database "Stores data"
        ecommerceSystem.api -> paymentGateway "Processes payments"
        ecommerceSystem.api -> inventorySystem "Checks inventory"
        admin -> ecommerceSystem.api "Manages"
    }
    
    views {
        systemContext ecommerceSystem "SystemContext" {
            include *
            autoLayout lr
        }
        
        container ecommerceSystem "Containers" {
            include *
            autoLayout lr
        }
    }
}
```

## Architecture

### Components

- **App**: Main application orchestrator
- **DSLEditor**: Syntax-highlighted DSL editor with import/export
- **C4Diagram**: Interactive diagram renderer using React Flow
- **C4Node**: Custom node component for C4 elements
- **ViewSelector**: Layer switching interface

### Utilities

- **dslParser**: Structurizr DSL parsing engine
- **layoutEngine**: Automatic diagram layout algorithms
- **types**: TypeScript type definitions

### Key Features

1. **Real-time Parsing**: DSL is parsed and validated as you type
2. **Smart Layout**: Automatic positioning of elements based on C4 model hierarchy
3. **Interactive Elements**: Draggable nodes with proper C4 styling
4. **Error Handling**: Clear error messages with line highlighting
5. **Responsive Design**: Works on desktop and tablet devices

## Customization

### Styling

The application uses Tailwind CSS with custom C4 model colors defined in `tailwind.config.js`:

```javascript
c4: {
  person: '#08427b',
  system: '#1168bd',
  container: '#438dd5',
  component: '#85bbf0',
  database: '#ff8c00',
  external: '#999999',
}
```

### Adding New Element Types

To add support for new element types:

1. Update the `C4Element` type in `src/types/c4.ts`
2. Add parsing logic in `src/utils/dslParser.ts`
3. Update the `C4Node` component styling
4. Add layout logic in `src/utils/layoutEngine.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Structurizr](https://structurizr.com/) for the DSL specification
- [React Flow](https://reactflow.dev/) for the diagram rendering
- [C4 Model](https://c4model.com/) for the architectural modeling approach
