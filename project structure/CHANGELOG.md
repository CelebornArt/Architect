# Changelog

Project releases follow Semantic Versioning. Every release gets an entry here.

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
