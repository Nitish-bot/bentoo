# bentoo

A drag-and-drop website builder built with [Next.js](https://nextjs.org) and [Craft.js](https://craft.js.org/).

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, or go straight to [http://localhost:3000/editor](http://localhost:3000/editor) to start building.

## Using the Editor

The editor lives at `/editor`. You compose pages by dragging components onto the canvas and tweaking them in the sidebar.

### Layout

| Area | Location | Purpose |
|------|----------|---------|
| **Header** | Top | Undo / Redo, Save / Load, toggle Edit/Preview |
| **Toolbox** | Left panel | Drag components onto the canvas |
| **Canvas** | Center | Your page content — click to select, drag to reorder |
| **Sidebar** | Right panel | Customize selected component props + Layers tree |

### Available Components

| Component | Description |
|-----------|-------------|
| **Container** | Flex layout block with padding, margin, background, gap, etc. |
| **Text** | Editable text with tag (h1–h6, p), font size, weight, color |
| **Image** | Image block with src, alt, dimensions, and object-fit |
| **Button** | Link/button with label, href, variant, and size |

### Workflow

1. **Drag** a component from the Toolbox onto the canvas.
2. **Click** a component on the canvas to select it.
3. **Customize** the selected component's props in the Sidebar (right panel, "Customize" tab).
4. **Reorder** by dragging components within the canvas or using the Layers tab.
5. **Nest** components by dragging them into a Container.

### Saving & Loading

Your work is saved to and loaded from **localStorage** under the key `craft:bentoo:json`.

- **Save** — Click the save button in the header. The editor state is serialized to JSON and stored locally.
- **Load** — Click the load button to restore the previously saved state.

There's no server-side persistence yet — all data lives in the browser.

### Preview Mode

Click **Finish Editing** in the header to switch to preview mode. The toolbox and sidebar hide, and the canvas becomes read-only so you can see how the page looks. Click **Edit** to go back.

## How Rendering Works

The editor uses Craft.js to manage a tree of nodes. Each node maps to a React component (Container, Text, Image, or Button).

### In the Editor

Craft.js wraps every component with `RenderNode`, which adds selection outlines, drag handles, and delete buttons. The component tree is rendered inside a `<Frame>` that Craft.js controls.

### Serialization

When you save, `query.serialize()` converts the node tree into a JSON string. Each node stores:

- Which component it is (e.g. `Container`, `Text`)
- Its props (e.g. `fontSize`, `text`, `src`)
- Its children (nested node IDs)
- Layout metadata (parent, position)

When you load, `actions.deserialize(json)` rebuilds the tree. The `resolver` map tells Craft.js which React component to instantiate for each node type.

### Rendering a Saved Page Outside the Editor

The serialized JSON (`craft:bentoo:json` in localStorage) contains all the data needed to render a page. To display it in read-only mode, use Craft.js with `enabled={false}`:

```tsx
import { Editor, Frame } from '@craftjs/core';
import { Container } from '@/components/editor/craft/Container';
import { Text } from '@/components/editor/craft/Text';
import { ImageNode } from '@/components/editor/craft/Image';
import { Button } from '@/components/editor/craft/Button';

const components = { Container, Text, ImageNode, Button };

export default function PageView({ json }: { json: string }) {
  return (
    <Editor resolver={components} enabled={false}>
      <Frame data={json} />
    </Editor>
  );
}
```

Pass `enabled={false}` so nodes render without editor chrome (no outlines, drag handles, or selection). The `data` prop on `<Frame>` accepts the serialized JSON string directly.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── editor/page.tsx       # Editor
│   └── globals.css           # Global styles
├── components/editor/
│   ├── Viewport.tsx          # Editor layout shell
│   ├── Header.tsx            # Top bar (undo, redo, save, load, edit toggle)
│   ├── Toolbox.tsx           # Left panel (draggable component list)
│   ├── Sidebar.tsx           # Right panel (customize + layers tabs)
│   ├── Layers.tsx            # Node tree view
│   ├── RenderNode.tsx        # Selection/drag UI wrapper for each node
│   ├── craft/
│   │   ├── Container.tsx     # Layout container component
│   │   ├── Text.tsx          # Text component
│   │   ├── Image.tsx         # Image component
│   │   ├── Button.tsx        # Button component
│   │   └── Resizer.tsx       # Resize handles for containers
│   └── toolbar/              # Shared toolbar controls (inputs, dropdowns, etc.)
└── lib/
    └── utils.ts              # Utility functions (cn, debounce, etc.)
```

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19**
- **Craft.js** for the drag-and-drop editor
- **Tailwind CSS 4**
- **Headless UI** for accessible UI primitives
- **Heroicons** for icons

## Next Steps

- shadcn/ui integration
- Prebuilt templates (Portfolio, Landing Page, Resume)
- Multi-page navigation and settings
- InstantDB for auth and persistence
- Wildcard subdomain publishing (`*.frooty.ninja`)
