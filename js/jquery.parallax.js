/**
 *	jQuery parallax.
 *	jQuery required.
 *	jQuery Easing Plugin extends this Plugin.
 *	
 *	* Copyright 2013 (c) kamem
 *	* http://develo.org/
 *	* Licensed Under the MIT.
 *	
 *	Date: 2014.01.25
 *
 *	* direction : y or x スクロールの方向を指定
 *
 *	* type : 'scrollFit' parallaxのタイプの設定
 *		* scrollFit - startのendの位置までの距離をfromStyleからtoStyleまでのstyleでeasingにそって実行する。
 *		* scrollSpeed - styleをスクロール量 / speedででコンテンツを動かす。
 *		* timing - 指定した位置を通過したときに関数を実行する。
 *
 *	* scrollSpeed
 *		* style :  どのCSSに対して処理を行うか
 *		* fixPosition :  スクロール位置がどの位置にフィックスした時に画像の位置を意図した位置に持ってきたいか
 *		* speed  : スクロール量に合わせてどのぐらいの量で動かしたいか(Y / speed)
 *		* minValue : 最低の値はどのぐらいか
 *		* maxValue : 最高の値はどのぐらいか
 *		* adjustment : 背景などの位置をフィックスさせたい位置は0からどれぐらいずれているか
 *
 *	* timing
 *		* contentStartLinePercent : コンテンツが動き始めるラインを、windowの高さの割合で指定（起点は上から）真ん中の場合は50
 *		* startAnimation : ''  contentStartLineを上から下に向かって通過した時に実行する関数（アニメーション）
 *		* endAnimation : '' contentStartLineを下から上に向かって通過した時に実行する関数（アニメーション）
 *		* fixPosition : contentStartLineのラインがこの位置に来た時点で関数を実行、もし指定がない場合はparallaxにしていしたoffsetの情報がラインになる
 *
 * @class parallax
 *
 */

