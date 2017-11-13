/* 计算滚动条高度 */
function setScrollHeight(ele) {
	// 1. 获取 内容高度 和 容器高度
	var contentH = 0;
	var wrapH = 0;
	if($(window).width() <= 860){
		contentH = $(ele).parent().parent().parent().innerHeight();
		wrapH = $(window).height() - 80;
	}else {
		contentH = $(ele).innerHeight();
		wrapH = $(ele).parent().innerHeight(); 
	} 
	// 2. 计算滚动条高度，计算公式：滚动条高度 = 容器高度 / 内容高度 * 内容高度
	var scrollH = wrapH / contentH * wrapH; 
	console.log($(window).width(),contentH,wrapH);
	return scrollH;
}
/* 鼠标滚轮事件 - 滚轮滚动时滚动条和内容跟随滚动 */
