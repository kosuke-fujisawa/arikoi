# itch.io リリース手順

「A Familiar Shape of Love」をitch.ioでブラウザプレイ可能な形で配布するための手順。

## 前提

- `npm install` 済み
- `npm run tools:install` 済み(`tools/tsumugai.version` で固定したtsumugai CLIが必要)

## 1. ビルドアーティファクト(zip)の作成

```sh
npm run release:zip
```

このコマンドは以下を行う:

1. `npm run build`(`story:check` → `story:compile` → `vite build`)で `dist/` に静的サイトを生成
2. `dist/` の中身をリポジトリルートの `a-familiar-shape-of-love-web.zip` に圧縮

zipの構造は itch.io の要件どおり **ルート直下に `index.html`** が来る形になる
(`dist/` というフォルダごと包まない)。macOSのメタデータファイル(`._*` / `.DS_Store`)は除外される。

ビルドは相対パス(`vite.config.ts` の `base: "./"`、StoryBundleのfetchは
`import.meta.env.BASE_URL` 基準)で行われる。itch.ioはzipを独自CDNのサブディレクトリ配下で
配信するため、絶対パス(`/assets/...`)では動作しない。この設定は変更しないこと。

## 2. itch.ioプロジェクト設定

[itch.ioのダッシュボード](https://itch.io/game/new)で新規プロジェクトを作成し、以下を設定する。

| 項目 | 設定値 |
| --- | --- |
| Kind of project | **HTML** |
| Uploads | `a-familiar-shape-of-love-web.zip` をアップロードし、**"This file will be played in the browser"** にチェック |
| Embed options | Viewport dimensions: `1280 x 720` を起点に調整。**Fullscreen button** 有効を推奨 |
| Mobile friendly | 現時点では未検証のためオフ |
| SharedArrayBuffer support | 不要(オフのまま) |

## 3. 価格設定

- **Free / Name your own price(最低$0)** を想定する
- 素材は完全無料・非商用前提で選定しているため(#19参照)、**有料販売はしない**。
  素材ライセンスを再確認するまで "No payments" または最低額$0のname your own priceに限定する

## 4. 公開前の動作確認チェックリスト

itch.ioのプロジェクトは公開前に **Draft** 状態でブラウザプレイを確認できる。
以下のゴールデンパス(E2Eテストと同一)を実機で通すこと:

- [ ] ページを開くとタイトル画面(Start)が即座に表示される
- [ ] Start → dialogueをクリック/キー入力で進行できる
- [ ] choiceの選択肢を選んで分岐できる
- [ ] Saveできる
- [ ] ページをリロードしてもContinueが表示され、続きから再開できる
- [ ] endingまで到達できる
- [ ] シナリオ遷移が体感で遅れない

## 関連

- #22(本手順の整備issue)
- #23(epic: 完了条件にitch.ioブラウザプレイでの起動確認を含む)
- [docs/adr/0001-renpy-to-browser-vn-pivot.md](../adr/0001-renpy-to-browser-vn-pivot.md)