(function($,global){

$.fn.parallax = function(options) {
	var $content = this,

		c = $.extend({
			parallax : {},
			
			direction : 'y',

			//parallax Type
			type : 'scrollFit',

			// scrollSpeedの設定
			style : 'top',
			fixPosition : 0,
			speed : 1,
			minValue : -999999999999,
			maxValue : 999999999999,
			adjustment : 0,
			
			// timingの設定
			contentStartLinePercent : 50,
			startAnimation : '',
			endAnimation : ''
		},options),

		parallaxObj = c.parallax,
		
		direction = c.direction,
		directionStr = direction === 'y' ? 'top' : 'left',
		
		type = c.type,
		
		style = c.style,
		speed = c.speed,
		minValue = c.minValue,
		maxValue = c.maxValue,
		fixPosition = c.fixPosition,
		adjustment = c.adjustment,
		contentStartLinePercent = c.contentStartLinePercent,
		startAnimation = c.startAnimation,
		endAnimation = c.endAnimation,
		
		line = false,
		
		// イージング
		easing = {
			linear : function(t,b,c,d){return b+c*t},
			easeInQuad:function(i,b,c,d){return c*(i/=d)*i+b;},
			easeOutQuad:function(i,b,c,d){return -c*(i/=d)*(i-2)+b;},
			easeInOutQuad:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i+b;}return -c/2*((--i)*(i-2)-1)+b;},
			easeInCubic:function(i,b,c,d){return c*(i/=d)*i*i+b;},
			easeOutCubic:function(i,b,c,d){return c*((i=i/d-1)*i*i+1)+b;},
			easeInOutCubic:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i+b;}return c/2*((i-=2)*i*i+2)+b;},
			easeInQuart:function(i,b,c,d){return c*(i/=d)*i*i*i+b;},
			easeOutQuart:function(i,b,c,d){return -c*((i=i/d-1)*i*i*i-1)+b;},
			easeInOutQuart:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i+b;}return -c/2*((i-=2)*i*i*i-2)+b;},
			easeInQuint:function(i,b,c,d){return c*(i/=d)*i*i*i*i+b;},
			easeOutQuint:function(i,b,c,d){return c*((i=i/d-1)*i*i*i*i+1)+b;},
			easeInOutQuint:function(i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i*i+b;}return c/2*((i-=2)*i*i*i*i+2)+b;},
			easeInSine:function(i,b,c,d){return -c*Math.cos(i/d*(Math.PI/2))+c+b;},
			easeOutSine:function(i,b,c,d){return c*Math.sin(i/d*(Math.PI/2))+b;},
			easeInOutSine:function(i,b,c,d){return -c/2*(Math.cos(Math.PI*i/d)-1)+b;},
			easeInExpo:function(i,b,c,d){return(i==0)?b:c*Math.pow(2,10*(i/d-1))+b;},
			easeOutExpo:function(i,b,c,d){return(i==d)?b+c:c*(-Math.pow(2,-10*i/d)+1)+b;},
			easeInOutExpo:function(i,b,c,d){if(i==0){return b;}if(i==d){return b+c;}if((i/=d/2)<1){return c/2*Math.pow(2,10*(i-1))+b;}return c/2*(-Math.pow(2,-10*--i)+2)+b;},
			easeInCirc:function(i,b,c,d){return -c*(Math.sqrt(1-(i/=d)*i)-1)+b;},
			easeOutCirc:function(i,b,c,d){return c*Math.sqrt(1-(i=i/d-1)*i)+b;},
			easeInOutCirc:function(i,b,c,d){if((i/=d/2)<1){return -c/2*(Math.sqrt(1-i*i)-1)+b;}return c/2*(Math.sqrt(1-(i-=2)*i)+1)+b;},
			easeInElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return -(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;},
			easeOutElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return n*Math.pow(2,-10*m)*Math.sin((m*b-d)*(2*Math.PI)/c)+a+p;},
			easeInOutElastic:function(m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b/2)==2){return p+a;}if(!c){c=b*(0.3*1.5);}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}if(m<1){return -0.5*(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;}return n*Math.pow(2,-10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c)*0.5+a+p;},
			easeInBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}return c*(k/=d)*k*((j+1)*k-j)+b;},
			easeOutBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}return c*((k=k/d-1)*k*((j+1)*k+j)+1)+b;},
			easeInOutBack:function(k,b,c,d,j){if(j==undefined){j=1.70158;}if((k/=d/2)<1){return c/2*(k*k*(((j*=(1.525))+1)*k-j))+b;}return c/2*((k-=2)*k*(((j*=(1.525))+1)*k+j)+2)+b;},
			easeInBounce:function(i,b,c,d){return c-easing.easeOutBounce(d-i,0,c,d)+b;},
			easeOutBounce:function(i,b,c,d){if((i/=d)<(1/2.75)){return c*(7.5625*i*i)+b;}else{if(i<(2/2.75)){return c*(7.5625*(i-=(1.5/2.75))*i+0.75)+b;}else{if(i<(2.5/2.75)){return c*(7.5625*(i-=(2.25/2.75))*i+0.9375)+b;}else{return c*(7.5625*(i-=(2.625/2.75))*i+0.984375)+b;}}}},
			easeInOutBounce:function(i,b,c,d){if(i<d/2){return easing.easeInBounce(i*2,0,c,d)*0.5+b;}return easing.easeOutBounce(i*2-d,0,c,d)*0.5+c*0.5+b;}
		};

	/**
	 *	値の取得
	 * 
	 *	* scrollY : スクロール量
	 *	* windowWidth : ウィンドウの横幅
	 *	* windowHeight : ウィンドウの縦幅
	 *	* contentStartLine : ウィンドウのセンターライン
	 *	
	 *	@method info
	 *	@return {Object}
	 */
	function info() {
		var dstr = directionStr.charAt(0).toUpperCase() + directionStr.substring(1),
			scrollNum = $content['scroll' + dstr](),
			windowWidth = (!(window.innerWidth)) ? document.documentElement.clientWidth : window.innerWidth,
			windowHeight = (!(window.innerHeight)) ?  document.documentElement.clientHeight : window.innerHeight;

		return {
			scrollNum: scrollNum,
			windowWidth: windowWidth,
			windowHeight: windowHeight,
			contentStartLine:  scrollNum + ((direction === 'y' ? windowHeight : windowWidth) / (100 / contentStartLinePercent))
		};
	};
	
	/**
	 *	motionの中の配列のend（モーションの終わり）の値が一番高いものを返す
	 *	@method numMax
	 *	@param {Array} モーションの配列
	 *	@return {Number} 配列の中で一番、多い数字
	 */
	function numMax(ary) {
		var numArray = [];
		for(var i = 0; i < ary.length ;i++) {
			numArray[i] = ary[i].end;
		};
		return Math.max.apply(null, numArray)
	};
	
	/**
	 *	スクロール幅によって選択されたモーション名を返します。
	 *
	 *	@method motionSelect
	 *	@return {String} モーション名
	 */
	function motionSelect() {
		var scrollNum = info().scrollNum,
			endArray = [],

		i = 0;
		for(motion in parallaxObj[obj].tagMotions) {
			endArray[i] = numMax(parallaxObj[obj].tagMotions[motion]);
			i++;
		};

		for(var i = 0; i <  endArray.length ;i++) {
			select = scrollNum < endArray[i] ? parallaxObj[obj].tagMotions['motion' + (i + 1)] : parallaxObj[obj].tagMotions['motion' + (endArray.length)];
			
			if(scrollNum < endArray[i]) {
				break;
			};
		};
		
		return select;
	};

	/*------------------------------------------------------------------------------------------
		パララックス効果のメイン処理
	------------------------------------------------------------------------------------------*/
	var parallax = {
		/**
		 *	スクロール位置、距離を指定してその位置を移動する
		 *	
		 *	@method parallax.scrollFit
		 */
		scrollFit : function() {
			var scrollNum = info().scrollNum;
	
			// パララックス するコンテンツ分 実行
			for(obj in parallaxObj){
	
				// モーションの選択
				var motions = motionSelect();
	
				// モーションしたいCSS指定分 実行
				for(var i = 0; i < motions.length ;i++) {
					var start = motions[i].start,
						end = motions[i].end,
						startEndY = end - start,
						ease = motions[i].easing,
	
						// スタート位置からエンド位置までのスクロール距離の割合
						scrollPercent = (start <  scrollNum && scrollNum < end) ? (scrollNum - start) / startEndY :
						(start <  scrollNum) ? 1 :
						(scrollNum < end) ? 0 : '';
			
					for(style in motions[i].fromStyle){
					
						var fromStyle = motions[i].fromStyle,
							toStyle = motions[i].toStyle,
							ease = motions[i].easing,

							abs = Math.abs(fromStyle[style] - toStyle[style]);
						
						// 値が数値の場合
						if(!(isNaN(fromStyle[style]))) {
							var fixAbs = fromStyle[style] < toStyle[style] ? abs : -abs;
							parallaxObj[obj].obj.css(
								style,
								easing[ease](scrollPercent, fromStyle[style], fixAbs, 1)
							);
						}

						//数字じゃない場合
						//background-positionなど
						else {
							// fromとtoで連想配列に値を入れる
							var value = {
									from : fromStyle[style].split(' '),
									to : toStyle[style].split(' ')
								};

							// 連想配列に入った二つの値を検査、例）background-position: center 100px;
							// 数値以外（centerとかtop）を判断してpxを外し数値に変換
							for(ft in value){
								for(var i = 0;i < value[ft].length; i++) {
									var ftValue = value[ft][i].replace(/px/, '');
									ftValue = isNaN(ftValue) ? ftValue : Number(ftValue);
									
									value[ft][i] = ftValue;
								};
							};

							// 二つの値のそれぞれのfrom toの移動距離を配列に
							var abs =  [
									Math.abs(value.from[0] - value.to[0]),
									Math.abs(value.from[1] - value.to[1])
								];
							
							// スクロール位置によってのvalueを指定
							var fixValue = [];
							for(var i = 0;i < value.from.length; i++) {
								var fixAbs = value.from[i] < value.to[i] ? abs[i] : -abs[i];
								fixValue[i] = isNaN(value.from[i]) ? value.from[i] : easing[ease](scrollPercent, value.from[i], fixAbs, 1) + 'px';
							};
								
							parallaxObj[obj].obj.css(
								style,
								fixValue.join(' ')
							);
						}
					}
				}			
			}
		},
		
		/**
		 *	（scrollNum）スクロール量 / speed
		 *	
		 *	スクロール方向と反対に動かしたい場合はspeedをマイナスにします。
		 *
		 *	[使えるcss]
		 *	
		 *	* top
		 *	* left
		 *	* background-position - background-position : {Number} {Number}
		 *	* background-positionTop - background-position : 'center' {Number}
		 *	* background-positionLeft - background-position : {Number} 'center'
		 *
		 *	@method parallax.scrollSpeed
		 */
		scrollSpeed : function() {
			var value = -parseInt(-info().scrollNum / speed + fixPosition / speed) + adjustment,
			value = minValue > value ? minValue : maxValue < value ? maxValue : value;
			
			var value = (style == 'background-position') ?  value + 'px ' + value + 'px' : 
				(style == 'background-positionTop') ? 'center ' + value + 'px' :
				(style == 'background-positionLeft') ?  value + 'px' + ' center' : 
				 value + 'px';

			parallaxObj.css(
				style.indexOf('background-position') > -1 ? 'background-position' : style,
				value
			);
		},
		
		/**
		 *	contentStartLineをきっかけにして上から下に通過したか
		 *
		 * または下から上に追加したかでそれぞれの関数を実行してくれます。
		 *
		 *	* startAnimation(通過のターゲットとなったコンテンツ,そのラインを超えてるか超えてないかのフラグ);
		 *	* endAnimation(通過のターゲットとなったコンテンツ,そのラインを超えてるか超えてないかのフラグ);
		 *
		 *	@method parallax.timing
		 */
		timing : function() {
			var fixLine = fixPosition > 0 ? fixPosition : parallaxObj.offset()[directionStr];
			if(info().contentStartLine >= fixLine) {
				if(!(line)) {
					parallaxObj.queue([]).stop();
					line = true;
					if(startAnimation !== '') {
						startAnimation({target:parallaxObj,isLine:line});
					}
				}
			} else {
				if(line) {
					parallaxObj.queue([]).stop();
					line = false;

					if(endAnimation !== '') {
						endAnimation({target:parallaxObj,isLine:line});
					}
				}
			}
		}
	};

	/*---*/
	info();
	parallax[type]();

	$(window).bind("resize",function(){
		info();
		parallax[type]();
	});

	$content.scroll(function(){
		info();
		parallax[type]();
	});
}
}(jQuery, this));
