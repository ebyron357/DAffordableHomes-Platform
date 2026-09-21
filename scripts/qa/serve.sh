#!/bin/sh
# Restart the local production server used for visual QA.
#
# It kills whatever holds the port first. Serving a stale build against fresh
# source is the failure mode that once produced a clean audit of a page with no
# stylesheet at all: the checks were structural, the copy was all still there,
# and every one of them passed.
#
# Usage: scripts/qa/serve.sh [port] [logfile]
PORT="${1:-3111}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LOG="${2:-/tmp/qa-server.log}"

for pid in $(fuser -n tcp "$PORT" 2>/dev/null); do
  kill "$pid" 2>/dev/null
done
sleep 2

cd "$ROOT/apps/web" || exit 1
nohup "$ROOT/node_modules/.bin/next" start -p "$PORT" > "$LOG" 2>&1 &

for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  sleep 1
  if curl -sS -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
    echo "ready on $PORT"
    exit 0
  fi
done

echo "failed to start; see $LOG"
tail -20 "$LOG"
exit 1
