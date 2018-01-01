$(function(){
	var canvas = $("#canvas-my").get(0);
	var ctx = canvas.getContext("2d");
	var ncanvas = $("#canvas-new").get(0);
	var nctx = ncanvas.getContext("2d");

	var dot = {}; // 记录绘制的点坐标
	var linedots = []; // 初始化线条的点坐标集合
	var alllines = []; // 初始化绘制的线条的集合

	// 获取不同设备下canvas画布的偏移，兼容画布在不同设备下所处的位置
	var canvasLeft = parseInt(canvas.offsetLeft);
	var canvasTop = parseInt(canvas.offsetTop);

	// 设置画笔的相关属性
	ctx.lineWidth = 5;
	ctx.lineJoin = "round"; // 两条线交汇时的边角类型
	ctx.lineCap = "round"; // 笔帽

	nctx.lineWidth = 5;
	nctx.lineJoin = "round"; // 两条线交汇时的边角类型
	nctx.lineCap = "round"; // 笔帽

	$("#canvas-my").on("touchstart",function(e){
		e.preventDefault(); // 阻止触摸时浏览器的缩放、滚动条滚动等默认事件
		
		try{
			linedots = [];
			var touches = e.touches;
			if(touches.length == 1){
				// 笔绘的初始坐标
				var startX = parseInt(touches[0].pageX - canvasLeft);
				var startY = parseInt(touches[0].pageY - canvasTop);

				dot.x = startX;
				dot.y =  startY;
				linedots.push([startX,startY]);
			}else{
				alert("对不起，绘画文字只允许一个触点！");
			}
		}catch(e){
			alert("对不起，您的浏览器不支持触屏事件！");
		}
	})

	$("#canvas-my").on("touchmove",function(e){
		e.preventDefault(); // 阻止触摸时浏览器的缩放、滚动条滚动等默认事件

		try{
			var touches = e.touches;
			ctx.moveTo(dot.x,dot.y);
			if(touches.length == 1){
				// 移动的点坐标
				var moveX = parseInt(touches[0].pageX - canvasLeft);
				var moveY = parseInt(touches[0].pageY - canvasTop);

				// 开始绘画
				// ctx.beginPath();
				
				ctx.lineTo(moveX,moveY);
				ctx.stroke();
				// ctx.closePath();

				dot.x = moveX;
				dot.y =  moveY;
				linedots.push([moveX,moveY]);
			}else{
				alert("对不起，绘画文字只允许一个触点！");
			}
		}catch(e){
			alert("对不起，您的浏览器不支持触屏事件！");
		}
	})

	$("#canvas-my").on("touchend", function(e){
		e.preventDefault(); // 阻止触摸时浏览器的缩放、滚动条滚动等默认事件

		alllines.push(linedots);
		console.log("alllines",alllines);
		try{

		}catch(e){
			alert("对不起，您的浏览器不支持触屏事件！");
		}
	})
})