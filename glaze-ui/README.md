# GLAZE UI

> The ultra-performance, physics-backed UI laboratory. Create, customize, and morph high-fidelity glassmorphic animations powered by GSAP and an intelligent AI compilation engine.

Glaze UI is a premium, desktop-first **Control Deck** that treats user interface elements like physics experiments. Instead of cutting and pasting generic, static elements, developers can visually manipulate fluid animation variables (mass, viscosity, backdrop-blur) in real-time. An integrated AI **Code-Morph** compiler automatically serializes your custom physics parameters and translates the component into React, Vue, or Vanilla JS with Tailwind utilities or raw CSS.

---

## System Architecture & Folder Scaffold

Glaze operates on a **Data-Driven Component Registry Pattern**. The dashboard cards and the workspace parameters are mapped directly out of structural metadata configurations. Adding new components requires zero routing modifications.

```text
glaze-ui/
├── public/
│   └── assets/                     # Branding, SVGs, and graphics
├── src/
│   ├── components/                 # System Core UI Layout
│   │   ├── DashboardGrid.jsx       # Renders registry elements dynamically
│   │   ├── ControlDeck.jsx         # Component workbench layout
│   │   ├── Sidebar.jsx             # Hardware-accelerated collapsible nav
│   │   └── ui/                     # Glaze's internal global UI feedback
│   │       ├── GlazeLoader.jsx     # Three-dot continuous stagger loader
│   │       ├── GlazeSiteToast.jsx  # Bottom-right dismissal alert tracker
│   │       └── GlazeSiteModal.jsx  # Center-stage elastic modal dialog
│   │
│   ├── registry/                   # THE ENGINE MATRIX
│   │   ├── index.js                # Master data hub exporter
│   │   ├── toasts.js               # Metadata and parameter configurations
│   │   ├── modals.js               
│   │   └── loaders.js              
│   │
│   └── library/                    # Open-Source Component Core Blueprints
│       ├── toasts/
│       │   ├── liquid-toast/       # Flagship fluid component case
│       │   │   ├── index.jsx       # Sandbox rendered target
│       │   │   ├── style.css       # Translucent glass layer CSS
│       │   │   └── meta.json       # Component metadata and configuration
│       │   └── paper-receipt-toast/
│       ├── modals/
│       │   ├── glassmorphic-liquid-modal/
│       │   └── paper-origami-modal/
│       └── loaders/
│           ├── glassmorphic-liquid-loader/
│           └── paper-fold-loader/
```

---

## Key Feature Matrix

| Feature | Technology | Description |
| --- | --- | --- |
| **Mercury Chamber** | React + Canvas Mesh | An isolated preview grid featuring high-contrast ambient glow backdrops to emphasize transparency. |
| **Liquid Physics Engine** | GSAP 3 + CSS Modules | Non-uniform `border-radius` morphs linked directly to viscosity and elasticity sliders. |
| **AI Code-Morph Compiler** | Edge Route + LLM API | Translates live sandbox settings instantly into any target frontend language framework. |
| **Registry-Driven Navigation** | React Context + GSAP | Dynamic sidebar with category filtering, search, and live component list updates. |
| **Paper Theme System** | GSAP Timelines + CSS | Warm kraft, ivory, and parchment tones with tactile paper-folding and receipt-slide animations. |
| **Telemetry Caching** | LocalStorage API | Automatically tracks and saves customized component variations on a per-id basis. |

---

## Getting Started

### 1. Installation

Clone the repository and install the engineering core dependencies:

```bash
git clone https://github.com/fwesh001/glaze-ui.git
cd glaze-ui
npm install
```

### 2. Configuration Env

To unlock the intelligent **AI Code-Morph Pipeline**, create an `.env.local` file in the root directory and append your completion credentials:

```env
NEXT_PUBLIC_AI_COMPILER_KEY=your_edge_llm_api_key_here
```

### 3. Initialize Laboratory

