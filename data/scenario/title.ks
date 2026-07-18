;タイトル画面
;専用のタイトル絵ができるまでは単色のplaceholder背景 + テキストボタンで構成する(#19)
;注意: タグ属性値内の半角スペースはパーサに除去されるため &nbsp; で表現する

[cm]
@clearstack
[hidemenubutton]
@layopt layer="message" visible=false
@bg storage="placeholder.png" time=100
@wait time=200

*start

[cm]
[freeimage layer="1"]
[layopt layer="1" visible=true]
[ptext name="title_text" layer="1" page="fore" text="A&nbsp;Familiar&nbsp;Shape&nbsp;of&nbsp;Love" size=52 x=0 y=200 width=1280 align="center" color="0xffffff"]

[glink text="Start" target="*gamestart" x=490 y=400 width=300 size=24 color="black"]
[glink text="Continue" target="*continue" x=490 y=480 width=300 size=24 color="black"]

[s]

*continue
;ティラノ標準のロード画面を開く(role="load"のシステムボタンと同じ内部APIを呼ぶ)
[eval exp="TYRANO.kag.menu.displayLoad()"]
@jump target="*start"

*gamestart
[freeimage layer="1"]
@layopt layer="1" visible=false
;一番最初のシナリオファイルへジャンプする
@jump storage="prologue.ks"
