# 0003. セーブはlocalStorage単一スロットとし、storyBuildId完全一致でのみ復元する

- 日付: 2026-07-12
- 状態: 採用(実装済みの判断の事後記録)

> **失効(2026-07-19)**: [ADR 0005](0005-tsumugai-to-tyranoscript.md) のティラノスクリプト移行に伴い、本ADRが前提とする独自ランタイム/StoryBundleは廃止された。歴史的記録として保存する。

## 背景

save/load機能の実装にあたり、永続化形式とセーブ互換ポリシーを決める必要があった。前提は以下。

- ストーリーは開発中に頻繁に再コンパイルされ、そのたびに`storyBuildId`が変わる
- step idはインデックス由来(ADR 0002)のため、シナリオ変更後に古いセーブが指す位置は信頼できない
- 本作は短編VNであり、周回のやり直しコストが低い

## 選択肢

1. **マイグレーション**(旧セーブを新バンドル向けに変換して引き継ぐ) — 短編VNのMVPには過剰で、対応表の維持コストが高い
2. **近似復元**(不一致時にシーン先頭へ巻き戻す等) — 気づかないまま違う場所へ復元される事故のリスクがある
3. **storyBuildId完全一致を要求し、不一致は復元拒否**(採用)

## 採用案

- **永続化**: localStorageキー`arikoi:save:default`(`src/lib/saveStorage.ts`)。スロットは単一デフォルトのみで、スロット選択UIは作らない
- **保存内容**(`src/lib/story/types.ts`の`SaveData`が正本): 画面状態は保存せず、StoryBundle上の位置(`currentSceneId`/`currentStepId`)+ `variables` + `choiceHistory` + `readStepIds` + メタ情報(`appVersion`/`storySchemaVersion`/`storyBuildId`/`slotId`/`savedAt`)のみ
- **復元**(`src/lib/story/save.ts`の`restoreSaveData()`): 形状検証 → `storySchemaVersion`のサポート確認 → **`storyBuildId`の完全一致** → scene/step実在確認、の順に検証し、いずれか失敗なら`ValidationError`を返して復元しない
- デフォルト値: `appVersion="0.0.0"`、`slotId="default"`

## 採用理由

- 「ストーリーを再ビルドしたら既存セーブは無効」という単純で説明可能な規則になり、壊れたセーブによる進行不能・位置ずれの事故を構造的に防げる
- 短編VNでは最初からやり直すコストが低く、セーブ無効化の実害が小さい
- 画面状態を保存しないため、UI変更がセーブ互換に影響しない

## 欠点・リスク

- **シナリオを1行直しただけでプレイヤーの既存セーブが無効になる**。リリース後のテキスト微修正で顕在化する(itch.io公開後のパッチ運用では要注意)
- 単一スロットのため、複数の周回状態を並行保持できない

## 再評価条件

- リリース後、テキスト微修正でセーブが無効になることへの実害・苦情が出た場合、互換判定の粒度緩和やマイグレーション導入を再検討する
- 複数スロットの需要が出た場合(`SaveData.slotId`とstorageキーはスロット拡張可能な形にしてある)

## 影響範囲

- `src/lib/story/types.ts`(`SaveData`)、`src/lib/story/save.ts`、`src/lib/saveStorage.ts`
- UI: `src/components/SaveLoadPanel.svelte`、`src/App.svelte`(Continueボタン)
- テスト: `tests/save.test.ts`、`e2e/novel-flow.spec.ts`(save→reload→loadのゴールデンパス)
- 関連ADR: 0002(step id採番)、0004(復元エラーの扱い)