Fire up the local dark-room server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your browser to access the control deck viewport.

### 4. Registry Generation

Auto-generate component registries from meta.json files:

```bash
npm run generate:registry
```

This runs before each build automatically via the `prebuild` npm hook.

---

## Customizing Components (The Registry Blueprint)

To launch a brand new component into the Glaze ecosystem, create a metadata config file (`meta.json`) in the component directory:

```json
{
  "id": "your-premium-component",
  "name": "Liquid Cyber Toast",
  "category": "toast",
  "description": "Highly reactive fluid layout with custom state alerts.",
  "aliases": ["old-component-name"],
  "settingsConfig": [
    { "id": "viscosity", "label": "Fluid Density", "type": "slider", "min": 0.1, "max": 2, "default": 1 },
    { "id": "blur", "label": "Glass Prism Blur", "type": "slider", "min": 5, "max": 40, "default": 20 }
  ]
}
```

Then export your component in the directory's `index.jsx`. The registry generator will automatically:
- Scan all `meta.json` files
- Build component registries by category
- Create alias mappings for legacy IDs
- Update the dashboard without manual modifications

---

## Component Architecture

All Glaze components follow a unified pattern:

- **Liquid Variants**: Physics-driven animations with glassmorphic styling
- **Paper Variants**: Warm tactile designs with fold and receipt-inspired animations
- **Settings Config**: Declarative control parameters in meta.json
- **GSAP Timelines**: Hardware-accelerated, infinite-loop animations
- **Live Preview**: Real-time settings binding via WorkspaceProvider context

---

## Internal UI Utilities

Glaze includes three ready-to-use feedback components for system-wide integration:

### GlazeLoader
```jsx
import { GlazeLoader } from '@/components/ui';

export default function MyPage() {
  return <GlazeLoader />;
}
```
Minimalist three-dot loader with continuous staggered scale animation.

### GlazeSiteToast
```jsx
import { GlazeSiteToast } from '@/components/ui';
import { CheckCircle2 } from 'lucide-react';

export default function MyPage() {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <button onClick={() => setShowToast(true)}>Show Toast</button>,
    showToast && (
      <GlazeSiteToast
        message="Operation completed!"
        icon={CheckCircle2}
        onDismiss={() => setShowToast(false)}
      />
    )
  );
}
```
Fixed bottom-right notification with icon, message, and dismiss action.

### GlazeSiteModal
```jsx
import { GlazeSiteModal } from '@/components/ui';

export default function MyPage() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <button onClick={() => setShowModal(true)}>Open Modal</button>,
    showModal && (
      <GlazeSiteModal
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        ctaLabel="Confirm"
        onConfirm={() => { /* handle confirm */ setShowModal(false); }}
        onClose={() => setShowModal(false)}
      />
    )
  );
}
```
Centered modal with backdrop overlay, title, message, and dual action buttons.

---

## Sidebar Navigation

The sidebar provides dynamic category-based component browsing:

- **Category Tabs**: Switch between All, Toasts, Modals, and Loaders
- **Search Filtering**: Real-time component search across name, category, description, and ID
- **Collapsed State**: Minimalist icon buttons for category switching when sidebar is collapsed
- **Live Selection**: Current component highlighted with cyan glow
- **Responsive**: Hardware-accelerated collapse/expand via GSAP

---

## Development Workflow

1. Add a new component folder under `src/library/{category}/{component-name}/`
2. Create `index.jsx` with your component export
3. Create `style.css` for localized animations and theming
4. Create `meta.json` with component metadata and settings configuration
5. Run `npm run generate:registry` to auto-register
6. Navigate to the dashboard and select your new component
7. Adjust settings in the ControlPanel and preview in MercuryChamber

---

## Build & Deploy

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Registry generation (runs automatically before build)
npm run generate:registry
```

---


Built by [zabdiel](https://zabdiel.tech) for the next generation of frontend interfaces.
