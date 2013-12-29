/*
 * jQuery smoothAnchor
 *
 * jQuery required.
 * jQuery Easing Plugin extends this Plugin.
 *
 * Copyright 2009 (c) kamem
 * http://develo.org/
 * Licensed Under the MIT.
 *
 * Date: 2010.09.4 
*/

//例 : $('h1').smoothAnchor({easing : 'quart',speed : 1000,target : #header,delay : 0,func : 'test'});
//アンカーがないときになにもtarget指定がなかった場合の飛び先
var target = '#header';

var pageWrapTag ='';

$(function() {
//（動き,スピード,ターゲット（#headerなど）)
$('a[href^="#"]').smoothAnchor({easing : 'easeOutQuart',speed : 1000});

//boxModelによって実装が違うみたいでたとえば、後方互換モードは body、Operaは html,body の両方指定にすると、不具合が出る
pageWrapTag = $.support.boxModel ? navigator.appName.match(/Opera/) ? "html" : "html,body" : "body";

/* #ついてる場合ページトップからスムーズに移動
※delayつけるとWebKit系でおかしくなるかも「?」は平気（普通に移動させたい場合は下のif消してください。）*/
if(location.hash.charAt(0) == "#") {
	$(pageWrapTag).animate({ scrollTop : 0,scrollLeft : 0 }, 0, 0);
	smoothAnchor({easing : 'easeOutQuart',speed : 1000, target : location.hash});
	
	//WebKit系で上へ飛ばなかったための処理
	if (navigator.userAgent.indexOf("WebKit") != -1){location.hash = ""}
}

/* #を?にしても移動できます。#できたときは通常通りにして欲しい場合に
（#は表示されません）*/
if(document.URL.charAt(document.URL.indexOf("#")) !== "#" && document.URL.charAt(document.URL.indexOf("?")) == "?") {
	var hatenaTarget = document.URL.slice(document.URL.indexOf("?") + 1);
	smoothAnchor({easing : 'easeOutQuart',speed : 1000, target : "#" + hatenaTarget,delay : 350});
}

/*画面クリック時アニメーションを止める
$(document).click(function(){
	$(pageWrapTag).queue([]).stop()
});*/

//アドレスに#1000,10など数値で指定している場合その位置に移動
if(parseInt(location.hash.slice(1)) || parseInt(location.hash.slice(1)) == 0) {
	var targetAddress = location.hash.split(",");
	var targetPositiontop = parseInt(targetAddress[1]);
	var targetPositionleft = parseInt(targetAddress[0].slice(1));

	$(pageWrapTag).animate({ scrollTop : targetPositiontop,scrollLeft : targetPositionleft }, 0, 0);
}

});

// スクロールストップ処理
function scrollStop() {$(pageWrapTag).queue([]).stop();}

// マウスでスクロールした時に実行
if (window.addEventListener) window.addEventListener('DOMMouseScroll', scrollStop, false);
window.onmousewheel = document.onmousewheel = scrollStop;

//jQuery Plugin
$.fn.smoothAnchor = function(options) {

	var c = $.extend({
		easing: '',
		speed: '',
		delay: '',
		func:'',
		target: target
	},options);

	tagClick($(this),c.easing,c.speed,c.target,c.delay,c.func);
}

//タグをクリックしたとき
function tagClick(tag,easing,speed,target,delay,func) {
	tag.click(function () {
		
		//タグにアンカーがない指定したアンカー（target）を入れる
		target = (this.hash) ? target = this.hash : target;

		var tag = this;
		smoothAnchor({tag: tag,easing: easing,speed: speed,target: target,delay:delay,func:func});
	return false;
	});
}

//処理
function smoothAnchor(options) {
	//初期設定
	var c = $.extend({
		tag: 'body',
		easing: 'easeOutQuart',
		speed: 1000,
		delay: 0,
		func: '',
		target: target
	},options);

	tag = c.tag
	easing = c.easing;
	speed = c.speed;
	delay = c.delay;
	func = c.func + "()";
	target = c.target;
	
	$(pageWrapTag).queue([]).stop();

	//数字ターゲットの場合 数字の位置に移動（例 : #1000,10）
	if(parseInt(target.slice(1)) || parseInt(target.slice(1)) == 0) {
		target = target.split(",");
		var targetPositiontop = parseInt(target[1]);
		var targetPositionleft = parseInt(target[0].slice(1));
	}
	//普通の場合
	else {
		var targetPosition = $(target).offset();
		var targetPositiontop  = targetPosition.top;
		var targetPositionleft = targetPosition.left;
	}

	//ウィンドウ幅により、目的のところまで行かないとき
	if(targetPositiontop > $(document).height() - $(window).height()) {
		if(!($(document).height() - $(window).height() <= 0)) {
			targetPositiontop = $(document).height() - $(window).height();
		}
	}
	if(targetPositionleft > $(document).width() - $(window).width()) {
		if(!($(document).width() - $(window).width() <= 0)) {
			targetPositionleft = $(document).width() - $(window).width();
		}
	}

	//?が付いてたらhashつけない
	if(document.URL.charAt(document.URL.indexOf("?")) !== "?") {
	$(pageWrapTag).delay(delay).animate({ scrollTop : targetPositiontop,scrollLeft : targetPositionleft }, speed, easing,function(){location.hash = target;$(pageWrapTag).queue([]).stop();if(!(func == "()")){eval(func);};});
	}
	else {
	$(pageWrapTag).delay(delay).animate({ scrollTop : targetPositiontop,scrollLeft : targetPositionleft }, speed, easing,function(){$(pageWrapTag).queue([]).stop();if(!(func == "()")){eval(func);};});
	}

	//アンカー位置から、少しずらしたいときは↓を使ってください。アドレスバーはかわりません。
	//$(pageWrapTag).delay(delay).animate({ scrollTop : targetPositiontop - 100,scrollLeft : targetPositionleft }, speed, easing,function(){$(pageWrapTag).queue([]).stop();if(!(func == "()")){eval(func);};});
}


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright %copy; 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/


