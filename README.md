# Nexso

A compact SSH workspace based on [Netcatty](https://github.com/binaricat/Netcatty), with a consistent rounded interface and restrained motion.

[Download the latest release](https://github.com/aoomee/Nexso/releases/latest) · [中文说明](README.zh-CN.md)

## Download

The current preview provides a **macOS Apple Silicon (M1 and later) DMG**. Open it and drag Nexso into Applications. Nexso uses its own application identity and settings directory, so it can coexist with Netcatty. Export/import your hosts using the application's existing tools if you want to move them.

The app checks **aoomee/Nexso Releases only**. It notifies you about new versions and opens the project download page. Automatic in-place installation is intentionally unavailable until the project has a stable Apple developer signing identity. Current packages are ad-hoc signed and are not notarized by Apple.

## Build

Node.js 22 or newer and platform build tools are required (Xcode Command Line Tools on macOS). Use a checkout path without spaces.

```sh
npm ci
npm run fetch:mosh:dev
npm run fetch:et:dev
npm run build
npx electron-builder --config scripts/electron-builder.nexso.cjs --mac --arm64 --publish=never
```

`nexso.config.json` owns the project name and release repository. `package.json` owns the version. The manual **Nexso Release** Actions workflow builds a tagged Apple Silicon DMG and publishes it to this repository. Increment the version, push a matching `vX.Y.Z` tag, then run that workflow with the tag.

## Validation and limitations

The UI/updater regression tests, ESLint, production build, packaged local PTY and native dependency loading are checked. These checks do not establish complete end-to-end SSH/SFTP, serial-device or cloud-provider parity. Full type-checking and the full upstream test suite have pre-existing failures documented in `design/README.md`. OAuth-based cloud sync requires your own build-time client configuration; upstream credentials are not redistributed.

## Upstream and license

Derived from Netcatty snapshot `7949242765a07bc2e766cd04e69eff32cf666699`. The original SSH, terminal, SFTP, vault and plugin implementations are retained. Nexso changes the interface, branding, distribution and update source. See [upstream documentation](README.upstream.md) and [upstream provenance](UPSTREAM.md).

GPL-3.0-or-later; see [LICENSE](LICENSE). Copyright and attribution notices from the original project remain intact. The source at each release tag corresponds to that release's binary.
