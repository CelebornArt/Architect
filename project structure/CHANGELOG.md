# Changelog

Project releases follow Semantic Versioning. Every release gets an entry here.

## [Unreleased]

### Added

- Workspace settings with a visible local-only storage status, workspace rename, versioned JSON backup export, and validated backup restore that includes uploaded assets.
- Search palette previews with title-first ranking, arrow-key result navigation, Enter to open, and a clear no-results state.
- A one-time fresh-workspace reset to a single blank `New hub`, with a recoverable pre-reset workspace backup exposed in settings.
- Page back/forward history, clickable ancestor breadcrumbs, Ctrl/Cmd+P search, full-width and live word-count page options, block drag handles, and resizable columns.
- A local cover picker with saved-image reuse, upload, image-library search, a full-image crop stage with darkened surround, a banner-ratio crop frame that can be dragged, and a corner handle for zoom.
- A searchable page-icon dialog with emoji choices, upload, and image-library results filtered to icon assets; image icons render in the outline, page header, and page links.
- A clickable Dashboard header in the sidebar that opens the root page, with the help-center card, unused Templates/Import shortcuts, and Shared outline section removed.
- Common Markdown paste conversion for headings, lists, checklists, quotes, dividers, inline formatting, code, and links.
- Caret-aware list continuation/exit, empty-block removal and merging, active-line-only empty hints, and page-wide Ctrl/Cmd+A selection.
- Selection-aware deletion across multiple blocks that keeps only the selected prefix and suffix, with typing continuing in the merged block.
- Single-line page title and description fields that reject Enter and flatten pasted line breaks, preventing stray lines above page properties.
- Unstyled empty text blocks now share the same 29px line box as bullet and numbered lines, removing the oversized blank-line gap.
- Fixed inline Markdown conversion losing typed text and focus after block operations by restoring focus to the block-editor container and rewriting the matched text node in place.
- Standalone button/template insertion was removed from the slash catalog; template workflows are reserved for databases.
- Removed the browser focus outline around the entire editable page container.
- Corrected the caret anchor for newly created empty list blocks so it starts in the indented text area rather than before the list marker.
- A Notion-style block rail with a `+` insert control before the drag handle; clicking adds a block below, Alt-clicking adds one above, and clicking the handle opens a searchable block action menu with turn-into targets, copy block link, duplicate, move, and delete.
- Slash and block menus grouped into labeled sections with divider rules and per-option glyphs; slash search ignores punctuation and spacing, so `/todo` matches “To-do list.”
- Independent `2 columns`, `3 columns`, and `4 columns` commands that create the requested number of editable cells.
- A page right-click menu with open in new tab, rename, duplicate, copy link, favorite, change icon, and delete, replacing the browser context menu on outline rows.
- Page and block deep links (`#page=<id>` and `#page=<id>&block=<blockId>`), Ctrl/Cmd-click and middle-click page opening, and a brief highlight when a block link is opened.
- The page icon now sits beside the page title instead of above it, and block drag reordering restores the previous scroll position after a drop.
- A validated Electron page-deep-link window handler: HTTPS links still open in the system browser, while app page links open in a new Architect window.

### Changed

- Specified the local/custom-server data boundary, identity, offline conflict handling, portable backup, stable content IDs, workspace roles, and migration expectations in ArchitectStructure.
- Replaced the subscription-style “Free plan” profile label with “Local workspace” and renamed the settings action to reflect its current functionality.
- Replaced the empty Architect target with the product direction for user-controlled hosting, page types, team dashboards, drive-backed assets, collaboration, image annotations, inbox, administration, and database automations.
- Added Architect foundation and feature tracks to TODO, including decisions needed before local/server sync and team collaboration.
- Updated the Architect hosting model: standalone local mode is single-user/device, while shared live editing requires a team-controlled collaboration server; asset files may still live locally, on a connected drive, or in server storage.
- Normalized numbered-block layout and rail offsets so text, list markers, to-dos, quotes, toggles, and page links share stable caret and control geometry.

## [0.1.0] - 2026-11-16

Initial tracked release of Architect.

### Added

- Electron desktop shell and browser-based workspace prototype.
- Persistent pages, block editor, Markdown block and inline formatting, slash commands, page links, mentions, and collapsible navigation.
- Typed page properties and editable table/code blocks with local persistence.
- Notion product analysis, Architect-specific product plan, task list, and project guidance.

### Changed

- Moved the Notion comparison to `Completed/NotionComparison.md`; reserved `Targets/ArchitectStructure.md` for future Architect decisions.
- Reorganized `AGENTS.md` into Git Commits and Global stuff; changed TODO to list only open tasks, next steps, and known problems.
- Moved `NotionStructure.md` and `NotionComparison.md` into `Targets/`, added a granular implemented-features inventory, and made TODO the required starting point for continuation prompts.
- Moved the Notion plan and comparison into `Targets/` and added `Completed/ImplementedFeatures.md` with implementation status and verification notes.

### Known gaps

- Shared database schemas and views, robust asset management/cropping, collaboration, and complete Notion command parity remain planned.
