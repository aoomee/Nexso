#!/usr/bin/env bash
# Generate all Nexso icon sizes and the native ICNS from shared vector artwork.
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/generate-nexso-icons.cjs
