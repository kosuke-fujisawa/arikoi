# itch.io リリース手順

「A Familiar Shape of Love」をitch.ioでブラウザプレイ可能な形で配布するための手順。

## 前提

- `npm install` 済み(zip作成自体はnpm不要。`zip`コマンドがあればよい)
- ティラノスクリプトはビルド工程を持たないため、コンパイル等は不要

## 1. ビルドアーティファクト(zip)の作成

```sh
npm run release:zip
```

リポジトリの `index.html` + `tyrano/` + `data/` + `LICENCE.txt` をそのまま
`a-familiar-shape-of-love-web.zip` に圧縮する。itch.io の要件どおり
**ルート直下に `index.html`** が来る構造になる。macOSのメタデータファイル
(`._*` / `.DS_Store`)は除外される。

CI(game-ci.yml)でも同じzipがアーティファクトとして生成される。

## 2. itch.ioプロジェクト設定

[itch.ioのダッシュボード](https://itch.io/game/new)で新規プロジェクトを作成し、以下を設定する。

| 項目 | 設定値 |
| --- | --- |
| Kind of project | **HTML** |
| Uploads | `a-familiar-shape-of-love-web.zip` をアップロードし、**"This file will be played in the browser"** にチェック |
| Embed options | Viewport dimensions: `1280 x 720`(Config.tjsのscWidth/scHeightと一致させる)。**Fullscreen button** 有効を推奨 |
| Mobile friendly | 現時点では未検証のためオフ |
| SharedArrayBuffer support | 不要(オフのまま) |

補足: `Config.tjs` の `projectID` を設定済みのため、itch.ioのCDN上で他ゲームと
localStorage(セーブデータ)が衝突することはない。

## 3. 価格設定

- **Free / Name your own price(最低$0)** を想定する
- 素材は完全無料・非商用前提で選定しているため(#19参照)、**有料販売はしない**。
  素材ライセンスを再確認するまで "No payments" または最低額$0のname your own priceに限定する

## 4. 公開前の動作確認チェックリスト

itch.ioのプロジェクトは公開前に **Draft** 状態でブラウザプレイを確認できる。
以下のゴールデンパス(E2Eテストと同一)を実機で通すこと:

- [ ] ページを開くとタイトル画面(Start / Continue)が即座に表示される
- [ ] Start → テキストをクリック/Enterで進行できる
- [ ] 選択肢を選んで分岐できる
- [ ] メニュー(右下ボタン)からSaveできる
- [ ] ページをリロードしてもContinue→ロードで続きから再開できる
- [ ] エンディング(The End)まで到達し、タイトルへ戻る
- [ ] シナリオ遷移が体感で遅れない

## 関連

- #22(本手順の整備issue)
- #23(epic: 完了条件にitch.ioブラウザプレイでの起動確認を含む)
- [docs/adr/0005-tsumugai-to-tyranoscript.md](../adr/0005-tsumugai-to-tyranoscript.md)
