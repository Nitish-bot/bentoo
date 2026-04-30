# AGENTS.md — bentoo

Behavioral guidelines and project-specific conventions. Merge with task instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Repo-Specific Conventions

### Stack & Tooling

- **Package manager:** Yarn (`yarn.lock` checked in). Use `yarn install`, never `npm install`.
- **Dev server:** `yarn dev` runs Next.js 16 with `--turbopack`.
- **Build:** `yarn build` also uses `--turbopack`.
- **Lint:** `yarn lint` (ESLint 9 flat config via `eslint.config.mjs`).
- **Format:** `yarn format` runs Prettier with `prettier-plugin-tailwindcss`.
- **Tailwind v4:** Import via `@import 'tailwindcss'` in `globals.css`. No `tailwind.config.ts`. Custom theme tokens go in `@theme inline`.
- **Path alias:** `@/*` maps to `./src/*`.

### Entrypoints & Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | **Landing page** (marketing, not the editor) |
| `/editor` | `app/editor/page.tsx` | Craft.js editor canvas |

The editor was originally at `/`. It has been moved to `/editor`. Do not revert this.

### Craft.js — Current Implementation

These patterns used in the codebase are:

- **Selection / hover UI:** `Editor onRender={RenderNode}` draws borders and a label toolbar via `ReactDOM.createPortal` to `.page-container`. This prevents clipping by `overflow: hidden` and avoids layout shifts.
- **Text editing:** `Text` uses `contentEditable` with `onDoubleClick` to enter edit mode. `Escape` or `onBlur` saves text to props via `setProp`. While editing, `connect(drag(ref))` is skipped so typing doesn't trigger drag.
- **Settings data layer:** Each User Component exposes its settings form in `.craft.related.toolbar`. The editor reads `state.nodes[selectedId]?.related` to render it in the sidebar.
- **Root canvas:** The default tree uses a `Container` with `canvas` as the root node inside `<Frame>`.
- **React 19 upstream warning:** `"Accessing element.ref was removed in React 19"` is a known Craft.js issue (#744). It appears once on first load and does not affect functionality. Do **not** suppress it — it hides real errors.

### Design System — Headless UI + Custom Tokens

**Decision:** We use `@headlessui/react` as our accessible primitive layer and style it with Tailwind + custom CSS tokens. We do **not** use shadcn/ui.

**Token source of truth:** `src/app/globals.css` defines all theme values as CSS custom properties in `@theme inline`:

| Token | Purpose |
|-------|---------|
| `--color-bg-canvas` | Page background (#f8f7f4) |
| `--color-bg-surface` | Cards, inputs, panels (#ffffff) |
| `--color-bg-surface-hover` | Hover state for surfaces |
| `--color-bg-surface-active` | Active/pressed state for surfaces |
| `--color-text-primary` | Headings, primary text (#1a1a1a) |
| `--color-text-secondary` | Labels, secondary text (#6b6560) |
| `--color-text-muted` | Placeholders, disabled text (#a39e99) |
| `--color-accent` | Primary accent — purple (#8b7ec7) |
| `--color-accent-hover` | Accent hover state |
| `--color-accent-subtle` | Focus rings, subtle highlights |
| `--color-border` | Dividers, borders (rgba black 0.06) |
| `--shadow-border` | 3-layer shadow that mimics a 1px border |
| `--shadow-border-hover` | Slightly stronger border shadow |
| `--shadow-elevated` | Dropdowns, modals, popovers |
| `--shadow-glow` | Focus ring glow |

**Styling conventions for Headless UI components:**
- State styles use Headless UI's `data-[selected]`, `data-[checked]`, `data-[open]`, `data-[hover]` attributes.
- Focus rings: `focus:outline-none focus:ring-2` with `--tw-ring-color: var(--color-accent-subtle)`.
- Hover backgrounds on list options: `hover:bg-[var(--color-accent-subtle)]` or `data-[hover]:bg-[var(--color-accent-subtle)]`.
- All interactive surfaces use `transition-[box-shadow] duration-150` or `transition-colors duration-150`.
- Buttons and toolbox items use `active:scale-[0.96]` for tactile press feedback.
- Panels use `backdrop-filter: blur(12px)` with `rgba(255,255,255,0.7)` — always pair these together.

**Toolbar control patterns:**
- Labels are `text-xs font-medium` with color `var(--color-text-secondary)`.
- Inputs and buttons are `rounded-lg bg-surface shadow-border`.
- Radio groups use `bg-surface-active` as the track and `accent` as the checked pill.
- Dropdowns use `shadow-elevated` for the options panel.

**Headless UI primitives currently in use:**
- `TabGroup` / `TabList` / `Tab` / `TabPanels` / `TabPanel` — sidebar tabs
- `Disclosure` / `DisclosureButton` / `DisclosurePanel` — collapsible sections (ToolbarSection, SidebarItem)
- `Listbox` / `ListboxButton` / `ListboxOptions` / `ListboxOption` — dropdown selects
- `RadioGroup` / `Radio` — segmented controls

**Headless UI primitives to adopt for future features:**
- `Switch` — toggle controls (replace the hand-rolled switch in ToolbarItem)
- `Dialog` — template picker, auth modal, confirmations
- `Popover` / `Menu` — header dropdowns, context menus
- `Combobox` — searchable selects if needed

### Code Style

- Indent: 2 spaces.
- Quotes: single.
- Semicolons: required (Prettier enforces this).
- Max line length: 200 (ESLint `max-len`).
- `console.log` is warned; `console.warn/error/info` are allowed.

### Writing & Tone

- **Human-like copy:** All user-facing text should read naturally, not like AI-generated content. Avoid patterns like "Unlock your potential", "Empower", "Seamless", "Revolutionary".
- **Direct and clear:** Write like you're explaining to a friend. Short sentences. Active voice.
- **Product name:** Always "Bentoo" (capitalized), never "bentoo" in user-facing copy.

---

## Product Vision

Bentoo is a personal website builder for hobbyists and enthusiasts alike.

Core concept:
- Drag-and-drop page editor powered by Craft.js.
- Users build multi-page sites from a prebuilt component library.
- Sites are persisted to InstantDB (future phase). For now, persistence is `localStorage` only.
- Public sites render via a read-only `PublicRenderer` and are served on wildcard subdomains (`*.frooty.ninja`).
- Guest-first: the editor works without auth. Auth and persistence are layered on later.

---

## Next Steps

1. **Landing page** at `/` — showcase the builder, link to `/editor`.
2. **Headless UI design system** — extend existing Headless UI primitives (Dialog, Popover, Menu, Switch) for upcoming features. Document and enforce the token system.
3. **Prebuilt templates** — a small set of starter layouts users can pick when entering the editor.
4. **Simple navigation** — between landing page, editor, templates, and placeholder settings.
5. **Settings placeholders** — site-level settings sheet (name, meta, favicon) wired to UI but not yet persisted.
6. **InstantDB integration** — migrate from `localStorage` to InstantDB for auth, storage, and real-time persistence. Use `@instantdb/react` and follow the instantdb skill patterns.
7. **Deploy to Vercel** — ensure `next.config.ts` is production-ready and environment variables are documented.

---

## Deployment

- **Target:** Vercel.
- **Domain:** `*.frooty.ninja` for wildcard subdomains.
- **Build command:** `yarn build` (uses `--turbopack` automatically via `package.json` scripts).
- **Environment variables:** Copy from `.env.example`. Currently only `CONTEXT7_API_KEY` is documented there; add others as they are introduced.

## Keep Documentation in Sync

If it changed in code, it must change in docs:
- `AGENTS.md` — behavioral guidelines and conventions (this file).
- `README.md` — project overview and quick start.
- `spec.md` — technical specification and phase definitions.
