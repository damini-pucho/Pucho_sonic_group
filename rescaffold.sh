#!/usr/bin/env sh
# rescaffold.sh — re-run scaffold_os.py on Windows without losing app/src/custom/index.js.
# Why: pucho-os 4.4.0 scaffold_os.py checks AUTHORED paths with "src/custom" while os.walk on Windows yields "src\custom",
# so it copies the template's empty CUSTOM registry over ours and records it in docs/.generated.json. Until the kit is fixed,
# re-scaffold through this script.   Usage:  PUCHO_OS=<skill path> PY=<python> sh rescaffold.sh [--overwrite-drift]
set -e
: "${PUCHO_OS:?set PUCHO_OS to the pucho-os skill folder}"; PY="${PY:-python}"
cd "$(dirname "$0")"
cp app/src/custom/index.js /tmp/sonic-custom-index.js
"$PY" "$PUCHO_OS/scripts/scaffold_os.py" os.yaml . "$@"
cp /tmp/sonic-custom-index.js app/src/custom/index.js
"$PY" - <<'EOF'
import json
p = "docs/.generated.json"; d = json.load(open(p))
for k in [k for k in d if k.replace("\\", "/").startswith(("app/src/custom/", "app/src/screens/overrides.js"))]: d.pop(k)
json.dump(d, open(p, "w"), indent=2)
EOF
grep -q "TallyExport" app/src/custom/index.js && echo "custom registry kept (TallyExport)"
