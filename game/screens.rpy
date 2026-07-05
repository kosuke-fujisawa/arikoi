## 平成ギャルゲー風UI（docs/production/direction.md 準拠）の最小構成。
##
## - メッセージウィンドウ: 画面下部に固定表示
## - 選択肢: 画面中央に縦並びで表示
##
## 画像素材は issue #3 で選定予定のため、現時点では Solid 色のみで構成する。
## 素材が揃い次第、background を画像に差し替える。色定数は gui.rpy を参照。

screen say(who, what):
    window:
        id "window"
        xfill True
        yalign 1.0
        ysize 220
        background Solid(gui.window_background_color)
        padding (40, 20)

        if who is not None:
            ## 色はここで固定せず、Character(color=...) の指定を優先させる。
            text who id "who" size 26 xpos 0 ypos 0

        text what id "what" size 24 color gui.text_color xpos 0 ypos 44 xsize 1200


screen choice(items):
    style_prefix "choice"

    vbox:
        xalign 0.5
        yalign 0.5
        spacing 12

        for i in items:
            textbutton i.caption action i.action

style choice_vbox is vbox
style choice_button is button:
    xsize 600
    background Solid(gui.window_background_color)
    hover_background Solid(gui.hover_background_color)
    xalign 0.5
style choice_button_text is button_text:
    color gui.text_color
    hover_color gui.accent_color
    size 24
    xalign 0.5
