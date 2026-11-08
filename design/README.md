# Netcatty UI revision

Based on upstream snapshot `7949242765a07bc2e766cd04e69eff32cf666699`.

## Design rules

- Shared geometry in `components/ui/design-system.css`: 10 px small elements, 16 px form controls/buttons, 20 px floating menus, 24 px cards, 28 px dialogs. Tailwind's global radius scale uses these same tokens, including settings, SFTP, vault entities, and other existing utility-based surfaces.
- Connected split panes keep their flush layout edges; switches, status dots and badges keep their pill/circle geometry. Terminal text/canvas geometry is not changed.
- The Snow palette uses darker secondary text and visible form outlines. A numerical contrast test covers body/secondary text, primary labels, selected items and form boundaries. Other installed theme presets remain selectable.
- Compact host grid: 52 px cards, 8 px gaps. Virtualized row height matches rendered card height.
- Shared inputs, selects, buttons, menus, popovers, cards, dialogs, toasts and settings cards use the design system. Form keyboard focus is visible.

## Review

Open `netcatty-ui-preview.html` directly in a browser. The review harness is offline and uses sample data only; it does not connect to SSH or save passwords. The top-right control gallery demonstrates form/menu/dialog styles in light and dark modes. It shares production geometry CSS and workspace presentation components, but it is not the complete Electron application.

After installing the repository dependencies, regenerate with `npm run preview:ui`.

## Motion revision 0.1.1

- Shared ease-out curve: cubic-bezier(.22, 1, .36, 1). Control feedback 140-220 ms; dialog/panel entry 300 ms.
- Panels enter with only a 10 px offset; no animated widths or terminal dimensions. Dialog scale is independent of its centering transform.
- Radix floating layers use entry/exit animations; custom dropdowns animate entry only, retaining immediate unmount. Select retains its upstream no-animation positioning contract.
- Reduced-motion disables decorative transitions/animations. No continuous decorative animations, staggered host entrances or extra product copy.

## Validation

- Production build and full ESLint pass; 194 focused UI/host/theme/updater tests pass.
- Prior packaged native smoke check: node-pty, serialport, sqlite3 and ssh2 load; local zsh PTY exits 0 and SQLite query succeeds.
- Full type checking has 778 diagnostics matching the untouched upstream baseline after path/line normalization. It is not a clean type-check pass.
- Desktop GUI launch/visual motion acceptance and real remote SSH/SFTP remain unverified in the execution environment.
- The package uses separate Nexso app identity and data storage. Automatic upstream binary updates are disabled for this local build. The package is ad-hoc signed, not Apple-notarized.
- OAuth cloud sync needs upstream VITE_SYNC_* build credentials, which are not included in this local build. Do not claim complete feature parity.

## Public preview 0.1.2

- Lavender solid cloud icon with a rounded terminal chevron; generated vector assets cover Dock, tray, splash, UI and icon variants.
- Repository/update source: https://github.com/aoomee/Nexso. Update cache is isolated from upstream; foreign release URLs are rejected. Ad-hoc builds check and notify, then open the project release page for manual installation.
- 204 focused regression tests pass, including update-source rejection, cache isolation, icon sizes and wordmark accessibility. ESLint and production build pass.
- Native package signature, icon resource equality and DMG checksum are verified. Full type-checking remains at the upstream 778 diagnostics.

## Release privacy 0.1.3

- Preview host and group labels are generic examples, including in retained source history.
- Release commits use the project's GitHub noreply identity.
- Native macOS debug records are stripped after dependency rebuilding and before ASAR generation. Runtime exports are retained; the final application is signed afterward.
- Packaging fails if the build user's home path remains in application resources. The gate checks binary and packed data without echoing private values into CI logs.
