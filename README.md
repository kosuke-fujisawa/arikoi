# ありふれた恋のカタチ

完全フリー素材のみで構成された、正統派平成ギャルゲー風ノベルゲーム。

> 「特別な素材がなくても、人は誰かを好きになれるのか」

**注記**: 2026-07-05、英語圏itch.io向けブラウザVN「A Familiar Shape of Love」への方針転換を決定した。背景は [docs/adr/0001-renpy-to-browser-vn-pivot.md](docs/adr/0001-renpy-to-browser-vn-pivot.md) を参照。以下のコンセプト・ドキュメントは転換前の参考資料。現行の実装は [games/familiar-shape-of-love/](games/familiar-shape-of-love/) 以下で進める。

---

## Webランタイム(開発用コマンド)

Svelte + Vite + TypeScriptで実装する。状態管理ライブラリは追加せず、標準のSvelte store/module stateで実装する方針。

```sh
npm install
npm run tools:install  # tools/tsumugai.versionで固定したtsumugai CLIを導入(初回のみ)
npm run dev             # StoryBundle再生成 + 開発サーバー起動
npm run build           # story:check + StoryBundle再生成 + dist/ に静的サイトを生成
npm run preview         # ビルド済みdist/をローカルで確認
npm run check           # svelte-check + tsc
npm run story:check     # tsumugai checkでシナリオを静的検査
npm run story:compile   # tsumugai compileの出力をarikoi runtime形式に変換しpublic/story/story-bundle.jsonへ書き出す
npm run release:zip     # itch.io向け配布zipを生成(手順: docs/production/release-itch-io.md)
```

arikoiはtsumugaiをnpm importせず、固定バージョンのCLIをサブプロセス実行してStoryBundle JSONを生成する(`scripts/compile-story.ts`)。tsumugaiの生出力(`type`/`stepIndex`参照)はarikoi runtimeの内部形式(`kind`/`id`参照)と異なるため、compile時に変換する。

---

## ドキュメント

| カテゴリ | リンク |
|---|---|
| 設計判断の記録(ADR、現行) | [docs/adr/](docs/adr/) |
| コンセプト(英語版、現行) | [docs/en/concept.md](docs/en/concept.md) |
| コンセプト | [docs/concept.md](docs/concept.md) |
| テーマ・作品の本質 | [docs/theme.md](docs/theme.md) |
| シナリオ構造 | [docs/scenario/structure.md](docs/scenario/structure.md) |
| キャラクター一覧 | [docs/characters/overview.md](docs/characters/overview.md) |
| 演出方針 | [docs/production/direction.md](docs/production/direction.md) |
| 素材方針 | [docs/production/assets.md](docs/production/assets.md) |

## ジャンル

学園恋愛ノベルゲーム（平成ギャルゲーリスペクト）

## 参考作品

ToHeart2 / 夜明け前より瑠璃色な / D.C. / Canvas / 2000年代PCギャルゲー全般