jQuery.easing.jswing=jQuery.easing.swing;
jQuery.easing.jswing=jQuery.easing.swing;
jQuery.extend(jQuery.easing,{
	def:"easeOutQuad",
	swing:function(j,i,b,c,d){return jQuery.easing[jQuery.easing.def](j,i,b,c,d);},easeInQuad:function(j,i,b,c,d){return c*(i/=d)*i+b;},easeOutQuad:function(j,i,b,c,d){return -c*(i/=d)*(i-2)+b;},
	easeInOutQuad:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i+b;}return -c/2*((--i)*(i-2)-1)+b;},easeInCubic:function(j,i,b,c,d){return c*(i/=d)*i*i+b;},easeOutCubic:function(j,i,b,c,d){return c*((i=i/d-1)*i*i+1)+b;},easeInOutCubic:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i+b;}return c/2*((i-=2)*i*i+2)+b;},
	easeInQuart:function(j,i,b,c,d){return c*(i/=d)*i*i*i+b;},
	easeOutQuart:function(j,i,b,c,d){return -c*((i=i/d-1)*i*i*i-1)+b;},
	easeInOutQuart:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i+b;}return -c/2*((i-=2)*i*i*i-2)+b;},
	easeInQuint:function(j,i,b,c,d){return c*(i/=d)*i*i*i*i+b;},
	easeOutQuint:function(j,i,b,c,d){return c*((i=i/d-1)*i*i*i*i+1)+b;},
	easeInOutQuint:function(j,i,b,c,d){if((i/=d/2)<1){return c/2*i*i*i*i*i+b;}return c/2*((i-=2)*i*i*i*i+2)+b;},
	easeInSine:function(j,i,b,c,d){return -c*Math.cos(i/d*(Math.PI/2))+c+b;},
	easeOutSine:function(j,i,b,c,d){return c*Math.sin(i/d*(Math.PI/2))+b;},
	easeInOutSine:function(j,i,b,c,d){return -c/2*(Math.cos(Math.PI*i/d)-1)+b;},
	easeInExpo:function(j,i,b,c,d){return(i==0)?b:c*Math.pow(2,10*(i/d-1))+b;},
	easeOutExpo:function(j,i,b,c,d){return(i==d)?b+c:c*(-Math.pow(2,-10*i/d)+1)+b;},
	easeInOutExpo:function(j,i,b,c,d){if(i==0){return b;}if(i==d){return b+c;}if((i/=d/2)<1){return c/2*Math.pow(2,10*(i-1))+b;}return c/2*(-Math.pow(2,-10*--i)+2)+b;},easeInCirc:function(j,i,b,c,d){return -c*(Math.sqrt(1-(i/=d)*i)-1)+b;},
	easeOutCirc:function(j,i,b,c,d){return c*Math.sqrt(1-(i=i/d-1)*i)+b;},
	easeInOutCirc:function(j,i,b,c,d){if((i/=d/2)<1){return -c/2*(Math.sqrt(1-i*i)-1)+b;}return c/2*(Math.sqrt(1-(i-=2)*i)+1)+b;},
	easeInElastic:function(o,m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return -(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;},
	easeOutElastic:function(o,m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b)==1){return p+a;}if(!c){c=b*0.3;}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}return n*Math.pow(2,-10*m)*Math.sin((m*b-d)*(2*Math.PI)/c)+a+p;},
	easeInOutElastic:function(o,m,p,a,b){var d=1.70158;var c=0;var n=a;if(m==0){return p;}if((m/=b/2)==2){return p+a;}if(!c){c=b*(0.3*1.5);}if(n<Math.abs(a)){n=a;var d=c/4;}else{var d=c/(2*Math.PI)*Math.asin(a/n);}if(m<1){return -0.5*(n*Math.pow(2,10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c))+p;}return n*Math.pow(2,-10*(m-=1))*Math.sin((m*b-d)*(2*Math.PI)/c)*0.5+a+p;},
	easeInBack:function(l,k,b,c,d,j){if(j==undefined){j=1.70158;}return c*(k/=d)*k*((j+1)*k-j)+b;},
	easeOutBack:function(l,k,b,c,d,j){if(j==undefined){j=1.70158;}return c*((k=k/d-1)*k*((j+1)*k+j)+1)+b;},
	easeInOutBack:function(l,k,b,c,d,j){if(j==undefined){j=1.70158;}if((k/=d/2)<1){return c/2*(k*k*(((j*=(1.525))+1)*k-j))+b;}return c/2*((k-=2)*k*(((j*=(1.525))+1)*k+j)+2)+b;},easeInBounce:function(j,i,b,c,d){return c-jQuery.easing.easeOutBounce(j,d-i,0,c,d)+b;},
	easeOutBounce:function(j,i,b,c,d){if((i/=d)<(1/2.75)){return c*(7.5625*i*i)+b;}else{if(i<(2/2.75)){return c*(7.5625*(i-=(1.5/2.75))*i+0.75)+b;}else{if(i<(2.5/2.75)){return c*(7.5625*(i-=(2.25/2.75))*i+0.9375)+b;}else{return c*(7.5625*(i-=(2.625/2.75))*i+0.984375)+b;}}}},
	easeInOutBounce:function(j,i,b,c,d){if(i<d/2){return jQuery.easing.easeInBounce(j,i*2,0,c,d)*0.5+b;}return jQuery.easing.easeOutBounce(j,i*2-d,0,c,d)*0.5+c*0.5+b;}
});


