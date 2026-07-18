# 登場キャラクター(現行英語版)

旧 `games/familiar-shape-of-love/characters.yaml` の内容を移設したもの(ティラノ移行に伴い、
キャラクター定義はシナリオ `.ks` とこの文書で管理する)。
転換前の8ヒロイン構想は [overview.md](overview.md) を参照(参考資料)。

## protagonist — You(あなた)

- 名前表示: `You`(`#You`)
- テーマ色: `#333333`
- The player's point of view. Unnamed by design, so the reader's own quiet distance from
  Kaede stays theirs.
- プレイヤー視点のキャラクター。意図的に名前を持たせず、楓との距離をプレイヤー自身の
  ものとして感じられるようにする。

## kaede — Kaede(楓)

- 名前表示: `Kaede`(`#Kaede`)
- アーキタイプ: The Gentle Childhood Friend(優しい幼馴染)
- テーマ色: `#c97b8f`
- Lives next door and has known the protagonist since before either of them can remember.
  Wakes him up when he oversleeps, splits her lunch with him without asking, worries out loud
  about things that technically aren't her business. The most natural, unguarded relationship
  he has — which is exactly why neither of them has ever called it anything more.
- 隣の家に住み、物心つく前から主人公を知っている幼馴染。寝坊すれば起こしにきて、
  頼んでもいないのに弁当を分けてくれて、放っておけばいいことにまで口を出す。
  主人公にとって最も自然体でいられる相手——だからこそ、二人はそれにまだ名前を
  つけたことがない。

## 実装メモ

- 立ち絵素材はまだ無いため、シナリオでは `[chara_new]` を使わず `#名前` の表示のみ。
  素材導入(#19)の際に `first.ks` へ以下を追加し、テーマ色もあわせて反映する:
  `[chara_new name="kaede" jname="Kaede" color="#c97b8f" storage="chara/kaede/normal.png"]`
