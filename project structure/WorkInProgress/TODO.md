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

- [ ] **Add the additional content types.** Implement board canvas and objects, shared database views, task/calendar records, and cross-linking from the shared content model.
- [ ] **Build team collaboration.** Add direct/topic/group chat, permission-aware dashboard widgets, configurable inbox, admin dashboard, and workspace-wide announcements.
- [ ] **Build drive-backed asset management.** Search, preview, reference, upload, tag, and rename files through provider permissions; add stable references and missing/moved-file states.
- [ ] **Add image-region discussions.** Let users select image regions and attach threaded comments that remain aligned across zoom and resize.
- [ ] **Add buttons and safe automations.** Support explicit record actions, permission checks, previews, run history, retry behavior, and loop prevention.

### P1 — Databases and commands

- [ ] **Create shared database schemas and rows.** Define database IDs, shared property schemas, row/page relationships, and migrations from current per-page properties. Verify edits to a property schema appear consistently on every row.
- [ ] **Add database views.** Implement table and list views first, then filters, sorting, grouping, property visibility, and row-to-page navigation. Verify each view reads the same persisted row values.
- [ ] **Complete slash commands.** Compare each menu entry to `Targets/NotionStructure.md`; implement command-specific output and persistence, or remove/label entries that remain placeholders. Verify keyboard selection and insertion at the caret.

### P1 — Media and page controls

- [ ] **Persist a real asset library.** Cover and icon dialogs can filter and reuse saved local images, but storage is still a flat list of data URLs. Add metadata, previews, stable asset references, rename/tag, and provider-backed bytes instead of embedding images in workspace JSON.
- [ ] **Replace the remaining prompt-based flows.** Page rename, property type selection, page-link search, block move, date/equation entry, and media insertion still use `prompt()`. Move them to searchable dialogs with cancellation and validation states.

### P2 — Workspace and delivery

- [ ] **Model multiple workspaces.** Add memberships and a functional switcher; scope favorites and navigation to the selected workspace.
- [ ] **Move desktop data into app-owned storage.** Replace Electron profile localStorage as the desktop source of truth with a versioned local data directory behind a storage adapter; keep JSON backup/restore portable.
- [ ] **Verify responsive and desktop behavior.** Cover mobile-width web, Windows packaging, macOS packaging on macOS, local persistence, import/export, and recovery after malformed stored data.

## Known problems

- Bulk-pasted Markdown now converts common headings, lists, checklists, quotes, dividers, inline emphasis, code, and links; broader Markdown syntax and robust HTML/rich-text paste handling are still missing.
- Page references selected from `@`/`[[` are adjacent blocks, so they can break true inline text flow and caret position.
- Properties are stored per page, not in shared database schemas; formulas, relations, and views are absent.
- Workspace access currently shows one workspace, with no membership switching.
- Electron/browser workspace data currently lives in the browser profile; portable backup exists, but there is no app-owned desktop data directory or custom-server connection yet.
- Uploaded media is stored in browser local storage as data URLs. Cover and icon pickers can search and reuse saved local images and crop covers against the live banner ratio, but durable asset references, metadata, and provider-backed storage are missing.
- Several slash-command entries are placeholders, and page rename, property creation, page links, block moves, dates, equations, and media insertion still use prompt dialogs rather than complete Notion-like flows.
