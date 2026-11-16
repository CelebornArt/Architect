# Architect open work

Keep only unfinished work here. When a task is completed, document the change in `Targets/NotionStructure.md` and the release's `CHANGELOG.md`, update `Completed/ImplementedFeatures.md`, then remove the task from this file.

## Next steps

### P0 — Editor correctness

- [ ] **Preserve rich text and caret during edits.** Replace adjacent-block `@`/`[[` references with inline reference nodes while keeping text before and after the reference. Add paste parsing for Markdown and links. Verify typing, paste, selection, undo/redo, reload, and reference navigation.
- [ ] **Finish keyboard block editing.** Handle Enter/Backspace at block boundaries, list continuation, multi-block selection, indent/outdent, block move/reorder, and deletion without losing the editable empty insertion point. Verify keyboard-only paths and persisted order.
- [ ] **Restore TypeScript checks.** Remove `// @ts-nocheck` from `workspace.ts`, add explicit model types, fix compiler errors, and ensure build catches invalid block/property mutations.
- [ ] **Resolve duplicate editor sources.** Determine whether `app.ts` and `editor-features.ts` are still used; document and remove or consolidate obsolete code only after confirming the active renderer path.

### P1 — Databases and commands

- [ ] **Create shared database schemas and rows.** Define database IDs, shared property schemas, row/page relationships, and migrations from current per-page properties. Verify edits to a property schema appear consistently on every row.
- [ ] **Add database views.** Implement table and list views first, then filters, sorting, grouping, property visibility, and row-to-page navigation. Verify each view reads the same persisted row values.
- [ ] **Complete slash commands.** Compare each menu entry to `Targets/NotionStructure.md`; implement command-specific output and persistence, or remove/label entries that remain placeholders. Verify keyboard selection and insertion at the caret.

### P1 — Media and page controls

- [ ] **Build an asset library.** Support upload, filtering/reuse, image previews, cover crop controls, and persistent asset references rather than large data URLs in local storage.
- [ ] **Replace prompt-based pickers.** Add searchable icon, property, cover, and media dialogs with cancellation and validation states.

### P2 — Workspace and delivery

- [ ] **Model multiple workspaces.** Add memberships and a functional switcher; scope favorites, shared pages, and navigation to the selected workspace.
- [ ] **Verify responsive and desktop behavior.** Cover mobile-width web, Windows packaging, macOS packaging on macOS, local persistence, import/export, and recovery after malformed stored data.

## Known problems

- Bulk-pasted Markdown syntax stays literal; shortcut conversion currently works while typing character by character.
- Page references selected from `@`/`[[` are adjacent blocks, so they can break true inline text flow and caret position.
- Properties are stored per page, not in shared database schemas; formulas, relations, and views are absent.
- Workspace access currently shows one workspace, with no membership switching.
- Media storage uses browser local storage; there is no reusable asset library or robust cover crop workflow.
- Several slash-command entries are placeholders or use prompt dialogs rather than complete Notion-like flows.
