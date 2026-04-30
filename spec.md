# bentoo — Technical Specification

## Product Vision

Bentoo is a personal website builder for hobbyists and enthusiasts. Users compose multi-page sites by dragging components onto a canvas, then publish them to wildcard subdomains.

Core concept:
- Drag-and-drop page editor powered by Craft.js.
- Users build multi-page sites from a prebuilt component library.
- Sites are persisted to InstantDB (future phase). For now, persistence is localStorage only.
- Public sites render via a read-only PublicRenderer and are served on wildcard subdomains (\*.frooty.ninja).
- Guest-first: the editor works without auth. Auth and persistence are layered on later.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | File-based routing, SSR for public sites, one codebase |
| Language | TypeScript 5.x | Type safety across editor and renderer |
| Styling | Tailwind CSS 4.x | Utility-first, responsive by default |
| Editor Engine | @craftjs/core | Declarative node tree, built-in drag-and-drop, serialization |
| Icons | @heroicons/react | Consistent icon set |
| UI Components | Headless UI | Accessible primitives, styled with Tailwind + custom tokens |
| Backend (planned) | InstantDB (@instantdb/react) | Client-first, real-time, auth built-in, no backend boilerplate |

---

## Architecture

### File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, metadata, font loading
│   ├── page.tsx                # Landing page (marketing)
│   ├── editor/
│   │   └── page.tsx            # Craft.js editor canvas
│   └── globals.css             # Tailwind v4 imports + theme tokens
├── components/editor/
│   ├── Viewport.tsx            # Editor shell (Header + Toolbox + Canvas + Sidebar)
│   ├── Header.tsx              # Top bar (undo/redo, save/load, edit toggle)
│   ├── Toolbox.tsx             # Left panel (draggable component list)
│   ├── Sidebar.tsx             # Right panel (Customize + Layers tabs)
│   ├── Layers.tsx              # Node tree view
│   ├── RenderNode.tsx          # Portal-based selection/hover UI wrapper
│   ├── SettingsPanel.tsx       # (placeholder) Floating props panel
│   ├── craft/                  # Craft.js User Components
│   │   ├── Container.tsx       # Flex layout block with canvas support
│   │   ├── Text.tsx            # Editable text (contentEditable)
│   │   ├── Image.tsx           # Image block with sizing controls
│   │   ├── Button.tsx          # Link/button with variants
│   │   └── Resizer.tsx         # Resize handles for containers
│   └── toolbar/                # Shared toolbar primitives
│       ├── ToolbarSection.tsx
│       ├── ToolbarItem.tsx
│       ├── ToolbarDropdown.tsx
│       ├── ToolbarRadio.tsx
│       ├── ToolbarSpacingGroup.tsx
│       └── ToolbarTextInput.tsx
└── lib/
    └── utils.ts                # cn(), debounce, validators
