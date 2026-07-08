# 0001. Ren'Py・日本語ギャルゲー再現から、ブラウザVN・英語itch.io作品への方針転換

- 日付: 2026-07-08
- 状態: 採用

## 背景

「ありふれた恋のカタチ」は当初、Ren'Pyエンジンで平成ギャルゲーの文法を日本語圏向けに再現する作品として開発を進めていた(#1〜#8)。tsumugaiによるシナリオDSL導入、フリー素材選定、Ren'Pyプロジェクト骨格の整備までは完了していた。

一方で、以下の制約・判断が重なった。

- Ren'Pyはデスクトップ/モバイル配布が主戦場であり、ブラウザですぐ遊べる短編VNとしての配布(itch.io想定)には不向き
- ターゲット層を日本語圏の平成ギャルゲー再現から、英語圏itch.ioのretro Japanese galge-styleを好むプレイヤー(fast-first VN reader)に転換する方が、フリー素材制約下でも成立させやすいと判断した
- エンジン(tsumugai)側でTypeScript全面移行epic(tsumugai#99)を検討したが不採用となり、tsumugaiはRust製CLIとして維持することが決まった

これに伴い、arikoi自体もRen'Pyを離れ、ブラウザ上で動く独自Webランタイムを持つ構成へ再設計する必要が生じた。

## 選択肢

1. **Ren'Pyを維持し、Webエクスポート機能で対応する**
   Ren'Py自体にHTML5ビルド機能はあるが実験的で、fast-first(即起動・低レイテンシ)なブラウザ体験には向かない。
2. **tsumugaiをTypeScript化し、arikoiがnpm依存として直接組み込む**
   tsumugai側のepic #99として検討したが、エンジン側の設計判断により不採用・クローズとなった。
3. **tsumugaiはRust製CLIのまま維持し、arikoiは独自のSvelte + Vite + TypeScript製Webランタイムを持ち、CLIサブプロセス実行 + StoryBundle JSONファイル出力で疎結合する(採用案)**

## 採用案

- エンジン(kosuke-fujisawa/tsumugai)はRust製CLIとして維持し、別リポジトリで開発を続ける
- arikoi(本リポジトリ)は `games/familiar-shape-of-love/` にシナリオ・アセット・設定を持ち、tsumugaiをCLIサブプロセスとして呼び出す
  - `tsumugai compile ... --target web --output public/story/story-bundle.json` でStoryBundle JSONを生成する
  - arikoiとtsumugaiはnpm依存ではなく、CLI実行 + JSONファイルという疎結合な境界を持つ
- arikoi側にSvelte + Vite + TypeScript製の独自Webランタイムを実装し、StoryBundle JSONを読み込んでdialogue/choice/ending/save-load/backlogを表示する
- 作品コンセプトを英語圏itch.io向けの短編VN「A Familiar Shape of Love」として新規に描き直す(ターゲット: fast-first VN reader)
- 既存の日本語コンセプト・キャラクター設定文書(docs/配下)は削除せず、参考資料として保持する

## 採用理由

- CLIサブプロセス + JSONファイルという境界は、tsumugai・arikoi双方の技術スタックが分岐しても影響を受けにくい(Reversible Decisions)
- Ren'Pyのデスクトップ/モバイル配布前提を捨てることで、itch.ioでのfast-first体験(即起動・低レイテンシ)を優先できる
- 英語圏itch.io市場は、retro Japanese galge-styleの短編VNに対する既存の需要があり、フリー素材制約の中でも成立させやすい
- エンジンのTypeScript全面移行(tsumugai#99)を待たずに済み、tsumugai側の設計判断から独立して開発を進められる

## 欠点・リスク

- Ren'Pyで既に投じた実装(#5のRen'Pyプロジェクト骨格、game/*.rpy)は破棄する。ただし成果はコンセプト検証としては無駄にならない
- 日本語版で作り込んだコンセプト・キャラクター設定は英語版では直接使えず、新規に描き直す工数が発生する
- CLIサブプロセス実行は、tsumugai側のバイナリ配布・バージョン固定の仕組みが整うまでは統合コスト・ブロッカーになりうる(#20は tsumugai#128 待ちでblocked)
- 独自Webランタイムの実装(#24〜#34)は、Ren'Pyが提供していたUI機能(セーブ/ロードUI、テキスト送り等)をゼロから作り直すコストを伴う

## 再評価条件

- tsumugai側でCLIサブプロセス実行が技術的に不安定(起動が遅い、バイナリ配布が困難等)と判明した場合、npm依存への回帰を再検討する
- 技術スパイク(#23の完了条件: start→advance→choose→save→reload→load→continue→endingが1本のシナリオで通ること)が成立しない場合、Svelte + Vite構成自体を見直す

## 影響範囲

- `game/*.rpy`(Ren'Pyプロジェクト骨格): 削除対象(#14)
- `docs/`配下の日本語コンセプト・キャラクター設定文書: 参考資料として保持、実装対象外(#16〜#18で英語版を新規作成)
- 新設: `games/familiar-shape-of-love/`(シナリオ・アセット・設定)、Svelte + Vite + TypeScript製Webランタイム一式
- CI: tsumugai validate/compile前提に更新(#21)
- リリース手順: itch.io向けビルドアーティファクト作成(#22)
- 関連リポジトリ: kosuke-fujisawa/tsumugai(エンジン、Rust CLIとして維持)
