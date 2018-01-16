$.fn.myplugin = function(){
	// 在这里面，this指向的是通过jQuery选择器选中的元素
	this.css("color","red");
	this.each(function(){
		// 在each方法内部，this指代的是普通的DOM元素，因此如果要用jQuery的方法就需要用$重新包装一下
		$(this).append(''+$(this).attr("href"));
	})
};