# Architect to-do list

Keep this file current as work starts and finishes. Add concrete acceptance criteria to active tasks.

## Completed

- [x] Add a versioned local workspace/page/block model and persistence migration.
- [x] Support child pages, page links, page/person mentions, slash commands, Markdown, and an editable trailing block.
- [x] Add typed per-page properties and persistent simple tables/code language.
- [x] Group Favorites, Shared, and workspace pages; expand child pages from disclosure arrows.
- [x] Reorganize product documents and record the first `0.1.0` release.

## Next

- [ ] Replace per-page property fields with shared database schemas and row relationships; add table/list views.
- [ ] Add database sort, filter, grouping, property visibility, and row-to-page navigation.
- [ ] Complete Markdown parity: pasted Markdown, links, nested lists, code fences, undo/redo, and selection-safe formatting.
- [ ] Preserve inline text while selecting `@` and `[[` references; render mentions inline rather than as separate blocks.
- [ ] Improve block editing: caret-safe Backspace/Enter, multi-block selection, drag/reorder, indent/outdent, and block menus.
- [ ] Replace prompt-based property, icon, cover, and media flows with searchable pickers; add asset reuse and cover crop preview.
- [ ] Implement the workspace switcher for multiple memberships; keep favorites and shared pages scoped correctly.
- [ ] Audit every slash command against its documented behavior; remove or label commands that are still stubs.
- [ ] Test Web, Windows desktop, macOS packaging, reload persistence, and narrow/mobile layouts.

## Known bugs / risks

- Bulk-pasted Markdown markers do not auto-convert like character-by-character typing.
- Page references selected from `@`/`[[` are stored as adjacent blocks; they do not preserve true inline caret formatting.
- Current workspace access UI represents one workspace; membership switching is not modeled.
- Per-page properties are not shared database schemas, and database views are not implemented.
- Media storage is browser local storage and does not yet provide a reusable asset library.
