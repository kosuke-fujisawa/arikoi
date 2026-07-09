#!/bin/sh
# tools/tsumugai.version に固定されたバージョンのtsumugai CLIをインストールする。
#
# tools/tsumugai.version の書式(1行のみ):
#   v0.1.0            — tsumugaiのgit tag
#   rev:<commit-sha>  — tsumugaiのgit commit SHA(検証中のみ許容)
#
# main追従インストール(--tag/--revどちらも指定しないcargo install)は行わない。
#
# 使い方（リポジトリルートから実行すること）:
#   ./scripts/install-tsumugai.sh
set -eu

cd "$(dirname "$0")/.."

version_file="tools/tsumugai.version"
: "${TSUMUGAI_REPO:=https://github.com/kosuke-fujisawa/tsumugai}"

if [ ! -f "$version_file" ]; then
  echo "エラー: $version_file が見つかりません" >&2
  exit 1
fi

version="$(tr -d '[:space:]' < "$version_file")"

if [ -z "$version" ]; then
  echo "エラー: $version_file が空です" >&2
  exit 1
fi

case "$version" in
  rev:*)
    rev="${version#rev:}"
    cargo install --git "$TSUMUGAI_REPO" --rev "$rev" --locked --force tsumugai
    ;;
  v*)
    cargo install --git "$TSUMUGAI_REPO" --tag "$version" --locked --force tsumugai
    ;;
  *)
    echo "エラー: $version_file の形式が不正です(先頭は 'v' または 'rev:' である必要があります): $version" >&2
    exit 1
    ;;
esac

# 現行tsumugaiは --version を実装していないため確認できないバージョンがある。
# 失敗してもインストール自体は成功しているので、固定値の表示を優先しスクリプトは失敗させない。
echo "固定バージョン: $version"
tsumugai --version || true
