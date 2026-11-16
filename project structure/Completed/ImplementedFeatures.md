# Architect implemented features

This is a granular inventory of the current project, checked against the active renderer (`workspace.ts`), HTML shell, Electron entry point, and the existing preview verification notes. **Implemented** means a usable local behavior exists; **Partial** means a basic version exists but does not yet match the full Notion interaction or data model. A menu label by itself is not counted as a working feature.

## Application and persistence

- **Implemented:** Browser-based workspace shell served from `index.html`.
- **Implemented:** Electron `BrowserWindow` shell with context isolation, Node integration disabled, and external HTTPS links opened in the system browser.
- **Implemented:** Build scripts for TypeScript/Electron, Windows desktop packaging, and macOS packaging configuration.
- **Implemented:** Version-2 workspace JSON model with page IDs, parent-page IDs, block IDs, timestamps, user records, and page metadata.
- **Implemented:** Migration from the older `notion-clone-pages` localStorage shape.
- **Implemented:** Debounced localStorage persistence and visible Saving / All changes saved indicator.
- **Partial:** Local storage is tied to the current browser profile and has no sync, backup, export, or durable asset store.
- **Partial:** `workspace.ts` declares types but currently uses `// @ts-nocheck`, so the compiler does not validate those model changes.

## Page editing

- **Implemented:** Create pages from the sidebar and with Ctrl/Cmd+N.
- **Implemented:** Create a child page with `/page`; a stable-ID clickable page link is inserted into the source page and the child appears in the outline.
- **Implemented:** Edit page title and description.
- **Implemented:** Page link blocks navigate to their target page; page titles/icons are read from the current target record.
- **Implemented:** Add an editable trailing text block so pages retain an insertion point.
- **Partial:** Backspace removes empty non-trailing blocks, but full caret-safe merge and list-continuation behavior is not implemented.
- **Partial:** Page menu supports prompt-based rename, favorite, and delete of the page plus direct children; this is not a trash/recovery workflow.
- **Partial:** Add cover uploads one image to a data URL and uses a fixed focal position; there is no asset picker or crop UI.
- **Partial:** Page icon selection uses a prompt for emoji or URL; there is no icon catalog.
- **Partial:** Page properties can be created per page using prompts. Supported inputs are text, status, select, date, number, person, URL, email, phone, checkbox, and files-as-text. Schemas are not shared by database rows.

## Workspace outline and navigation

- **Implemented:** Separate Favorites, Shared, and Workspace Pages outline groups.
- **Implemented:** Page rows navigate on click; disclosure arrows independently expand/collapse nested pages.
- **Implemented:** Child-page nesting comes from `parentId`; the expanded page IDs are retained in workspace state.
- **Implemented:** Page row menu supports rename, favorite, and delete actions.
- **Implemented:** Search dialog filters page titles and body block text; Ctrl/Cmd+K opens it and Escape closes it.
- **Partial:** Shared grouping is driven by an optional page flag; there is no sharing/access-control model.
- **Partial:** Workspace list shows only the current workspace; membership and switching are not modeled.
- **Partial:** Search covers page titles and top-level block text, not all properties, nested data, or assets.

## Text blocks, Markdown, and references

- **Implemented:** Text, Heading 1/2/3, bulleted list, numbered list, to-do, toggle, quote, callout, and divider renderers.
- **Implemented:** Line-start shortcuts for `#`, `##`, `###`, `-`, `*`, `+`, `[]`, `>`, `1.`, and `---` when typed then followed by Space. `>` converts to Quote.
- **Implemented:** Inline `**bold**`, `*italic*`, `~~strikethrough~~`, and `` `code` `` convert while typing character-by-character and save as sanitized inline HTML.
- **Implemented:** Ctrl/Cmd+B, Ctrl/Cmd+I, and Ctrl/Cmd+U apply browser editing commands and save the resulting markup.
- **Implemented:** Inline HTML sanitizer retains a small formatting/link allowlist and filters unsafe link protocols.
- **Partial:** Markdown pasted as one bulk insertion does not auto-convert; typed shortcut behavior differs from Notion's broader Markdown/paste handling.
- **Partial:** `@` suggestions include pages and sample people; `[[` suggestions include pages. Suggestions filter live and support Enter/Tab/arrow selection.
- **Partial:** Selecting a reference preserves prefix text, but the reference becomes an adjacent block instead of an inline rich-text node; inline caret position and suffix text are not fully modeled.
- **Partial:** Page mentions render with the same icon-and-link presentation as page-link blocks; person mentions render as a mention chip.
- **Partial:** Rich-text DOM is stored as sanitized HTML on a block, not as a normalized rich-text run model; selection, paste, undo, and collaborative editing remain limited.

## Slash-command menu and block catalog

- **Implemented:** Slash menu filters command names/categories as the user types.
- **Implemented:** Menu anchors near the active block, has category/icon treatment, and supports ArrowUp/ArrowDown, Enter/Tab, and Escape.
- **Implemented:** Text, headings, lists, to-do, toggle, divider, quote, callout, page, link-to-page, image upload, duplicate, delete, and move-to-page actions have basic insertion or state-change paths.
- **Partial:** Mention/Emoji opens a page/person menu; Emoji is not a separate emoji picker.
- **Partial:** Date/reminder inserts a date value; it has no reminder scheduling.
- **Partial:** PDF, file, bookmark, video, audio, and embed use URL prompts/card renderers; they do not provide a complete upload/embed workflow.
- **Partial:** Code block supports language selection, text editing, and copy; syntax highlighting is absent.
- **Partial:** Columns render two editable text cells; they are not full nested block columns.
- **Partial:** Table persists editable headers, cell values, and added rows; no column controls, formulas, filters, or database relation exist.
- **Partial:** Table of contents links to headings; it does not dynamically model the full page outline beyond the current block list.
- **Partial:** Breadcrumb block navigates to ancestor pages.
- **Partial:** Button/template inserts one generic text block; it is not a configurable template system.
- **Partial:** Equation/Math prompts for text and displays it; there is no mathematical typesetting editor in the block itself.
- **Partial:** Duplicate, delete, and move-to-page actions work through basic data changes; move uses a prompt and lacks robust cycle/permission handling.
- **Not implemented:** Database creation/view commands with shared schemas, database filters/sorts/grouping, imports, mentions/reminders scheduling, and full Notion command parity.

## Other page controls and gaps

- **Implemented:** Favorite toggle is stored on each page and drives the Favorites group.
- **Implemented:** Page link and person/page mention IDs are stored as structured references.
- **Partial:** Share button reports a copied-link toast; it does not create a real share link or access permission.
- **Partial:** File/media persistence uses URL values or browser data URLs; reusable assets, cropping, quotas, and missing-file recovery need work.
- **Not implemented:** Comments, updates/inbox, member administration, trash, true multi-workspace access, collaboration, version history, and database row relations.

## Verification notes

- `npm.cmd run build` successfully compiles the active TypeScript and Electron configurations.
- Prior preview checks verified child page creation/link persistence, page/person suggestions, Markdown shortcuts, persisted table/code properties, typed page property persistence, collapsed outline behavior, and the menu placement/keyboard flow.
- These are feature-level checks, not a complete automated acceptance suite. Refer to [TODO](../WorkInProgress/TODO.md) for remaining work.
