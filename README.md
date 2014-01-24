jquery.parallax
==================

parallaxを実装するためのjQuery Plugin


仕様
------
3つのタイプでparallaxサイトを実装できる

1. startのendの位置までの距離をfromStyleからtoStyleまでのstyleでeasingにそって実行する。
2. styleをスクロール量 / speedででコンテンツを動かす。
3. 指定した位置を通過したときに関数を実行する。

使い方
------
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.parallax.js"></script>

オプション
------

 * parallax : {} - /typeによってそれに合わせた内容を指定

 *	direction : y or x スクロールの方向を指定
 
 * type : 'type1' parallaxのタイプの設定
	* type1 - startのendの位置までの距離をfromStyleからtoStyleまでのstyleでeasingにそって実行する。
	* type2 - styleをスクロール量 / speedででコンテンツを動かす。
	* type3 - 指定した位置を通過したときに関数を実行する。
 
 * type2
	* style :  どのCSSに対して処理を行うか
	* fixPosition :  スクロール位置がどの位置にフィックスした時に画像の位置を意図した位置に持ってきたいか
	* speed  : スクロール量に合わせてどのぐらいの量で動かしたいか(Y / speed)
	* minValue : 最低の値はどのぐらいか
	* maxValue : 最高の値はどのぐらいか
	* adjustment : 背景などの位置をフィックスさせたい位置は0からどれぐらいずれているか

 * type3
	* contentStartLinePercent : コンテンツが動き始めるラインを、windowの高さの割合で指定（起点は上から）真ん中の場合は50
	* startAnimation : ''  contentStartLineを上から下に向かって通過した時に実行する関数（アニメーション）
	* endAnimation : '' contentStartLineを下から上に向かって通過した時に実行する関数（アニメーション）
	* fixPosition : contentStartLineのラインがこの位置に来た時点で関数を実行、もし指定がない場合はparallaxにしていしたoffsetの情報がラインになる

### 初期設定 ###

	parallax : {},
			
	direction : 'y',

	// parallax Type
	type : 'type1',

	//type2
	style : 'top',
	fixPosition : 0,
	speed : 1,
	minValue : -999999999999,
	maxValue : 999999999999,
	adjustment : 0,
	
	// type3
	contentStartLinePercent : 50,
	startAnimation : '',
	endAnimation : ''


typeに合わせたparallaxの指定
------

### type1 ###
下記のような連想配列を渡す

	例）
	parallaxObj = {
		name : {
			obj : $('#header'), // 動かすオブジェクト
			tagMotions : {
				motion1 : [{
					start : 1000 // 動きのスタートのスクロール位置,
					end : 1500 // 動きの終わりスクロール位置,
					fromStyle : {
						left : {Number}
					},
					toStyle : {
						left : {Number}
					},
					easing : 'easeInOutElastic' // イージングの指定
				},
				{
					start : 1300 //動きのスタートのスクロール位置,
					end : 1500 //動きの終わりスクロール位置,
					fromStyle : {
						opacity : 1
					},
					toStyle : {
						opacity : 0.5
					},
					easing : 'liner' // イージングの指定
				}],
				motion2 : [{
					//モーションいくつでも指定可能
					//（ただしmotion1で指定している一番大きいendより、motion2のstartは大きくなるようにしてください。）
					....
				}]
			};
		};
	};


	$(window).parallax({
		parallax : parallaxObj
	});

### type2 ###
動かしたいコンテンツを直接指定

	例）
	$(window).parallax({
		parallax : $('#type2'),
		type : 'type2',
		style : 'background-positionTop',
		fixPosition : $('#type2').offset().top,
		speed : -2,
		maxPosition : 0,
		adjustment : -200,
		contentStartLinePercent: 50
	});


### type3 ###
基準のポジション（$(hoge).offset().top）のタグ（$(hoge)）を指定
もしくはstartAnimation、endAnimationの引数targetに指定したいタグ

	例）
	$(window).parallax({
		parallax : $('#type3'),
		type : 'type3',
		fixPosition : $('#type3').offset().top, //もしもfixPositionがある場合はparallaxで指定したタグのoffset().topの値よりもfixPositionが優先されます。
		startAnimation: function(e){showAnimate(e);}, //eにはparallaxで指定したタグがe.targetで取れます。
		endAnimation: function(e){hideAnimate(e);},
		contentStartLinePercent: 30
	});



ライセンス
----------
+ Copyright 2013 &copy; kamem
+ [http://www.opensource.org/licenses/mit-license.php][mit]

[develo.org]: http://develo.org/ "develo.org"
[MIT]: http://www.opensource.org/licenses/mit-license.php