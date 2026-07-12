# 0004. 外部入力の検証は非throw(ValidationError返却)、進行APIは例外throwとする

- 日付: 2026-07-12
- 状態: 採用(実装済みの判断の事後記録)

## 背景

runtimeで起こるエラーには性質の異なる2種類がある。

- (a) **外部入力が不正**: `story-bundle.json`やlocalStorage上のセーブデータが壊れている・非対応バージョンである。実行時に普通に起こりうる
- (b) **進行中の不変条件違反**: バリデーション通過後のadvance/choose中にscene/stepが見つからない等。起きたらバグ

両者を同じ方式で扱うと、(a)でクラッシュするか、(b)のバグが握りつぶされるかのどちらかになるため、方針を分ける必要があった。

## 選択肢

1. **すべて例外throw** — 不正なJSONひとつで画面がクラッシュする
2. **すべてResult型で返す** — 進行APIの全呼び出し側にバグ由来エラーの分岐が広がり、握りつぶしが起こりやすい
3. **境界は非throw、内部はthrowの2段構え**(採用)

## 採用案

- **境界(外部入力の検証)は非throw**: `validateStoryBundle()`(`src/lib/story/engine.ts`)と`restoreSaveData()`(`src/lib/story/save.ts`)は例外を投げず、`ValidationError`(`{code, message}`)を返す。呼び出し側はエラー表示に落とす
- **内部(進行API)はthrow**: `advance`/`choose`/`getCurrentView`/`resolveToRenderableStep`は不変条件違反で`Error`をthrowする(バリデーション済みバンドルでは起きない前提)。`resolveToRenderableStep()`は`visitedStepIds`でjump/set_variableの自動遷移ループを検出してthrowする
- **ユーザー向け表示は固定文言のみ**: `src/App.svelte`の`UNSUPPORTED_STORY_MESSAGE`。`ValidationError`の詳細はconsoleにのみ出す(プレイヤーには対処不能な情報のため)

新しいAPIを追加する際の判断基準: **外部入力(JSON・localStorage・URL等)を直接受けるなら非throwでValidationErrorを返す。バリデーション済みデータしか受けないならthrowでよい。**

## 採用理由

- 実行時に起こりうるエラー(a)ではクラッシュせず、エラー画面に安全に落とせる
- バグ由来のエラー(b)は握りつぶされず、テスト・開発中に即座に露見する
- `ValidationErrorCode`(`src/lib/story/types.ts`)がエラー種別の安定した語彙になり、テストとログで原因を特定できる(Observable by Default)

## 欠点・リスク

- 進行中のthrowに対するErrorBoundary相当は現状なく、発生するとユーザーには白画面・無反応に見える
- 新規コードでどちらの流儀かの判断を誤ると、境界エラーがクラッシュに化ける(上記の判断基準で緩和)

## 再評価条件

- 実プレイで進行中のthrowが観測された場合(=起動時バリデーションの漏れ)、該当の検証を境界側(`validateStoryBundle`)へ移す
- エラー画面より丁寧な劣化(直前のセーブへ戻す等)が必要になった場合

## 影響範囲

- `src/lib/story/engine.ts`、`src/lib/story/save.ts`、`src/App.svelte`
- 今後バリデーション・進行APIを追加する際の設計指針
- 関連ADR: 0003(セーブ復元の拒否もValidationErrorで表現)
