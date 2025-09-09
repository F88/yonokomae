#!/usr/bin/env bash
set -euo pipefail

# measure-title-debug.sh
# Build @yonokomae/app twice (debug OFF / debug ON) and report size + marker deltas.
# Requirements: pnpm, node, gzip available in PATH.

APP_FILTER="@yonokomae/app"
APP_DIR="packages/app"

echo "== Clean previous temp outputs =="
rm -rf "${APP_DIR}/dist" "${APP_DIR}/dist_no_debug" "${APP_DIR}/dist_debug" "${APP_DIR}/dist_prod_sanity" || true

echo "== Build baseline (debug OFF) =="
VITE_TITLE_DEBUG=0 pnpm --filter "$APP_FILTER" run build >/dev/null
mv "${APP_DIR}/dist" "${APP_DIR}/dist_no_debug"

echo "== Build debug (debug ON, compact) =="
VITE_TITLE_DEBUG=1 VITE_TITLE_DEBUG_MODE=compact pnpm --filter "$APP_FILTER" run build >/dev/null
mv "${APP_DIR}/dist" "${APP_DIR}/dist_debug"

sum_raw_bytes() {
  local dir="$1"; local total=0; local size
  while IFS= read -r -d '' f; do
    size=$(stat -f%z "$f")
    total=$((total+size))
  done < <(find "$dir" -type f -name '*.js' -print0 2>/dev/null)
  echo "$total"
}

sum_gzip_bytes() {
  local dir="$1"; local total=0; local size
  while IFS= read -r -d '' f; do
    size=$(gzip -c "$f" | wc -c | tr -d ' ')
    total=$((total+size))
  done < <(find "$dir" -type f -name '*.js' -print0 2>/dev/null)
  echo "$total"
}

count_markers() {
  local dir="$1"; grep -R "\[DEBUG\]" "$dir" 2>/dev/null | wc -l | tr -d ' ' || echo 0
}

BASE_RAW=$(sum_raw_bytes "${APP_DIR}/dist_no_debug")
DBG_RAW=$(sum_raw_bytes "${APP_DIR}/dist_debug")
BASE_GZIP=$(sum_gzip_bytes "${APP_DIR}/dist_no_debug")
DBG_GZIP=$(sum_gzip_bytes "${APP_DIR}/dist_debug")
BASE_MARKERS=$(count_markers "${APP_DIR}/dist_no_debug")
DBG_MARKERS=$(count_markers "${APP_DIR}/dist_debug")

RAW_DELTA=$((DBG_RAW-BASE_RAW))
if [ "$BASE_RAW" -gt 0 ]; then
  RAW_PCT=$(node -e "console.log((( $RAW_DELTA / $BASE_RAW)*100).toFixed(2))")
else RAW_PCT=0; fi
GZIP_DELTA=$((DBG_GZIP-BASE_GZIP))
if [ "$BASE_GZIP" -gt 0 ]; then
  GZIP_PCT=$(node -e "console.log((( $GZIP_DELTA / $BASE_GZIP)*100).toFixed(2))")
else GZIP_PCT=0; fi

echo ""
echo "== Size Metrics (raw JS) =="
echo "baseline_js_bytes=$BASE_RAW"
echo "debug_js_bytes=$DBG_RAW"
echo "raw_delta_bytes=$RAW_DELTA (${RAW_PCT}%)"
echo "== Size Metrics (gzip aggregated) =="
echo "baseline_gzip_bytes=$BASE_GZIP"
echo "debug_gzip_bytes=$DBG_GZIP"
echo "gzip_delta_bytes=$GZIP_DELTA (${GZIP_PCT}%)"
echo "== Debug Marker Counts =="
echo "baseline_markers=$BASE_MARKERS"
echo "debug_markers=$DBG_MARKERS"
echo "== Marker Samples (debug build) =="
grep -R "\[DEBUG\]" "${APP_DIR}/dist_debug" 2>/dev/null | head -n 5 || true

echo ""
echo "== Production sanity rebuild (debug OFF) =="
VITE_TITLE_DEBUG=0 pnpm --filter "$APP_FILTER" run build >/dev/null
mv "${APP_DIR}/dist" "${APP_DIR}/dist_prod_sanity"
PROD_RAW=$(sum_raw_bytes "${APP_DIR}/dist_prod_sanity")
PROD_MARKERS=$(count_markers "${APP_DIR}/dist_prod_sanity")
echo "prod_sanity_js_bytes=$PROD_RAW"
echo "prod_sanity_markers=$PROD_MARKERS"

echo ""
if [ "$BASE_MARKERS" = "0" ] && [ "$PROD_MARKERS" = "0" ]; then
  echo "SUCCESS: No debug markers in baseline or production sanity build."
else
  echo "WARNING: Unexpected debug markers detected in a supposedly stripped build." >&2
fi

echo "Done."
