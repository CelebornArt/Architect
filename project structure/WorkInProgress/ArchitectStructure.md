# Architect Structure

This file records deliberate product differences and priorities for Architect, the custom Notion-inspired workspace. Keep Notion observations in `../Completed/NotionStructure.md`; do not describe an unimplemented item as a feature.

## Product direction

- Build a local-first desktop app for Windows and macOS, with the web build available for browser and mobile use.
- Keep pages, blocks, references, properties, and assets portable and persistent. Avoid making the browser session the only source of truth.
- Use Notion as a usability reference while keeping Architect's data model and future features independently documented.

## Current design choices

- Page tree is collapsible; Favorites and Shared are separate outline groups, with workspace access at the bottom.
- Empty pages retain an editable trailing text block.
- Page and person references are structured by stable IDs.
- Page properties are typed; database-wide schemas and views are a planned next step.
- REA analysis remains passive unless a specific interaction is needed. Keep the existing signed-in Notion session intact.

## Custom features to decide and build

- Local asset library with reuse, image filtering, and cover crop preview.
- Multiple workspace memberships and explicit local data/export boundaries.
- Richer command palette with clear categories, keyboard flow, and no placeholder commands presented as complete.
- Desktop-first keyboard and offline behavior, followed by mobile web layout.

## Change log for custom decisions

- 2026-11-16: Named the custom product **Architect** and separated its product decisions from the Notion reference plan.
