#!/usr/bin/env bash
# Downloads every image/icon used by the page from Figma into ./assets.
# Run from the project folder on your own machine:  bash fetch-assets.sh
# NOTE: Figma's asset links are temporary (they expire after ~7 days). If they have expired,
# re-run get_design_context in Figma and replace the ids in assets/list.txt, or export the
# layers manually from Figma using the file names in assets/list.txt.
set -u
cd "$(dirname "$0")/assets" || exit 1
fail=0
while read -r name id; do
  [ -z "${name:-}" ] && continue
  if curl -fsSL --retry 2 -o "$name" "https://www.figma.com/api/mcp/asset/$id"; then
    echo "ok    $name"
  else
    echo "FAIL  $name"; rm -f "$name"; fail=1
  fi
done < list.txt
exit $fail
