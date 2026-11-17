# Architect implemented features

This is a granular inventory of the current project, checked against the active renderer (`workspace.ts`), HTML shell, Electron entry point, and the existing preview verification notes. **Implemented** means a usable local behavior exists; **Partial** means a basic version exists but does not yet match the full Notion interaction or data model. A menu label by itself is not counted as a working feature.

## Application and persistence

- **Implemented:** Browser-based workspace shell served from `index.html`.
- **Implemented:** Sidebar header is a clickable Dashboard button that opens the root page; the help-center card and unused Templates/Import shortcuts are removed, and the profile action uses a settings gear.
- **Implemented:** Electron `BrowserWindow` shell with context isolation, Node integration disabled, external HTTPS links opened in the system browser, and validated page deep links opened in a new Architect window.
- **Implemented:** Build scripts for TypeScript/Electron, Windows desktop packaging, and macOS packaging configuration.
- **Implemented:** Version-2 workspace JSON model with page IDs, parent-page IDs, block IDs, timestamps, user records, and page metadata.
- **Implemented:** Migration from the older `notion-clone-pages` localStorage shape.
- **Implemented:** Debounced localStorage persistence and visible Saving / All changes saved indicator.
- **Implemented:** Workspace settings show that the current workspace is local to this browser profile; users can rename the workspace.
- **Implemented:** Export a versioned JSON workspace backup including locally uploaded asset references; restore validates its pages, blocks, and assets before replacing the current workspace.
- **Partial:** Desktop/browser persistence still relies on the browser profile; team-hosted sync and an app-owned desktop data directory are not implemented.
- **Partial:** There is no custom-server sync or durable asset store.
- **Partial:** `workspace.ts` declares types but currently uses `// @ts-nocheck`, so the compiler does not validate those model changes.

## Page editing

- **Implemented:** Create pages from the sidebar and with Ctrl/Cmd+N.
- **Implemented:** The first updated-app launch preserves a JSON backup of the previous workspace in local storage and replaces its pages with one blank `New hub`, as requested. Workspace settings can export that pre-reset backup.
- **Implemented:** Page navigation supports back/forward history, clickable ancestor breadcrumbs, and Alt+Left / Alt+Right keyboard navigation.
- **Implemented:** The page options menu toggles full-width layout and a live word count.
- **Implemented:** The page-wide editable container has no browser focus outline; block-level focus and hover cues remain available.
- **Implemented:** Programmatic focus on an empty editable block uses an invisible temporary text anchor so the caret lands after the list indentation; the anchor is stripped from persisted text and markup.
- **Implemented:** Create a child page with `/page`; a stable-ID clickable page link is inserted into the source page and the child appears in the outline.
- **Implemented:** Edit page title and description. Both are single-line fields; Enter moves to the first block and pasted line breaks are flattened, so extra unstyled lines cannot be inserted above the page properties.
- **Implemented:** Page link blocks navigate to their target page; page titles/icons are read from the current target record.
- **Implemented:** Add an editable trailing text block so pages retain an insertion point.
- **Implemented:** Enter splits a text block, continues bullet/numbered/to-do lists, and exits an empty list to text. Backspace at an empty block removes it and focuses the previous block; Backspace at a block start joins compatible text blocks.
- **Implemented:** Empty text-block command hints show only on the active block. The editor-wide Ctrl/Cmd+A handler selects editable page text across blocks.
- **Implemented:** Blocks expose a hover rail with a `+` insert control and a drag handle. Clicking `+` adds a block below, Alt-clicking adds one above, and clicking the handle opens a searchable block action menu with turn-into targets, copy link, duplicate, move, and delete.
- **Implemented:** Block drag reordering restores the previous scroll position after a drop, including when moving blocks upward.
- **Implemented:** Columns have a draggable divider with persisted relative widths.
- **Implemented:** The page icon renders in the same row as the title and opens the icon picker.
- **Implemented:** Pages and blocks have stable deep links (`#page=<id>` and `#page=<id>&block=<blockId>`); opening a block link scrolls to the block and briefly highlights it.
- **Implemented:** Page actions use a right-click context menu with open in new tab, rename, duplicate, copy link, favorite, change icon, and delete; deleting a page removes its descendants and keeps at least one page. Rename still uses a prompt.
- **Partial:** Page delete is not a restorable trash workflow.
- **Implemented:** Cover editing uses a live crop stage showing the full image with a darkened surround, a banner-shaped crop frame that reflects the actual page banner ratio, pointer dragging to reposition, and a corner handle to zoom. A page can reuse a saved local image, search the image library by name, or upload a new one. Images remain data URLs in local storage; there is no durable asset library or drive provider.
- **Implemented:** Page icon selection uses a searchable emoji catalog, an icon-filtered image-library search, and icon upload. Image icons render in the outline, page header, and inline page links.
- **Partial:** Page properties can be created per page using prompts. Supported inputs are text, status, select, date, number, person, URL, email, phone, checkbox, and files-as-text. Schemas are not shared by database rows.

## Workspace outline and navigation

- **Implemented:** Separate Favorites and Workspace Pages outline groups.
- **Implemented:** Page rows navigate on click; disclosure arrows independently expand/collapse nested pages.
- **Implemented:** Child-page nesting comes from `parentId`; the expanded page IDs are retained in workspace state.
- **Implemented:** Page row menus open on click, right-click, or the keyboard context-menu key and offer open in new tab, rename, duplicate, copy link, favorite, change icon, and delete. Right-click is captured so the browser menu does not appear.
- **Implemented:** Clicking a page row opens it in the current view; Ctrl/Cmd-click and middle-click open the page deep link in a new browser tab, or a new Architect window in the desktop build.
- **Implemented:** Search dialog ranks title matches above body matches, shows a matching text preview, supports arrow-key selection and Enter to open, and displays an empty-result message; Ctrl/Cmd+K and Ctrl/Cmd+P open it and Escape closes it.
- **Partial:** Workspace list shows only the current workspace; membership and switching are not modeled.
- **Partial:** Search covers page titles and top-level block text, not all properties, nested data, or assets.

