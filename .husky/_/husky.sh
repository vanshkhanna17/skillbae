#!/usr/bin/env zsh
# Husky helper for Git hooks (v9+)
if [ -z "$husky_skip_init" ]; then
  readonly hook_name="$(basename "$0")"
  if [ "$HUSKY" = "0" ]; then
    exit 0
  fi
  if [ ! -d .git ]; then
    exit 0
  fi
fi
