#!/bin/sh
# tsumugai check を固定バージョンで実行する。
#
# 使い方（リポジトリルートから実行すること）:
#   TSUMUGAI_VERSION=<tsumugaiのgit commit SHA> ./scripts/check-scenario.sh
#
# exit code はそのまま tsumugai の結果を表す（0 = 検査OK / 1 = 検査NG）。
set -eu

: "${TSUMUGAI_VERSION:?環境変数 TSUMUGAI_VERSION に tsumugai の git revision (commit SHA) を指定してください}"

cargo install --git https://github.com/kosuke-fujisawa/tsumugai --rev "$TSUMUGAI_VERSION" --locked tsumugai

exec tsumugai check scenarios/ --format json
