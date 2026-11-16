# Project instructions

- Keep the Notion reference plan in `Completed/NotionStructure.md` and product-specific changes in `WorkInProgress/ArchitectStructure.md`.
- Update `WorkInProgress/TODO.md` when work starts or finishes. Record the next concrete tasks and remaining bugs.
- Document every product or architecture change in `Completed/NotionStructure.md` when it changes reference scope, and in `CHANGELOG.md` for each release.
- Use Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `build`, `chore`) with clear imperative descriptions. Keep releases SemVer, starting at `0.1.0`; update `package.json`, the lockfile, and `CHANGELOG.md` for every version.
- Preserve the signed-in Notion browser session used by REA. Prefer passive inspection; do not change its login, profile, or page data.
- Build with `npm.cmd run build`. Use `npm.cmd` in PowerShell to avoid the restricted `npm.ps1` script shim.
