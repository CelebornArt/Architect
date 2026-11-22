# Git Commits

- Use Conventional Commits with a clear scope and imperative summary: `feat`, `fix`, `docs`, `refactor`, `test`, `build`, or `chore`.
- Keep releases SemVer, starting at `0.1.0`. For every release, update `package.json`, `package-lock.json`, and `CHANGELOG.md`; tag releases as `vX.Y.Z`.
- Keep commits focused. Do not commit dependencies or desktop/build artifacts (`node_modules/`, `dist-electron/`, `release/`); compiled browser `dist/*.js` bundles are tracked for direct GitHub Pages local preview.

# Global stuff

- Keep the Notion reference plan, REA comparison, and future Architect-specific targets in `Targets/`.
- Keep the current implementation inventory and completed implementation notes in `Completed/`.
- Keep `WorkInProgress/TODO.md` limited to open tasks, next steps, and known problems. Remove completed tasks instead of retaining checked items.
- Document reference-scope changes in `Targets/NotionStructure.md`; document product changes in `CHANGELOG.md` for their release.
- For every continuation prompt, read `WorkInProgress/TODO.md` first and work through its next open task. Update it as tasks finish. If it has no open tasks, inspect the project and use REA against the signed-in Notion session, then add prioritized tasks to TODO before continuing.
- If plans conflict — for example between `WorkInProgress/TODO.md`, the target specifications, and the current request — or a task or expected behavior is unclear, ask the user before implementing. Do not guess or silently choose one interpretation.
- Double-check Notion-parity features against the signed-in Notion session with REA before implementing and again when verifying the result, unless `Targets/ArchitectStructure.md` intentionally specifies different behavior. Record scope or expectation changes in `Targets/NotionStructure.md`.
- Preserve the signed-in Notion browser session used by REA. Prefer passive inspection; do not change its login, profile, or page data.
- Build with `npm.cmd run build`. In PowerShell, use `npm.cmd` to avoid the restricted `npm.ps1` shim.
- Only spawn a subagent in Hydrogen (`Gemini 4 Hydrogen`) for testing when implementing completely new features (new features only, not minor details, bug fixes, or polish; run targeted checks directly for those).
