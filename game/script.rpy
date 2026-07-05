## 一時的なプレースホルダー。
##
## tsumugai compile --target renpy（kosuke-fujisawa/tsumugai#79、未実装）が
## game/generated/ に本編のシナリオを生成するまでの間、label start が
## どこにも存在しないとRen'Pyが起動・lintできないため、ここに最小限のダミー
## シーンを置く。compile が実装され game/generated/ に本編が生成されたら、
## このファイルは削除し、生成されたラベルへ差し替えること。

label start:
    "（tsumugai compile の実装待ち。本編は game/generated/ に生成される予定）"
    return
