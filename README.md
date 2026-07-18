# A Familiar Shape of Love (ありふれた恋のカタチ)

**arikoiはティラノスクリプト作品です。** 英語圏itch.io向けの短編ブラウザビジュアルノベルで、
実行基盤には[ティラノスクリプト](https://tyrano.jp/)(v514同梱)を利用します。
独自のノベルゲームランタイム・独自DSLは持ちません。

> 「特別な素材がなくても、人は誰かを好きになれるのか」

方針転換の経緯は [docs/adr/0001](docs/adr/0001-renpy-to-browser-vn-pivot.md)(ブラウザVN・英語圏itch.ioへの転換)と
[docs/adr/0005](docs/adr/0005-tsumugai-to-tyranoscript.md)(ティラノスクリプト移行)を参照。

## 遊ぶ・開発する

ビルド工程はありません。リポジトリルートをHTTPサーバーで配信すればそのまま動きます。

```sh
npm install          # 初回のみ(http-server / Playwright)
npm run serve        # http://localhost:4173 でゲーム起動
npm run e2e          # Playwright E2E(ゴールデンパス+セーブ/ロード)
npm run release:zip  # itch.io向け配布zipを生成(手順: docs/production/release-itch-io.md)
```

## ディレクトリ構成

```
index.html      起動エントリ(ティラノ標準)
tyrano/         エンジン本体(原則無改造。例外: lang.jsの英語化のみ)
data/
  scenario/     シナリオ(.ks)——これが正本
  bgimage/      背景
  fgimage/      立ち絵
  bgm/ sound/   音声
  image/        UI画像
  system/       Config.tjs / KeyConfig.js
docs/           世界観・キャラクター設定・ルート構成・演出意図・ADRなど、コードで表現できない資料
e2e/            Playwright E2E
```

## シナリオの書き方

- **`data/scenario/*.ks` が正本です。** 生成後も人間が自由に編集します。AIへの再入力専用形式にはしません
- 新規シナリオは「自然言語の原稿 → [scenario-to-tyrano](https://github.com/kosuke-fujisawa/scenario-to-tyrano) → `.ks`」の流れで作成できます(同ツールは開発中のため、現状は手作業でティラノスクリプト記法を書いています)
- 中間DSL・独自タグは導入しません。ティラノスクリプトの標準記法をそのまま使います
- ゲーム内テキスト・UI文言は英語です(開発会話・コミット・docsは日本語)

## ドキュメント

| カテゴリ | リンク |
|---|---|
| 設計判断の記録(ADR) | [docs/adr/](docs/adr/) |
| コンセプト(英語版、現行) | [docs/en/concept.md](docs/en/concept.md) |
| 登場キャラクター(現行) | [docs/characters/protagonists.md](docs/characters/protagonists.md) |
| itch.ioリリース手順 | [docs/production/release-itch-io.md](docs/production/release-itch-io.md) |
| コンセプト(転換前・参考) | [docs/concept.md](docs/concept.md) |
| テーマ・作品の本質 | [docs/theme.md](docs/theme.md) |
| シナリオ構造(転換前・参考) | [docs/scenario/structure.md](docs/scenario/structure.md) |
| キャラクター一覧(転換前・参考) | [docs/characters/overview.md](docs/characters/overview.md) |
| 演出方針 | [docs/production/direction.md](docs/production/direction.md) |
| 素材方針 | [docs/production/assets.md](docs/production/assets.md) |

## ジャンル

学園恋愛ノベルゲーム(平成ギャルゲーリスペクト)

## 参考作品

ToHeart2 / 夜明け前より瑠璃色な / D.C. / Canvas / 2000年代PCギャルゲー全般

## Credits

- Engine: [TyranoScript](https://tyrano.jp/) (C) STRIKEWORKS / ShikemokuMK — ライセンスは [LICENCE.txt](LICENCE.txt) を参照。
  エンジン一式は作品配布のためリポジトリに同梱しています(エンジン単体の再配布・商材化は不可)
- デスクトップ版(NW.js)を作る場合は、ティラノ公式配布物の `package.json`・`release/` を別途取得してください
