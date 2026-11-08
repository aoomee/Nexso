#!/bin/bash
set -euo pipefail

# Validate the delivered filesystem and a drag-install equivalent, not just
# the app before image creation. Do not strip xattrs here: that would conceal
# a broken image whose Finder metadata invalidates the shipped signature.
dmg_path="${1:?Usage: verify-macos-dmg.sh path/to/installer.dmg}"
check_dir="$(mktemp -d "${TMPDIR:-/tmp}/nexso-dmg-check.XXXXXX")"
mounted=0
cleanup() {
  if [[ "$mounted" == 1 ]]; then hdiutil detach "$check_dir/mount" >/dev/null || true; fi
  rm -rf "$check_dir"
}
trap cleanup EXIT
mkdir "$check_dir/mount"
hdiutil verify "$dmg_path"
hdiutil attach "$dmg_path" -readonly -nobrowse -mountpoint "$check_dir/mount"
mounted=1
image_app="$check_dir/mount/Nexso.app"
codesign --verify --deep --strict "$image_app"
icon_name="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIconFile' "$image_app/Contents/Info.plist")"
iconutil -c iconset "$image_app/Contents/Resources/$icon_name" -o "$check_dir/Nexso.iconset"
ditto "$image_app" "$check_dir/Nexso.app"
codesign --verify --deep --strict "$check_dir/Nexso.app"
node -e 'require("./scripts/check-build-privacy.cjs").assertNoBuildHome(process.argv[1])' "$check_dir/Nexso.app/Contents/Resources"
NEXSO_TEST_APP="$check_dir/Nexso.app" ELECTRON_RUN_AS_NODE=1 "$check_dir/Nexso.app/Contents/MacOS/Nexso" scripts/smoke-packaged-app.cjs
echo 'DMG, copied application, icon and native runtime verified'
