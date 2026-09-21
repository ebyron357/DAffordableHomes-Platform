#!/bin/sh
# Kill any next-server holding 3111, then start a fresh one on the current build.
# Leaving the old one running across a rebuild makes it serve the previous
# build's chunk names and answer 500 for them, which renders an unstyled page
# that still passes every content check.
for p in $(ls /proc 2>/dev/null | grep -E '^[0-9]+$'); do
  c=$(tr '\0' ' ' < /proc/$p/cmdline 2>/dev/null)
  case "$c" in *next-server*) kill -9 "$p" 2>/dev/null ;; esac
done
sleep 3
cd "$(dirname "$0")/apps/web" || exit 1
nohup npx next start -p 3111 > /tmp/next-server.log 2>&1 &
sleep 22
css=$(curl -s -m 10 http://127.0.0.1:3111/ | grep -o '/_next/static/chunks/[a-z0-9_]*\.css' | head -1)
code=$(curl -s -o /dev/null -m 10 -w '%{http_code}' "http://127.0.0.1:3111$css")
echo "css $css -> $code"
[ "$code" = "200" ] || { echo "STALE SERVER"; exit 1; }
