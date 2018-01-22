/**
 * fullPage 1.0.0
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * write by 2018.01.23
 */

;(function($,window,document,undefined){ 
	$.fn.fullPage = function(opt){
		this.defaults = {
			scrollDownTarget: null,
			scrollUpTarget: null
		}
		this.options = $.extend({},this.defaults,opt);
	};
	// $.fn.fullPage.scrollDown = function(){}; // 二者区别
	$.fn.fullPage.prototype = {
		scrollDown: function(){
			
		}
	};
	console.log($.fn.fullPage.scrollDown,$.fn.fullPage.prototype.scrollDown); // 二者区别 - 原型链
})(jQuery,window,document);