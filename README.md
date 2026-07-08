# ありふれた恋のカタチ

完全フリー素材のみで構成された、正統派平成ギャルゲー風ノベルゲーム。

> 「特別な素材がなくても、人は誰かを好きになれるのか」

**注記**: 2026-07-05、英語圏itch.io向けブラウザVN「A Familiar Shape of Love」への方針転換を決定した。背景は [docs/adr/0001-renpy-to-browser-vn-pivot.md](docs/adr/0001-renpy-to-browser-vn-pivot.md) を参照。以下のコンセプト・ドキュメントは転換前の参考資料。現行の実装は [games/familiar-shape-of-love/](games/familiar-shape-of-love/) 以下で進める。

---

## Webランタイム(開発用コマンド)

Svelte + Vite + TypeScriptで実装する。状態管理ライブラリは追加せず、標準のSvelte store/module stateで実装する方針。

```sh
npm install
npm run dev      # 開発サーバー起動
npm run build    # dist/ に静的サイトを生成
npm run preview  # ビルド済みdist/をローカルで確認
npm run check    # svelte-check + tsc
```

`public/story/` にStoryBundle JSON(tsumugai CLIの出力、#20で生成)を配置する想定。

---

## ドキュメント

| カテゴリ | リンク |
|---|---|
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
