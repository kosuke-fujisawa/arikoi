# games/familiar-shape-of-love/

英語圏itch.io向けブラウザVN「A Familiar Shape of Love」の本体ディレクトリ。方針転換の背景は [docs/adr/0001-renpy-to-browser-vn-pivot.md](../../docs/adr/0001-renpy-to-browser-vn-pivot.md) を参照。

## 構成

```
games/familiar-shape-of-love/
  game.config.json   — defaultLanguage/supportedLanguages/plannedLanguages
  scenario/en/        — 英語版シナリオ(tsumugai記法)
  assets/{bg,music,se}/ — 英語版で使用するフリー素材
```

## 旧ディレクトリとの関係

リポジトリルートの `scenarios/`・`assets/` は、方針転換前の日本語版MVP(#1〜#8)で作成したサンプルシナリオ・placeholder素材で、**参考資料としてそのまま残す**。新規実装では使用せず、英語版のコンテンツはすべてこのディレクトリ以下にゼロから作成する。