## Text blocks, Markdown, and references

- **Implemented:** Text, Heading 1/2/3, bulleted list, numbered list, to-do, toggle, quote, callout, and divider renderers.
- **Implemented:** Line-start shortcuts for `#`, `##`, `###`, `-`, `*`, `+`, `[]`, `>`, `1.`, and `---` when typed then followed by Space. `>` converts to Quote. Bulk paste parses common heading, bullet, numbered, checklist, quote, and divider lines, plus inline emphasis/code/link syntax.
- **Implemented:** Inline `**bold**`, `*italic*`, `~~strikethrough~~`, and `` `code` `` convert while typing character-by-character and save as sanitized inline HTML.
- **Implemented:** Ctrl/Cmd+B, Ctrl/Cmd+I, and Ctrl/Cmd+U apply browser editing commands and save the resulting markup.
- **Implemented:** Inline HTML sanitizer retains a small formatting/link allowlist and filters unsafe link protocols.
- **Partial:** Markdown paste conversion covers common syntax but does not yet match Notion's full paste conversion or rich clipboard behavior.
- **Partial:** `@` suggestions include pages and sample people; `[[` suggestions include pages. Suggestions filter live and support Enter/Tab/arrow selection.
- **Partial:** Selecting a reference preserves prefix text, but the reference becomes an adjacent block instead of an inline rich-text node; inline caret position and suffix text are not fully modeled.
- **Partial:** Page mentions render with the same icon-and-link presentation as page-link blocks; person mentions render as a mention chip.
- **Partial:** Rich-text DOM is stored as sanitized HTML on a block, not as a normalized rich-text run model; selection, paste, undo, and collaborative editing remain limited.

## Slash-command menu and block catalog

- **Implemented:** Slash menu filters command names/categories as the user types; matching ignores case, spacing, and punctuation so `/todo` matches “To-do list.”
- **Implemented:** Menu anchors near the active block, groups options into eight labeled sections with divider rules and per-option glyphs, scrolls within the viewport, and supports ArrowUp/ArrowDown, Enter/Tab, and Escape.
- **Implemented:** Dedicated `2 columns`, `3 columns`, and `4 columns` commands create the requested number of editable cells.
- **Implemented:** Text, headings, lists, to-do, toggle, divider, quote, callout, page, link-to-page, image upload, duplicate, delete, and move-to-page actions have basic insertion or state-change paths.
- **Partial:** Mention/Emoji opens a page/person menu; Emoji is not a separate emoji picker.
- **Partial:** Date/reminder inserts a date value; it has no reminder scheduling.
- **Partial:** PDF, file, bookmark, video, audio, and embed use URL prompts/card renderers; they do not provide a complete upload/embed workflow.
- **Partial:** Code block supports language selection, text editing, and copy; syntax highlighting is absent.
- **Partial:** Column commands create two to four editable text cells with persisted widths; they are not full nested block columns.
- **Partial:** Table persists editable headers, cell values, and added rows; no column controls, formulas, filters, or database relation exist.
- **Partial:** Table of contents links to headings; it does not dynamically model the full page outline beyond the current block list.
- **Partial:** Breadcrumb block navigates to ancestor pages.
- **Not exposed:** Standalone template/button insertion was removed from the slash catalog. Templates are reserved for future database features; legacy saved button blocks can still render.
- **Partial:** Equation/Math prompts for text and displays it; there is no mathematical typesetting editor in the block itself.
- **Partial:** Duplicate, delete, and move-to-page actions work through basic data changes; move uses a prompt and lacks robust cycle/permission handling.
- **Not implemented:** Database creation/view commands with shared schemas, database filters/sorts/grouping, imports, mentions/reminders scheduling, and full Notion command parity.

## Other page controls and gaps

- **Implemented:** Page and block deep links use hash routes; browser tabs and desktop windows can open the same page target, and block links scroll to and highlight the linked block.
- **Implemented:** Favorite toggle is stored on each page and drives the Favorites group.
- **Implemented:** Page link and person/page mention IDs are stored as structured references.
- **Partial:** Share button reports a copied-link toast; it does not create a real share link or access permission.
- **Partial:** File/media persistence uses URL values or browser data URLs; reusable cover image selection and crop controls exist, but asset filtering/search, quotas, durable storage, and missing-file recovery need work.
- **Not implemented:** Comments, updates/inbox, member administration, trash, true multi-workspace access, collaboration, version history, and database row relations.

## Verification notes

- `npm.cmd run build` successfully compiles the active TypeScript and Electron configurations after the latest editor/navigation changes.
- CDP browser checks passed without runtime exceptions for: no editor focus outline, icon/title alignment, caret clearance from the block rail, grouped slash and block menus, `+` add-below and Alt-click add-above, 2/3/4-column commands, page right-click capture, middle-click deep-link opening, drag-scroll restoration, page duplicate/favorite/delete, block turn-into/duplicate/delete, and block-link highlighting.
- Prior preview checks verified child page creation/link persistence, page/person suggestions, Markdown shortcuts, persisted table/code properties, typed page property persistence, collapsed outline behavior, and the menu placement/keyboard flow.
- These are feature-level checks, not a complete automated acceptance suite. Refer to [TODO](../WorkInProgress/TODO.md) for remaining work.
