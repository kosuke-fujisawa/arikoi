## UIで使う色の定数定義。
##
## Ren'Py標準の gui.init() は事前生成された画像（gui/*.png）を前提とするが、
## 実素材（issue #3）が揃うまではSolid色のみで構成するため使用しない。
## ここでは screens.rpy から参照する最小限の色定数のみを定義する。

## screen/transform内のプロパティ指定ミス（競合するプロパティの同時指定）を検査する。
define config.check_conflicting_properties = True

define gui.text_color = "#ffffff"
define gui.accent_color = "#ffcc66"
define gui.window_background_color = "#000000cc"
define gui.hover_background_color = "#ffffff33"
