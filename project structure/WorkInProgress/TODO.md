# Architect open work

Keep only unfinished work here. When a task is completed, update the relevant target spec (`Targets/NotionStructure.md` for Notion parity or `Targets/ArchitectStructure.md` for custom Architect direction), the release's `CHANGELOG.md`, and `Completed/ImplementedFeatures.md`, then remove the task from this file.

## Next steps

### P0 — Architect foundation

- [ ] **Resolve product decisions.** Decide supported server deployment, first drive provider, single-payment license/upgrade terms, time tracking visibility, announcement acknowledgment rules, and retention/export policy. Record choices in `Targets/ArchitectStructure.md`.

### P0 — Editor correctness

- [ ] **Preserve rich text and caret during edits.** Replace adjacent-block `@`/`[[` references with inline reference nodes while keeping text before and after the reference. Verify typing, paste, selection, undo/redo, reload, and reference navigation.
- [ ] **Finish keyboard block editing.** Verify Enter/Backspace at block boundaries, list continuation, block move/reorder, and deletion with browser interaction; then add multi-block selection and indent/outdent without losing the editable empty insertion point.
- [ ] **Restore TypeScript checks.** Remove `// @ts-nocheck` from `workspace.ts`, add explicit model types, fix compiler errors, and ensure build catches invalid block/property mutations.
- [ ] **Resolve duplicate editor sources.** Determine whether `app.ts` and `editor-features.ts` are still used; document and remove or consolidate obsolete code only after confirming the active renderer path.

### P1 — Architect team workspace

- [ ] **Add Obsidian-style Zettelkasten Graph View (Workspace View).** Build a workspace-level interactive force-directed Graph View (accessible as a global switcher view on the left Feature Rail rather than a standalone page type) visualizing connections across pages, subpages (`parentId`), boards, databases, `page_link` blocks, and `@` / `[[` mentions, with cluster filtering, hover highlight, zoom/pan, and click-to-open navigation.
- [x] **Implement Dashboard Notes Scratchpad & Separate Quick To-Do List.** Built inside **Dashboards -> Scratchpad** (freeform auto-saving notes pad supporting `#` through `#####` Title 1–Heading 5 formatting, word count, and prompt-to-save destination picker to save inside a page or database) and **Dashboards -> Tasks** (independent persisted to-do list with priorities and status filters).
- [ ] **Build Global Meetings Calendar & Attendance-Driven Dashboard Time Tracker.** `Time Tracking & Calendar` tab is present in Dashboards sidebar (cleared placeholder) alongside the `Time tracking overview` card in Admin Dashboard; next build the global workspace Meetings Calendar, organizer attendance prompts (`Working` vs. `Guest`), automated meeting hour logging, and clickable document links.
- [ ] **Expand Plugin Browser (`Settings -> Plugin browser`).** Empty plugin browser placeholder category is present in Obsidian-style client settings; add plugin registry manifest loading, install/uninstall workflow, enable/disable switches, and sandboxed plugin API hooks.
- [ ] **Add the additional content types.** Extend interactive Board canvas objects (frames, connectors with labels, templates) alongside shared database views and cross-linking.
- [ ] **Build Account + multi-workspace Profile system & Discord-style custom roles.** Separate core Accounts from per-workspace Profiles (tied to company mail, separate display name/avatar/roles across workspaces), add Admin Dashboard (role-gated workspace settings), custom role create/edit/delete, and per-page role permission overrides (view, edit, comment).
- [ ] **Add solo cross-device cloud file sync & view-only mirrors.** Let solo local workspaces sync across devices via cloud storage (Joplin/Obsidian-style), and let read-only viewers auto-pull from a shared cloud source on startup or every `X` minutes with strict read-only lock.
- [ ] **Build team collaboration & Dashboards.** Live WebSocket collaboration server, separate **User Dashboard** (personal widgets) and **Admin Dashboard** (role-gated settings), direct/topic/group chat, configurable inbox, workspace-wide announcements, and domain-gated site publishing.
- [ ] **Build drive-backed & server Asset Management System (1.B).** Default to local storage in local mode while supporting cloud drive in local/team mode and server asset storage in co-working mode (chosen by Admin). Track `metadata`, `fileType`, `category` (`music`, `sfx`, `3d model`, `concept`, `illustration`, `video`, etc.), admin-reassignable `creator`, and `tags`; provide an interactive searchable Asset Library with inline audio timeline scrubbing/playback, video playback, inline cloud-referenced previews vs. full-size original downloads, and Notion-style double-click/menu fullscreen image lightbox.
- [ ] **Add image-region discussions.** Let users select image regions and attach threaded comments that remain aligned across zoom and resize.
- [ ] **Add buttons and safe automations.** Support explicit record actions, permission checks, previews, run history, retry behavior, and loop prevention.

