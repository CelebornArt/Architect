# REA comparison: basic page editing and UX

**Target:** signed-in Notion desktop renderer at `app.notion.com`, reached through the existing CDP endpoint `127.0.0.1:9222`. Browser identity observed as Chrome 156 / Electron 45. The session was inspected passively; no page was changed or navigated.

**Evidence:** REA target discovery `ev_a51871fda10f4c904b5de86db7019de4641b119e658994afee5d226ad66b792d`; page inspection `ev_536590a4c8f5ed70025b1d391fd7bd201961b8ed5f36eeeb3c98c9b3e27c6c62`. Inspection was policy-filtered, so conclusions below are limited to the exposed page structure and observed UI, not a complete account-wide audit.

## Observed Notion interaction model

- The selected page is a database row opened in page view. Its interface combines page title/icon/cover actions, typed page properties, page body, comments, sharing, and page actions.
- Navigation is a separate sidebar surface with page/workspace controls. Nested pages are revealed from page outline controls; Favorites and Shared have their own groups.
- Basic editing is block-oriented and cursor-driven. Slash commands are contextual to the insertion point; inline references and page links are part of document content rather than merely sidebar entries.
- Database-row pages connect page editing with typed properties. The page is not just a title and a flat text document.

## Current Architect differences

| Area | Notion observation | Architect now | Work needed |
|---|---|---|---|
| Page body | Rich block editor with inline formatting and cursor-aware insertion | Editable contenteditable blocks; common Markdown shortcuts and formatting exist | Paste Markdown, multi-block selection, undo/redo, caret-safe transforms |
| Slash menu | Contextual command search at the cursor | Filtered command menu anchored to the active block | Validate every command; improve insertion/caret retention and command coverage |
| Page references | Inline document references with stable navigation | `@` and `[[` create stable page/person references, but page refs can become adjacent blocks | Preserve surrounding rich text and render the reference inline |
| Empty blocks | Empty insertion points remain available | Trailing blank text block is kept editable | Verify all block types and keyboard paths preserve reachable insertion points |
| Properties | Typed fields associated with a database row/schema | Typed values are stored per page | Shared database schema, row relationships, formulas, filters, sorts, and views |
| Outline | Favorites/Shared/workspace groups and disclosure controls | Matching groups and collapse arrows; current data contains one workspace | Add real memberships and ensure favorite/shared child placement |
| Persistence | Synchronized workspace state | Browser local storage for current prototype | Durable local database, asset storage, migration/backup/export |

## Prioritized changes

1. Add a shared database model with schemas, rows, and page relations.
2. Make page references true inline document nodes and preserve surrounding text/caret.
3. Continue rich-text/Markdown behavior with paste, selections, and keyboard editing.
4. Complete slash-command behavior, including command-specific state and persistence.
5. Add durable local storage and asset management before expanding desktop/mobile parity.

Do not copy workspace names, page titles, property values, or other private content into this report. REA did not expose complete DOM/accessibility evidence, so the comparison is bounded to the inspected page and prior sampled controls.
