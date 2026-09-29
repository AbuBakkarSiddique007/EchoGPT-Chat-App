# EchoGPT Chat — Web App

The web application for **EchoGPT**, a multi-model AI workspace. This repository holds
the complete front end: the chat interface, conversation management, theming, and the
transport layer the interface talks to.

> This is a front-end-only project. There is no API, no authentication, no database, and
> no server-side persistence. Replies are produced by a local transport adapter that
> pattern-matches the prompt and returns a canned response.

| | |
| --- | --- |
| **Route** | `/` — server-rendered on every request |
| **Environment variables** | None |
| **State** | In memory; a refresh restores the seven seeded conversations |
| **Tests** | None — no runner is installed |
| **Package manager** | pnpm `10.28.1`, pinned via `packageManager` |
| **Node.js** | ≥ 20.9 (Next.js 16 requirement; not enforced by an `engines` field) |

---

## Contents

1. [Feature status](#feature-status)
2. [Architecture](#architecture)
3. [The transport layer](#the-transport-layer)
4. [Navigation](#navigation)
5. [Design system](#design-system)
6. [Theming](#theming)
7. [Requirements](#requirements)
8. [Project structure](#project-structure)
9. [Verification](#verification)
10. [Deployment](#deployment)
11. [Dependencies](#dependencies)
12. [Conventions](#conventions)
13. [Git workflow](#git-workflow)

---

## Feature status

| Capability | State |
| --- | --- |
| Send a message and receive a response | Working, via the local adapter |
| Conversation list with search, rename, delete | Working, in memory |
| Prompt starters and empty state | Working |
| Message timeline with scroll anchoring | Working |
| Dark, light, OLED, and system themes | Working |
| Collapsible sidebar, persisted | Working |
| Real model responses | Not implemented |
| Streaming responses | Not implemented — the status types exist but the adapter resolves in one shot |
| Conversation persistence | Not implemented |
| Account, billing, settings | Disabled |
| All thirteen secondary destinations | Disabled |

Anything unimplemented is marked honestly: `aria-disabled="true"`, a `title` explaining
the state, `cursor-not-allowed`, and a visible "Soon" or "Pro" badge. Colour is never the
sole signal. No control links to a route that does not exist.

---

## Architecture

```
src/app/page.tsx
└── ChatProvider                    conversation state + chat state
    └── AppFrame                    server component: viewport frame, aurora, dot grid
        ├── DesktopSidebar          280/320px, collapses to a 68px rail
        │   └── SidebarContent      shared with the mobile drawer
        ├── MobileSidebar           Sheet, hidden above lg
        └── main
            ├── ChatTopbar
            └── ConversationStage
                ├── EmptyChatState → PromptStarters | CapabilityCards
                ├── MessageList → MessageItem → MessageActions
                └── Composer
```

State is split across two hooks and merged by `ChatProvider`.

**`useConversationState`** — a `useReducer` store covering conversations and a draft map:
create, select, rename, delete, append a message, and set a draft. It also derives search
filtering and auto-titles a new conversation from its first prompt, truncated to 48
characters.

**`useChatState`** — the request lifecycle, modelled as `idle | sending | streaming |
error`, with an in-flight guard that prevents double submission and a `sendMessage`
action.

`src/data/demo-conversations.ts` seeds seven conversations with relative timestamps,
spanning eighteen minutes to twelve days back, so the Today / Yesterday / Older grouping
is always populated in a fresh session.

---

## The transport layer

`src/lib/chat-adapter.ts` is the single seam where a real backend would be introduced.

```ts
export type ChatRequest = { conversationId: string; history: Message[] };
export type ChatCompletion = { content: string; model: string };

export interface ChatTransport {
  send(request: ChatRequest, signal?: AbortSignal): Promise<ChatCompletion>;
}

export function createLocalTransport(latencyMs = 400): ChatTransport;
```

The local implementation waits for the given latency, honours the `AbortSignal`, and
returns one of three regex-matched responses — SQL, drafting, or debugging — falling back
to an echo of the prompt. Every response is explicitly labelled as a local preview, so a
screenshot can never be mistaken for real model output.

To connect a real service, implement `ChatTransport` against the live endpoint and change
the factory call in `ChatProvider`. Nothing above that line needs to change.

### Supporting modules

| File | Responsibility |
| --- | --- |
| `chat-adapter.ts` | Transport interface and the local implementation |
| `chat-formatting.ts` | Timestamps, fenced code blocks, inline bold and code spans |
| `conversation-groups.ts` | Buckets conversations into Today, Yesterday, and Older |
| `theme.ts` | Theme types, storage, resolution, pre-paint script |
| `sidebar-pref.ts` | Sidebar collapse preference and its pre-paint script |
| `composer-events.ts` | Focus event name shared across components |
| `utils.ts` | `cn` class-name helper |

---

## Navigation

The sidebar is fixed at thirteen destinations across two groups, alongside a "New Chat"
action, the usage meter, the Pro card, and the account footer.

**Engagement** — Image Studio (Pro), Video Studio (Pro), Compare, Connectors, Store,
AI Tasks, AI Job Analysis, AI SOP Builder

**Help & Support** — Support, Newsletter, Subscriptions, API Platform, Discord

Every destination in both groups is disabled. Pro entries render a pill and a coloured
dot on the icon; the rest render a text badge.

Engagement displays its first three entries and collapses the remaining five behind a
`More (5)` control. Support always displays all five.

The sidebar measures 280px at `lg` and 320px at `xl`, collapsing to a 68px icon rail.
Collapsed labels use `clip-path: inset(50%)` so they remain in the accessibility tree,
while visually hidden children are removed from the tab order. The preference persists
under the `echogpt-sidebar` key.

---

## Design system

`src/styles/tokens.css` carries the EchoGPT brand, aligned with the marketing site.

```css
--echo-brand-600: #7650ec;   /* canonical violet */
--echo-azure:     #4979fb;
--echo-aurora-magenta: #f7306e;
--echo-aurora-cyan:    #00aeff;
```

Beyond the shared brand, surfaces, and aurora set, this application adds chat-specific
tokens: the focus ring, safe-area insets, scrollbar sizing and thumb colours, the sidebar
rail width, and the collapse transition duration and easing curve.

### Token namespacing

Shadows are declared as `--echo-shadow-sm | md | lg | glow` rather than the bare
`--shadow-*` names. Tailwind v4 ships its own `--shadow-md` and `--shadow-lg` as built-in
theme variables, and because `tokens.css` is imported before `tailwindcss`, an unprefixed
declaration loses the cascade and silently resolves to Tailwind's light-mode default
instead of the intended dark-surface value. The `echo-` prefix keeps the application's
shadows authoritative. The same rule applies to any new token whose name could collide
with a Tailwind built-in.

### Divergence from the marketing site

The `--text-muted`, `--text-dim`, and light-theme `--text-secondary` values have drifted
from the landing page, and this project no longer carries the landing page's per-model
brand colours. The values here are the more recent ones. Reconcile both files if the two
applications must render identically.

---

## Theming

Four options, selectable from a menu in the sidebar footer.

| Option | Behaviour |
| --- | --- |
| System | Follows the operating system preference |
| Light | `[data-theme="light"]` |
| Dark | `[data-theme="dark"]` — the default |
| OLED | `[data-theme="oled"]` — true black surfaces |

The preference persists under `echogpt-theme`. Because dark is the default rather than
the absence of an attribute, the Tailwind `dark:` variant keys off an explicit
`[data-theme="dark"]` selector.

`layout.tsx` injects two blocking scripts before the first paint — one from `theme.ts`
and one from `sidebar-pref.ts` — so both the theme and the sidebar state are correct
before anything renders. This removes the flash that a post-hydration effect would
otherwise cause. Both scripts are wrapped in `try/catch`, so a blocked `localStorage`
degrades to defaults rather than throwing.

---

## Requirements

- **Node.js** ≥ 20.9, the Next.js 16 floor. No `engines` field pins this.
- **pnpm** `10.28.1`, enforced through the `packageManager` field by Corepack.

```bash
corepack enable
pnpm install
pnpm dev
```

The development server listens on <http://localhost:3000>.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint using the flat configuration |
| `pnpm exec tsc --noEmit` | Type-check the project |

`pnpm lint` invokes `eslint` without a path argument, so it always lints the project root.
To scope it, call `pnpm exec eslint <path>` directly.

### Development notes

- **Type-check after a build.** The root layout uses the global `LayoutProps<"/">` type
  that Next.js generates into `.next/types` during `build` or `dev`. Running
  `tsc --noEmit` against a clean `.next` fails with `Cannot find name 'LayoutProps'`.
- **`build` and `dev` share the `.next` directory.** Building while a development server
  is running corrupts its state. Restart the development server after every build.
- **One development server per directory.** A second `next dev` in the same project exits
  immediately and redirects to the running instance.
- **`globals.css` reaches into `node_modules`.** `tw-animate-css` is imported by
  filesystem path because the package exposes only a `"style"` export condition, which the
  bare specifier cannot satisfy under Turbopack. The statement must stay inside the
  Tailwind pipeline, after the `tailwindcss` import, and must not be converted to a bare
  specifier or moved into `layout.tsx`.
- **Fonts are fetched during the build.** `next/font/google` retrieves Plus Jakarta Sans
  and JetBrains Mono at build time. An offline build fails or falls back to a system
  stack.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx        Root layout, fonts, metadata, pre-paint scripts
│   ├── page.tsx          Composition root
│   ├── globals.css       Token bridge, shadcn contract, custom utilities
│   └── icon.svg          Favicon
├── components/
│   ├── brand/            Logo
│   ├── chat/             Composer, message list, empty state, capability cards
│   ├── conversations/    List, row, menu, search
│   ├── layout/           App frame, sidebars, topbar
│   ├── providers/        Chat and theme providers
│   └── ui/               Nine shadcn base-nova primitives
├── data/
│   └── demo-conversations.ts
├── hooks/
│   ├── useChatState.ts
│   └── useConversationState.ts
├── lib/                  See the transport layer section
├── styles/
│   └── tokens.css        Brand and chat tokens — source of truth
└── types/
    └── chat.ts

public/logo-echogpt.svg
```

The path alias `@/*` resolves to `src/*`. Twenty-three of the forty-nine tracked files
under `src/` are React Client Components; the remainder are Server Components.

---

## Verification

There is no test framework and no `test` script. Lint and type-check are the available
gates, and both pass on the current tree:

```bash
pnpm lint
pnpm build && pnpm exec tsc --noEmit
```

A production build completes with `/` emitted as dynamic and `/icon.svg` and
`/_not-found` as static.

Accessibility was reviewed manually: every disabled control carries `aria-disabled` with
an explanatory `title`, the logo is correctly marked decorative with an empty `alt`, and
the heading order steps from `h1` to `h2` to `h3` without skipping levels.

---

## Deployment

No environment variables, API keys, or configuration are required. `next.config.ts` is
empty and the application makes no remote image requests; all iconography is
`lucide-react` and the only local asset is `public/logo-echogpt.svg`.

| Setting | Value |
| --- | --- |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Output / publish directory | `.next` |
| Node.js | 20 or newer |
| Framework preset | Next.js — detected automatically |

On Vercel, import the repository and the remaining settings are detected. On Netlify, set
the build command and publish directory above; add `@netlify/plugin-nextjs` if the
framework is not detected automatically.

### Two things to know before shipping

- **The root route is server-rendered on every request.** `page.tsx` sets
  `export const dynamic = "force-dynamic"`, so the route is billed as a function
  invocation rather than served from cache. The application holds all state on the client
  and would work as static output; this is a deliberate choice while the transport layer
  is local.
- **The topbar carries a "Static preview" badge.** Remove it, along with the response
  labelling in `chat-adapter.ts`, once a real backend is connected.

---

## Dependencies

| Package | Version | Role |
| --- | --- | --- |
| next | 16.3.6 | Framework, pinned |
| react / react-dom | 19.2.8 | Runtime, pinned |
| tailwindcss | ^4 | Styling, CSS-first configuration |
| @base-ui/react | ^1.8.0 | Primitive layer for shadcn — not Radix |
| shadcn | 4.21.0 | Component CLI, style `base-nova` |
| lucide-react | ^1.48.0 | Icons |
| cmdk | ^1.1.1 | Command palette primitive |
| clsx, tailwind-merge, cn | — | Class-name composition |

Primitives are generated against **`@base-ui/react`**. Radix-based documentation does not
apply; consult the installed primitive's own API before use.

```bash
pnpm exec shadcn add <component>
```

Only primitives that are actually imported are kept in `src/components/ui/`. Unused
generated files are removed rather than carried, and can be regenerated on demand.

---

## Conventions

- Server Components by default. `"use client"` appears only where state, effects, or
  browser APIs require it.
- Types are declared in `src/types/chat.ts`: `MessageRole`, `MessageStatus`, `ChatStatus`,
  `Message`, `Conversation`, `ConversationGroupKey`, `ConversationGroup`, and `DraftMap`.
- Hooks live in `src/hooks/`, one file per state slice.
- Demo data lives in `src/data/` and is clearly separated from real transport code.

---

## Git workflow

`main` receives merges from `development`, which receives merges from `feature/*` branches
using `--no-ff`. Commit messages follow the Conventional Commits specification.

```
feat(sidebar): add collapsible icon rail for large viewports
fix(chat): resolve hydration mismatch
chore(init): initialize project starter
```

`development` currently stands at 26 commits, in sync with `origin/development`, with a
clean working tree once the changes in this branch are merged. All three feature branches
— `feature/composer-ui`, `feature/sidebar-collaps`, and `feature/theme-preferences` — are
already merged and can be pruned.

---

## License

Private and proprietary. All rights reserved.
