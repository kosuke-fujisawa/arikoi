# arikoi (A Familiar Shape of Love) — リポジトリ固有ガイドライン

グローバル共通ガイドライン(`~/.claude/CLAUDE.md`)の方針をベースにしつつ、本リポジトリでは以下が優先する。

## プロダクトの性質

英語圏itch.io向けブラウザVN「A Familiar Shape of Love」。方針転換の背景は
[docs/adr/0001-renpy-to-browser-vn-pivot.md](docs/adr/0001-renpy-to-browser-vn-pivot.md) を参照。

本体は [games/familiar-shape-of-love/](games/familiar-shape-of-love/) 以下。リポジトリルートの
`scenarios/`・`assets/` は転換前(日本語版MVP)の参考資料であり、新規実装では使用しない。

## 言語方針(共通ガイドラインからの上書き)

- 開発会話・コミットメッセージ・issue/PR: 共通ガイドラインどおり日本語
- **ユーザー向け成果物は英語を優先する**: README、ストア文言、ゲーム内テキスト(シナリオ・UI文言)、
  ゲーム内エラーメッセージはすべて英語で書く
- `games/familiar-shape-of-love/scenario/en/` が現行の実装対象。`scenario/ja/` は将来の日本語版用で、
  現時点では優先度が低い

## 技術スタック

- Svelte + Vite + TypeScript(状態管理ライブラリは追加せず、標準のSvelte store/moduleで実装)
- テスト: Vitest(単体) + Playwright(E2E)
- シナリオ記述: tsumugai(別リポジトリ、Rust製CLI)のDSL

```sh
npm install
npm run dev      # 開発サーバー起動
npm run build    # dist/ に静的サイトを生成
npm run preview  # ビルド済みdist/をローカルで確認
npm run check    # svelte-check + tsc
npm run test     # vitest run
npm run e2e      # playwright test
```

## StoryBundleの依存関係

arikoiはtsumugaiをnpmライブラリとしてimportしない。連携はCLIサブプロセス + JSONファイルで疎結合する。

```
games/familiar-shape-of-love/scenario/*.md
  -> 固定バージョンのtsumugai CLI (tools/tsumugai.version で固定)
  -> public/story/story-bundle.json
  -> arikoi runtime (src/lib/story/)
```

- `public/story/story-bundle.json` はMVP段階ではコミットする(生成物だが差分レビューのため)
- runtimeは読み込み時に`schemaVersion`・`storyBuildId`・scene/step構造を検証し、未対応なら起動失敗にする
  (警告で通さない)。詳細は #58 を参照
- tsumugaiのバージョン固定・導入方法は #57 を参照。`main`追従インストールは禁止

## E2E(Playwright)の位置づけ

`e2e/`配下のPlaywrightテストは、start→advance→choose→save→reload→load→continue→endingの
ゴールデンパスを実機ブラウザで確認する。Vitestの単体テストでは検証できない
「実際にビルドしたページで一連の操作が通るか」を担保する役割。UI変更時は型チェック・vitestだけでなく
このE2Eもグリーンであることを確認する。

## Definition of Done(本リポジトリでの追加基準)

共通の`quality-gate`スキルの基準に加え、以下も満たすこと:

- `npm run check` / `npm run test` / `npm run e2e` がグリーン
- UI変更時はブラウザ実機での動作確認を行う(型チェック・vitestのみでの完了報告はしない。
  過去に型チェック通過でも実機で壊れていた事例があるため)
