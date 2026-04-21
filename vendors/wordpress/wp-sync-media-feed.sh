#!/bin/sh
set -eu

WP_PATH="/var/www/html"

wp eval-file /workspace/wp-sync-media-feed.php \
  --path="$WP_PATH" \
  --allow-root
