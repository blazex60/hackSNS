#!/usr/bin/env bash
# PostToolUse hook: .ts/.tsx ファイル編集後に ESLint と tsc を実行して結果を Claude に返す

f=$(jq -r '.tool_input.file_path // ""')
echo "$f" | grep -qE '\.(ts|tsx)$' || exit 0

lint_out=$(npm run lint 2>&1)
tsc_out=$(npx tsc --noEmit 2>&1)

jq -n --arg l "$lint_out" --arg t "$tsc_out" \
  '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":("[Lint]\n" + $l + "\n\n[TypeScript]\n" + $t)}}'
