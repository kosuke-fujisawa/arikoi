## scenarios/characters.yaml と対応するRen'Pyキャラクター定義。
##
## tsumugai compile --target renpy が生成するダイアログは話者名でこの変数を
## 参照する想定のため、識別子は characters.yaml のキー（日本語）と一致させている。
## characters.yaml にキャラクターを追加・変更した場合は、このファイルにも反映すること。

define 幼なじみ = Character(_("幼なじみ"), color="#ff9999")
define 主人公 = Character(_("主人公"))
