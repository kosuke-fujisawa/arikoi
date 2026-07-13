# 0002. tsumugai compile出力はコンパイル時にarikoi内部形式へ変換する(位置参照→id参照)

- 日付: 2026-07-12
- 状態: 採用(実装済みの判断の事後記録)

## 背景

ADR 0001でtsumugaiとの連携を「CLIサブプロセス + StoryBundle JSON」の疎結合とした。しかし`tsumugai compile --target web`の生出力とarikoi runtimeの内部契約には構造差がある。

- tsumugaiの出力はstepにidを持たず、jump/choiceの飛び先を`{ sceneId, stepIndex }`の**位置参照**で表す
- arikoiのengine/save/SaveDataは「stepを**idで指す**」前提で実装済み(セーブデータが`currentStepId`を保持する)
- tsumugaiには「ゲーム全体のタイトル」という概念がなく、生出力の`title`はエントリ1シーンのタイトルにすぎない

この構造差をどの層で吸収するかを決める必要があった。

## 選択肢

1. **runtime側を位置参照(stepIndex)ベースに書き換える** — engine/save/backlog全体がインデックス演算に依存し、既存実装の前提と衝突する
2. **runtimeが読み込み時に毎回変換する** — コミットされる`public/story/story-bundle.json`が「runtimeが実際に読む形式」でなくなり、差分レビューの価値が下がる
3. **コンパイル時に`scripts/compile-story.ts`で一度だけ変換する**(採用)

## 採用案

`scripts/compile-story.ts`の`convert()`がコンパイル時に生出力をarikoi内部形式へ変換する。**契約の正本はコード**(`compile-story.ts`と`src/lib/story/types.ts`)であり、このADRは要点の索引に留める。

- **step id採番**: `${sceneId}#${index}`。choice選択肢は`${stepId}-choice-${optionIndex}`、asset idは`${kind}-${basename}`
- **schemaVersionは2系統ある(混同注意)**:
  - tsumugai生出力 = `"1"`(`SUPPORTED_RAW_SCHEMA_VERSIONS`、compile-story.ts)
  - arikoi内部 = `"0.1.0"`(`ARIKOI_SCHEMA_VERSION`。engine.tsの`SUPPORTED_SCHEMA_VERSIONS`と対応)
- **ゲームタイトルはCLI第3引数で注入**(package.jsonの`story:compile`参照)。省略時は生出力の`title`(エントリシーンのタイトル)にフォールバック
- 変換後の型は`src/lib/story/types.ts`の`StoryBundle`が正本

## 採用理由

- tsumugai側の出力形式変化を変換層1箇所で吸収でき、runtime内部形式とSaveDataを安定させられる
- コミットされる`story-bundle.json`がruntimeの読む形式そのものになり、差分レビューが機能する(CLAUDE.mdの「MVP段階ではコミットする」方針と整合)
- 変換は`story:compile`実行時の1回だけで、起動時コストがない

## 欠点・リスク

- step idはインデックス由来のため、シナリオの行挿入・削除でid全体がずれる。**idの安定性を期待してはいけない**(セーブ互換はstoryBuildId完全一致で別途担保する。ADR 0003参照)
- schemaVersionの2系統を混同しやすい(このADRとコード内コメントで明示)
- tsumugaiが出力形式を変えた場合、`convert()`と`SUPPORTED_RAW_SCHEMA_VERSIONS`の更新が必要

## 再評価条件

- tsumugaiがstep idやゲーム全体タイトルをネイティブに出力するようになった場合、変換層の縮小を検討する
- 多言語バンドル(story-bundle.en.json / story-bundle.ja.json)の導入時に、採番規則の見直しが必要になった場合

## 影響範囲

- `scripts/compile-story.ts`(変換層の正本)
- `src/lib/story/types.ts` / `src/lib/story/engine.ts`(変換後形式の消費側)
- `public/story/story-bundle.json`(生成物。MVP段階ではコミット)
- 関連issue: #57(tsumugaiバージョン固定)、#58(StoryBundle構造検証)。関連ADR: 0001、0003
