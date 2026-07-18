;プロローグ — 下校路での主人公と楓の会話
;立ち絵素材はまだ無いため [chara_new] は使わない。素材導入(#19)の際に
;first.ks へ [chara_new name="kaede" jname="Kaede" storage=...] を追加すること
;注意: タグ属性値内の半角スペースはパーサに除去されるため &nbsp; で表現する

*prologue

[start_keyconfig]
@showmenubutton
[bg storage="placeholder.png" time=1000]
;BGMは実素材の導入(#19)まで鳴らさない(旧placeholder.oggは0バイトのダミーで再生不能)

;メッセージウィンドウの設定
[position layer="message0" left=160 top=500 width=1000 height=200 page=fore visible=true]
[position layer="message0" page=fore margint="45" marginl="50" marginr="70" marginb="60"]
@layopt layer="message0" visible=true

;キャラクター名の表示領域(これがないと#の名前行でエラーになる)
[ptext name="chara_name_area" layer="message0" color="white" size=28 bold=true x=180 y=510]
[chara_config ptext="chara_name_area"]

#
The walk home from school is the same one you've taken since you were kids — past the vending machines, over the river bridge, the long way around the shrine because Kaede insists it's luckier.[p]

#Kaede
You overslept again this morning, didn't you.[p]

#You
How did you even know that.[p]

#Kaede
Your hair. It still hasn't decided what it's doing.[p]

#
She reaches over and fixes it without asking, the way she's done a hundred times before, like it's simply hers to fix.[p]

#Kaede
I keep meaning to ask you something.[p]

;選択肢
[glink text="Ask&nbsp;her&nbsp;what&nbsp;it&nbsp;is" target="*ask" x=390 y=280 width=500 size=22 color="black"]
[glink text="Let&nbsp;the&nbsp;silence&nbsp;hold" target="*wait" x=390 y=360 width=500 size=22 color="black"]
[s]

*ask

#You
What is it?[p]

#Kaede
...Never mind. Some other day, maybe.[p]

#
She says it lightly, like it costs her nothing. You've known her long enough to know when she's lying, and long enough to know better than to push.[p]

[jump target="*closing"]

*wait

#
You don't ask. She doesn't finish the thought. You just keep walking, in a silence that says almost everything except the one thing it's actually about.[p]

#Kaede
...Thanks. For not asking.[p]

[jump target="*closing"]

*closing

#
You reach your street the way you always do, side by side, the distance between you exactly what it's always been — and exactly not.[p]

;エンディング: ending_quiet_distance
*ending

[cm]
@layopt layer="message0" visible=false
[hidemenubutton]
[bg storage="black.png" time=2000]
[wait time=2000]
@layopt layer="message0" visible=true

#
A Quiet Distance[r]
— The End —[p]

[cm]
@layopt layer="message0" visible=false
@jump storage="title.ks"
[s]