### P1 — Databases and commands

- [x] **Create shared database schemas and rows.** Databases exist as standalone `pageKind: 'database'` pages (`/database` converts empty pages in-place) with child row `Page` records sharing typed schemas (`Title`, `Text`, `Number`, `Select`, `Multi-select`, `Status`, `Date`, `Person`, `Files`, `Checkbox`, `URL`, `Email`, `Phone`, `Relation`, `Rollup`, `Formula`, and created/edited metadata), and `/database inline` + `Linked view of database` share live state across inline & full views.
- [x] **Add database views.** Implemented 8 shared views (`Table`, `Board`, `List`, `Gallery`, `Calendar`, `Timeline`, `Chart`, `Feed`), live filter rules, multi-rule sorting, grouping, property visibility/reordering, column footer calculations, templates, and synchronized `Side peek` / `Center peek` / `Full page` row editing.
- [ ] **Complete remaining slash commands & Forms/Automations.** Verify remaining media/embed slash commands and add database Forms view & trigger-based Automations.

### P1 — Media and page controls

- [ ] **Connect external Google Drive OAuth & team server asset backends.** Local app-folder / IndexedDB storage, metadata catalog, audio timeline playback, fullscreen lightbox, and Drive URL references work locally; next connect live Google Drive OAuth file browsing/streaming and team-server object uploads.
- [ ] **Design smarter remote asset proxy & local cache architecture together.** Beyond byte-limited crisp proxies (`smart-proxy` max KB) and download-all caching (`download-all` to a user-chosen path), figure out a smarter end-to-end system together for server-side/edge transcoding, non-image media proxies (audio/video/3D LODs), progressive loading, cache size budgets/LRU eviction, and seamless offline/online switching.
- [ ] **Replace the remaining prompt-based flows.** Page rename, property type selection, page-link search, block move, date/equation entry, and web-bookmark/embed URL insertion still use `prompt()`. Move them to searchable dialogs with cancellation and validation states.

### P2 — Workspace and delivery

- [ ] **Model multiple workspaces.** Add memberships and a functional switcher; scope favorites and navigation to the selected workspace.
- [ ] **Verify responsive and desktop behavior.** Cover mobile-width web, Windows packaging, macOS packaging on macOS, local persistence, import/export, and recovery after malformed stored data.
- [ ] **Add presentation mode ("Present from here").** Present page sections starting from a selected block (headings/sections as slides) with full-screen slide view, keyboard arrow navigation, speaker/preview controls, and `Ctrl+Alt+P` entry from the block menu.

## Known problems

- Bulk-pasted Markdown now converts common headings, lists, checklists, quotes, dividers, inline emphasis, code, and links; broader Markdown syntax and robust HTML/rich-text paste handling are still missing.
- Page references selected from `@`/`[[` are adjacent blocks, so they can break true inline text flow and caret position.
- **Verified fixed:** Page comments, block/text comments, collapsible Page properties (including Description), and relational Databases with shared schemas and multi-view layouts are now implemented locally; Database Forms/Automations and collaboration-server syncing remain open.
- Local workspace creation and switching are implemented (`#workspace-access`); multi-user company accounts and server-backed workspace memberships still await the collaboration server.
- Desktop storage now persists to `userData/ArchitectData/` via IPC (`electron/main.ts`) and browser binaries persist in IndexedDB (`storage.ts`), but a custom collaboration server and remote Google Drive OAuth API connection are not built yet.
- Uploaded asset metadata lives in local storage alongside binary files on disk / IndexedDB, while external Drive OAuth uploads and server-enforced permissions still await the backend server.
- Several slash-command entries are placeholders, and page rename, property creation, page links, block moves, dates, equations, and media insertion still use prompt dialogs rather than complete Notion-like flows.