```

### Craft.js Patterns

These patterns are already in the codebase and should be preserved when editing:

**Selection / Hover UI**
Editor onRender={RenderNode} wraps every node. RenderNode uses ReactDOM.createPortal to draw selection borders and a label toolbar outside the component tree, targeting .page-container. This prevents clipping by overflow: hidden parents and avoids layout shifts. Position is tracked via ResizeObserver + getBoundingClientRect on the node's DOM element.

**Text Editing**
Text uses contentEditable with onDoubleClick to enter edit mode. Escape or onBlur saves text to props via setProp. While editing, connect(drag(ref)) is skipped so typing doesn't trigger drag.

**Settings Data Layer**
Each User Component exposes its settings form in .craft.related.toolbar. The editor reads state.nodes[selectedId]?.related to render it in the sidebar. Whether rendered in a sidebar or floating panel, the data layer is the same.

**Root Canvas**
The default tree uses a Container with canvas as the root node inside Frame. This gives us layout primitives (direction, gap, padding) immediately.

**React 19 Compatibility**
The Accessing element.ref was removed in React 19 warning is a known Craft.js upstream issue (#744). It appears once on first load and does not affect functionality. Do not suppress it — it hides real errors.

### Component Extension Pattern

To add a new User Component:

1. Create src/components/editor/craft/YourComponent.tsx
2. Wrap with React.forwardRef, use useNode() inside
3. Attach connectors.connect and connectors.drag to the outer DOM element
4. Define a static .craft property with displayName, props, rules, and related.toolbar
5. Add to the resolver in app/editor/page.tsx
6. Add to Toolbox.tsx for drag-out creation

---

## Implementation Plan

### Phase 1 — Branding & Foundation (Completed)

**Goal:** Codebase reflects Bentoo identity. No references to nblog or blog editor.

**Tasks:**
- Rename package to bentoo
- Update all user-facing copy (Editor header, placeholder text, metadata)
- Update localStorage key to craft:bentoo:json
- Delete dead code (Topbar.tsx)
- Update README.md

**Success Metrics:**
- Zero references to nblog, blog editor, or Blog Title
- yarn build passes
- Editor loads with Bentoo Editor header

---

### Phase 2 — Headless UI Design System (Current)

**Goal:** Solidify Headless UI as our accessible primitive layer and extend it with missing components.

**Tasks:**
- Document design tokens and styling conventions (see AGENTS.md)
- Fix existing Headless UI implementations (hover states, focus rings, positioning)
- Replace hand-rolled switch in ToolbarItem with Headless UI `Switch`
- Add new Headless UI primitives as needed: `Dialog` (template picker), `Popover` / `Menu` (header dropdowns), `Combobox` (searchable selects)
- Ensure all state styling uses `data-[selected]`, `data-[checked]`, `data-[open]`, `data-[hover]` consistently

**Success Metrics:**
- All UI components use Headless UI primitives (no hand-rolled accessible widgets)
- Visual consistency across panels
- Token system is documented and enforced

---

### Phase 3 — Template System

**Goal:** Users can start from prebuilt layouts.

**Tasks:**
- Create 3 starter templates: Portfolio, Landing Page, Resume
- Build template picker modal (Headless UI Dialog)
- Store templates as JSON trees (Craft.js serialized format)
- On first editor load, show template picker
- Add New Page from Template in editor

**Success Metrics:**
- Template picker appears on first visit
- Each template loads a complete multi-component layout
- Templates are visually distinct and production-ready

---

### Phase 4 — Navigation & Settings

**Goal:** Simple navigation between pages and site settings.

**Tasks:**
- Add bottom bar with page list + settings button
- Build settings sheet (site name, meta description, favicon URL)
- Wire settings to head metadata
- Add page rename/delete
- Persist pages to localStorage as a multi-page tree

**Success Metrics:**
- Bottom bar shows current page and settings button
- Settings sheet opens/closes smoothly
- Changing site name updates document title
- Multiple pages can be created and switched

---

### Phase 5 — InstantDB Migration

**Goal:** Replace localStorage with InstantDB for auth + persistence.

**Tasks:**
- Install @instantdb/react
- Define schema: sites, pages, $users, $files
- Push schema and permissions via CLI
- Build auth modal (magic code sign-in)
- Migrate save/load to InstantDB transactions
- Add guest-to-auth migration prompt
- Wire storage for image uploads (link $files to entities)

**Success Metrics:**
- Users can sign in with email + magic code
- Sites persist across devices and sessions
- Guest users see a Sign in to save nudge
- Images upload to Instant storage

---

### Phase 6 — Vercel Deployment

**Goal:** Production deployment with wildcard subdomains.

**Tasks:**
- Configure Vercel project
- Set up wildcard subdomain routing (*.frooty.ninja)
- Build public renderer (read-only Craft.js tree)
- Add publish button that sets publishedAt timestamp
- Middleware rewrites subdomain to site page
- Inject site settings into head for SEO

**Success Metrics:**
- yarn build produces a production bundle
- Visiting yoursite.frooty.ninja renders the published site
- Unpublished sites show 404
- Published sites have correct meta tags

---

## Appendix: Component Registry

| Component | Props | Description |
|---|---|---|
| Container | padding, margin, bg, direction, gap, align, justify | Flex layout block, can be a canvas |
| Text | text, tag, fontSize, fontWeight, color, align | Editable text (h1-h6, p) |
| Image | src, alt, width, height, objectFit, shadow | Image with sizing controls |
| Button | label, href, variant, size, target | Link/button with variants |

---

_— End of Document —_
