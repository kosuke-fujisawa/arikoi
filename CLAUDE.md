# arikoi (A Familiar Shape of Love) — リポジトリ固有ガイドライン

グローバル共通ガイドライン(`~/.claude/CLAUDE.md`)の方針をベースにしつつ、本リポジトリでは以下が優先する。
開発原則の正本は [AGENTS.md](AGENTS.md)(ティラノ標準機能優先・独自実装禁止・`.ks`正本・汎用化しない)。

## プロダクトの性質

英語圏itch.io向けの短編ブラウザビジュアルノベル「A Familiar Shape of Love」。
**ティラノスクリプト作品リポジトリ**であり、エンジン・ランタイム・DSLは実装しない。
経緯は [docs/adr/0001](docs/adr/0001-renpy-to-browser-vn-pivot.md)(ブラウザVN転換)と
[docs/adr/0005](docs/adr/0005-tsumugai-to-tyranoscript.md)(ティラノ移行)を参照。

## 言語方針(共通ガイドラインからの上書き)

- 開発会話・コミットメッセージ・issue/PR・docs: 日本語
- **ユーザー向け成果物は英語**: ゲーム内テキスト(シナリオ・UI文言)、ストア文言、ゲーム内エラーメッセージ

## 技術スタック

- 実行基盤: ティラノスクリプト v514(`tyrano/` をリポジトリに同梱、原則無改造。例外は `lang.js` の英語化のみ)
- シナリオ: `data/scenario/*.ks` が**正本**(ティラノスクリプト記法、英語)。中間DSL・Markdown正本は作らない
- ビルド工程なし。リポジトリルートをHTTP配信すればそのまま動く
- テスト: Playwright E2E(`e2e/`)のみ。単体テスト対象となる独自ロジックは持たない

```sh
npm install          # 初回のみ
npm run serve        # http://localhost:4173 でゲーム起動
npm run e2e          # Playwright E2E
npm run release:zip  # itch.io向け配布zip生成
```

## ティラノスクリプトの注意点

- タグ属性値内の半角スペースはパーサに除去される → `&nbsp;` で表現する
- `#名前` 行を使うには `[chara_config ptext=...]` で名前表示領域の宣言が必要
- 文字送り中(`is_adding_text=true`)のセーブはロード後にクリック受付が壊れる(エンジン仕様)。
  E2Eではセーブ前に `waitForTextSettled`(`e2e/helpers.ts`)を挟む
- エンジン更新時: v5タグzipを展開し、`.github/`・`package.json`(NW.js用)・`release/`・`doc.html` を
  除外して上書き後、`lang.js` の英語化差分を再適用する

## E2E(Playwright)の位置づけ

`e2e/` のテストは「タイトル→Start→テキスト送り→選択肢(両分岐)→エンディング→タイトル復帰」と
「セーブ→リロード→Continue→ロード→続行」を実機ブラウザで担保する。
シナリオ・UI変更時は必ずE2Eを実行する。

## Definition of Done(本リポジトリでの追加基準)

共通の`quality-gate`スキルの基準に加え、以下も満たすこと:

- `npm run e2e` がグリーン
- `npm run serve` でのブラウザ実機確認(型チェックが無い構成のため実機確認の比重が高い。
  過去に自動チェック通過でも実機で壊れていた事例があるため)
