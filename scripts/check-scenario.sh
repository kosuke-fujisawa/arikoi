#!/bin/sh
# tsumugai check を固定バージョンで実行する。
#
# 使い方（リポジトリルートから実行すること）:
#   ./scripts/check-scenario.sh
#
# tsumugaiのバージョンは tools/tsumugai.version で固定する
# (scripts/install-tsumugai.sh が読む。main追従インストールは行わない)。
#
# exit code はそのまま tsumugai の結果を表す（0 = 検査OK / 1 = 検査NG）。
set -eu

cd "$(dirname "$0")/.."

./scripts/install-tsumugai.sh

exec tsumugai check scenarios/ --format json
