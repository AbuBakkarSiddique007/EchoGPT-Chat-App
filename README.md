<div align="center">

# EchoGPT Chat

**A multi-model AI workspace — the complete front end for EchoGPT.**

[![Live on Vercel](https://img.shields.io/badge/Live-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://echo-gpt-chat-app.vercel.app)
[![Live on Netlify](https://img.shields.io/badge/Live-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://echo-gpt-chat-app.netlify.app)
[![Repository](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/AbuBakkarSiddique007/EchoGPT-Chat-App)

</div>

---

## Try it

| | |
| --- | --- |
| **Vercel** | <https://echo-gpt-chat-app.vercel.app> |
| **Netlify** | <https://echo-gpt-chat-app.netlify.app> |
| **Source** | <https://github.com/AbuBakkarSiddique007/EchoGPT-Chat-App> |

Both deployments serve the same build. No sign-up, configuration, or environment
variable is required.

## What this is

EchoGPT Chat is the web application for EchoGPT, a workspace that routes a request across
several frontier models. This repository contains the entire front end: the chat
interface, conversation management, four-theme switching, the design system, and the
transport layer the interface talks to.

**What this is not.** There is no backend. There is no API, no authentication, no
database, and no server-side persistence. Replies are produced by a local transport
adapter that pattern-matches your prompt and returns a canned response, and every reply
says so on its face. All state lives in the browser, so a refresh restores the seven
seeded conversations. This is a complete, honest, production-quality interface ahead of
its backend.

---

## How to test it

A guided walkthrough for reviewers. No setup required — open either live URL, or
[run it locally](#quick-start).

### 1. Send a message

Click any prompt starter on the empty state, or type into the composer and press
<kbd>Enter</kbd>. <kbd>Shift</kbd> + <kbd>Enter</kbd> inserts a newline instead.

| Try this prompt | Expected response |
| --- | --- |
| `Explain the rolling window in this SQL query` | A SQL answer with a formatted `RANGE BETWEEN … PRECEDING` code block |
| `Draft a pricing brief for the Pro tier` | A structured brief: opening line, three supporting points, objection, ask |
| `The app throws a stack trace on save, how do I debug it?` | A debugging answer with a formatted TypeScript code block |
| Anything else | An echo of your prompt, stating plainly that no model is attached yet |

**What to check:** the reply is explicitly labelled a local preview; inline `**bold**`,
`` `code` ``, and fenced code blocks all render correctly; the composer clears; the
conversation timestamp updates; the view scrolls to the new message.

### 2. Check the send guard

Press <kbd>Enter</kbd> rapidly on an empty composer. Nothing should duplicate, and a
second submission should be ignored while the first is in flight.

### 3. Manage conversations

| Action | How |
| --- | --- |
| Create | **New Chat** at the top of the sidebar |
| Auto-title | The new conversation takes its name from your first message, truncated to 48 characters |
| Rename | Hover a row → open the **⋯** menu |
| Delete | Hover a row → **⋯** → Delete |
| Search | The search field at the top of the sidebar; clear it with the **✕** |
| Grouping | Conversations bucket into **Today**, **Yesterday**, and **Older** automatically |

**What to check:** rename and delete apply immediately; search filters as you type; the
sidebar badge count updates.

### 4. Switch themes

Open the theme control in the sidebar footer and choose **System**, **Light**, **Dark**,
or **OLED**.

**What to check:** the change is instant, with **no flash of the wrong theme on reload** —
two scripts run before first paint, so this is a real property and worth confirming;
**OLED** is true black; the choice persists across refreshes.

### 5. Resize the sidebar

Drag or click to collapse it. **What to check:** it narrows to a 68px icon rail, the
labels stay reachable by screen reader, the preference persists, and it is 280px at `lg`
and 320px at `xl`.

### 6. Responsive behaviour

Narrow the window below 1024px, then below 640px.

**What to check:** the sidebar becomes a drawer opened by the hamburger (**Open EchoGPT
navigation**); the layout holds at 640, 768, 1024, and 1440px.

### 7. Verify the disabled states

The interface distinguishes working controls from placeholders. Try the paperclip,
model menu, prompt options, export, configuration, sign-in, and settings.

**What to check:** each is genuinely inert — it cannot be operated and links nowhere.
Each carries `aria-disabled`, an explanatory tooltip, and a visible **Soon** badge.
Colour is never the only signal. Try **Image Studio** and **Compare** in the sidebar and
confirm the same, plus the **Pro** pills.

### 8. Keyboard and screen reader

<kbd>Tab</kbd> through the interface. **What to check:** a visible focus ring on every
interactive element; disabled controls announced as disabled; message bubbles labelled
*Your message* and *EchoGPT response*; headings step `h1` → `h2` → `h3` without skipping.

### 9. Refresh

**What to check:** state resets to the seven seeded conversations, and the theme and
sidebar preferences you chose are still applied. This is expected — there is no database.

---

## Quick start

Requires **Node.js ≥ 20.9** and **pnpm 10.28.1** (pinned via `packageManager`; enable it
with `corepack enable`).

```bash
pnpm install
pnpm dev
```

The development server starts on <http://localhost:3000>.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint using the flat configuration |
| `pnpm exec tsc --noEmit` | Type-check the project |

`pnpm lint` invokes `eslint` with no path argument and always lints the project root. To
scope it, call `pnpm exec eslint <path>` directly.

There is no test runner; the walkthrough above is the test suite. See
[Verification](#verification).

---

## Contents

1. [How to test it](#how-to-test-it)
2. [Quick start](#quick-start)
3. [Feature status](#feature-status)
4. [Architecture](#architecture)
5. [The transport layer](#the-transport-layer)
6. [Navigation](#navigation)
7. [Design system](#design-system)
8. [Theming](#theming)
9. [Development notes](#development-notes)
10. [Project structure](#project-structure)
11. [Verification](#verification)
12. [Deployment](#deployment)
13. [Dependencies](#dependencies)
14. [Conventions](#conventions)
15. [Git workflow](#git-workflow)
16. [License](#license)

---

## Feature status

| Capability | State |
| --- | --- |
| Send a message and receive a response | Working, via the local adapter |
| Formatted responses — bold, inline code, fenced blocks | Working |
| Conversation list with search, rename, delete | Working, in memory |
| Automatic conversation titling | Working |
| Prompt starters and empty state | Working, seven starters |
| Message timeline with scroll anchoring | Working |
| Dark, light, OLED, and system themes | Working, no flash on load |
| Collapsible sidebar, persisted | Working |
| Responsive layout and mobile drawer | Working |
| Keyboard, focus, and screen-reader labels | Working |
| Real model responses | Not implemented |
| Streaming responses | Not implemented — the status types exist, the adapter resolves in one shot |
| Conversation persistence | Not implemented |
| Account, billing, settings | Disabled |
| All thirteen secondary destinations | Disabled |

Anything unimplemented is marked honestly: `aria-disabled="true"`, a tooltip explaining
the state, `cursor-not-allowed`, and a visible **Soon** or **Pro** badge. Colour is never
the sole signal, and no control links to a route that does not exist.

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
create, select, rename, delete, append a message, set a draft. It derives search
filtering and auto-titles a new conversation from its first prompt, truncated to 48
characters.

**`useChatState`** — the request lifecycle, modelled as `idle | sending | streaming |
error`, with an in-flight guard that prevents double submission.

`src/data/demo-conversations.ts` seeds seven conversations with relative timestamps
spanning eighteen minutes to twelve days back, so the Today / Yesterday / Older grouping
is always populated in a fresh session.

---

## The transport layer

`src/lib/chat-adapter.ts` is the single seam where a real backend is introduced.

```ts
export type ChatRequest = { conversationId: string; history: Message[] };
export type ChatCompletion = { content: string; model: string };

export interface ChatTransport {
  send(request: ChatRequest, signal?: AbortSignal): Promise<ChatCompletion>;
}

export function createLocalTransport(latencyMs = 400): ChatTransport;
```

The local implementation waits for the given latency, honours the `AbortSignal`, and
matches the prompt against four paths in order — SQL, briefing, debugging, and a fallback
echo — each rendered with markdown-style emphasis and fenced code. Every response is
labelled a local preview, so a screenshot can never be mistaken for real model output.

To connect a real service, implement `ChatTransport` against the live endpoint and change
the factory call in `ChatProvider`. Nothing above that line changes.

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

The sidebar is fixed at thirteen destinations across two groups, alongside a **New Chat**
action, the usage meter, the Pro card, and the account footer.

**Engagement** — Image Studio (Pro), Video Studio (Pro), Compare, Connectors, Store,
AI Tasks, AI Job Analysis, AI SOP Builder

**Help & Support** — Support, Newsletter, Subscriptions, API Platform, Discord

Every destination in both groups is disabled. Pro entries render a pill and a coloured
dot on the icon; the rest render a text badge. Engagement displays its first three
entries and collapses the remaining five behind a **More (5)** control; Support always
displays all five.

The sidebar measures 280px at `lg` and 320px at `xl`, collapsing to a 68px icon rail.
Collapsed labels use `clip-path: inset(50%)` so they remain in the accessibility tree,
while visually hidden children are removed from the tab order. The preference persists
under `echogpt-sidebar`.

---

## Design system

`src/styles/tokens.css` carries the EchoGPT brand, aligned with the marketing site.

```css
--echo-brand-600: #7650ec;   /* canonical violet */
--echo-azure:     #4979fb;
--echo-aurora-magenta: #f7306e;
--echo-aurora-cyan:    #00aeff;
```

Beyond the shared brand, surface, and aurora set, this application adds chat-specific
tokens: the focus ring, safe-area insets, scrollbar sizing and thumb colours, the sidebar
rail width, and the collapse transition duration and easing curve.

### Token namespacing

Shadows are declared as `--echo-shadow-sm | md | lg | glow` rather than the bare
`--shadow-*` names. Tailwind v4 ships its own `--shadow-md` and `--shadow-lg` as
built-in theme variables, and because `tokens.css` is imported before `tailwindcss`, an
unprefixed declaration loses the cascade and silently resolves to Tailwind's light-mode
default instead of the intended dark-surface value. The `echo-` prefix keeps the
application's shadows authoritative. The same rule applies to any new token whose name
could collide with a Tailwind built-in.

### Divergence from the marketing site

The `--text-muted`, `--text-dim`, and light-theme `--text-secondary` values have drifted
from the landing page, and this project no longer carries that site's per-model brand
colours. The values here are the more recent ones. Reconcile both files if the two
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

`layout.tsx` injects two blocking scripts before the first paint — one from `theme.ts`,
one from `sidebar-pref.ts` — so both the theme and the sidebar state are correct before
anything renders. This removes the flash a post-hydration effect would otherwise cause.
Both scripts are wrapped in `try/catch`, so blocked `localStorage` degrades to defaults
rather than throwing.

---

## Development notes

- **Type-check after a build.** The root layout uses the global `LayoutProps<"/">` type
  that Next.js generates into `.next/types` during `build` or `dev`. Running
  `tsc --noEmit` against a clean `.next` fails with `Cannot find name 'LayoutProps'`.
- **`build` and `dev` share the `.next` directory.** Building while a development server
  is running corrupts its state. Restart the development server after every build.
- **One development server per directory.** A second `next dev` exits immediately and
  redirects to the running instance.
- **`globals.css` reaches into `node_modules`.** `tw-animate-css` is imported by
  filesystem path because the package exposes only a `"style"` export condition, which the
  bare specifier cannot satisfy under Turbopack. The statement must stay inside the
  Tailwind pipeline, after the `tailwindcss` import, and must not be converted to a bare
  specifier or moved into `layout.tsx`.
- **Fonts are fetched during the build.** `next/font/google` retrieves Plus Jakarta Sans
  and JetBrains Mono at build time, so an offline build fails or falls back to a system
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

A production build completes with `/` emitted as dynamic, and `/icon.svg` and
`/_not-found` as static. Accessibility was reviewed manually: every disabled control
carries `aria-disabled` with an explanatory tooltip, the logo is correctly marked
decorative with an empty `alt`, and heading order steps `h1` → `h2` → `h3` without
skipping levels.

---

## Deployment

No environment variables, API keys, or configuration are required. `next.config.ts` is
empty and the application makes no remote image requests — all iconography is
`lucide-react`, and the only local asset is `public/logo-echogpt.svg`.

| Setting | Value |
| --- | --- |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Publish directory | `.next` |
| Node.js | 20 or newer |
| Framework preset | Next.js — detected automatically |

On Vercel, import [the repository](https://github.com/AbuBakkarSiddique007/EchoGPT-Chat-App)
and the remaining settings are detected. On Netlify, set the build command and publish
directory above; add `@netlify/plugin-nextjs` if the framework is not detected
automatically.

### Two things to know before shipping

- **The root route is server-rendered on every request.** `page.tsx` sets
  `export const dynamic = "force-dynamic"`, so the route is billed as a function
  invocation rather than served from cache. The application holds all state on the
  client and would work as static output; this is a deliberate choice while the transport
  layer is local.
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
- Types live in `src/types/chat.ts`: `MessageRole`, `MessageStatus`, `ChatStatus`,
  `Message`, `Conversation`, `ConversationGroupKey`, `ConversationGroup`, and `DraftMap`.
- Hooks live in `src/hooks/`, one file per state slice.
- Demo data lives in `src/data/`, clearly separated from transport code.

---

## Git workflow

`main` receives merges from `development`, which receives merges from `feature/*` and
`fix/*` branches using `--no-ff`. Commit messages follow Conventional Commits.

```
feat(sidebar): add collapsible icon rail for large viewports
fix(tokens): namespace shadows to avoid a Tailwind collision
chore(init): initialize project starter
```

---

## License

Private and proprietary. All rights reserved.
