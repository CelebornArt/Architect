# Architect

Architect is a local Notion-inspired workspace prototype. It combines a web editor with an Electron desktop shell for Windows and macOS. The project is being built from the product plan and REA observations in [NotionStructure](Completed/NotionStructure.md), with future Architect-specific targets reserved in [ArchitectStructure](Targets/ArchitectStructure.md).

## Run it

From the project root, install dependencies with `npm.cmd install`, then start the web version with `npm.cmd run dev`. Build the TypeScript and Electron sources with `npm.cmd run build`.

On Windows, `npm.cmd run desktop` builds and launches the unpacked app. Package installers with `npm.cmd run desktop:win` or `npm.cmd run desktop:mac` on the matching operating system.

## Current scope

The prototype supports editable pages and blocks, Markdown shortcuts, page links and mentions, a slash-command menu, local persistence, typed page properties, and a collapsible outline. See [TODO](WorkInProgress/TODO.md) for what is next and [CHANGELOG](CHANGELOG.md) for version history.
