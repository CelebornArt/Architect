# Architect

Architect is a local Notion-inspired workspace prototype. It combines a web editor with an Electron desktop shell for Windows and macOS. The project is being built from the product plan and REA observations in [NotionStructure](Targets/NotionStructure.md), with future Architect-specific targets reserved in [ArchitectStructure](Targets/ArchitectStructure.md). The granular implementation inventory is in [ImplementedFeatures](Completed/ImplementedFeatures.md).

## Run it

From the project root, install dependencies with `npm.cmd install`, then start the web version with `npm.cmd run dev`. Build the TypeScript and Electron sources with `npm.cmd run build`.

On Windows, `npm.cmd run desktop` builds and launches the unpacked app. Package installers with `npm.cmd run desktop:win` or `npm.cmd run desktop:mac` on the matching operating system.

## Current scope

The prototype supports editable pages and blocks, Markdown shortcuts and common Markdown paste conversion, page links and mentions, slash commands, search (`Ctrl/Cmd+P`), a collapsible outline, block reordering, and resizable columns. Page controls include favorites, cover images with library search, upload, and banner-ratio crop preview, a searchable emoji/icon picker, navigation history, ancestor breadcrumbs, full-width layout, and word count. It starts with one blank `New hub`; the previous workspace is preserved as an exportable backup. Data currently lives in the browser profile; custom-server collaboration and an app-owned desktop data directory remain planned. See [ImplementedFeatures](Completed/ImplementedFeatures.md) for the detailed inventory, [TODO](WorkInProgress/TODO.md) for what is next, and [CHANGELOG](CHANGELOG.md) for version history.
