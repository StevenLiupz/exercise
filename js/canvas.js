$(function(){
	var canvas = $("#canvas-my").get(0);
	var ctx = canvas.getContext("2d");
	var ncanvas = $("#canvas-new").get(0);
	var nctx = ncanvas.getContext("2d");

	var dot = {}; // 记录绘制的初始点坐标
	var alllines = []; // 初始化绘制的线条的集合
	var linesdata = ""; // 用于模拟后台接收到的数据
	var linesset = {}; // 用于存放绘画的参数信息

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
			linesset = {color: '', linedots: []};
			var touches = e.touches;
			if(touches.length == 1){
				// 笔绘的初始坐标
				var startX = parseInt(touches[0].pageX - canvasLeft);
				var startY = parseInt(touches[0].pageY - canvasTop);
				var colors  = ["red", "green", "yellow", "blue", "magenta", "orangered"];
				var myColor = colors[Math.floor(Math.random() * colors.length)];

				linesset.color = myColor;
				linesset.linedots.push([startX,startY]);
				dot.x = startX;
				dot.y =  startY;
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
			if(touches.length == 1){
				// 移动的点坐标
				var moveX = parseInt(touches[0].pageX - canvasLeft);
				var moveY = parseInt(touches[0].pageY - canvasTop);

				// 开始绘画
				ctx.beginPath();
				ctx.strokeStyle = linesset.color;
				ctx.moveTo(dot.x,dot.y);
				ctx.lineTo(moveX,moveY);
				ctx.stroke();
				ctx.closePath();

				dot.x = moveX;
				dot.y =  moveY;
				linesset.linedots.push([moveX,moveY]);
			}else{
				alert("对不起，绘画文字只允许一个触点！");
			}
		}catch(e){
			alert("对不起，您的浏览器不支持触屏事件！");
		}
	})

	$("#canvas-my").on("touchend", function(e){
		e.preventDefault(); // 阻止触摸时浏览器的缩放、滚动条滚动等默认事件

		alllines.push(linesset);
		console.log("alllines",alllines);
	})

	// 模拟向后台传输数据
	$("#saw").on("click",function(){
		linesdata = JSON.stringify(alllines);
		console.log("linesdata:"+linesdata);
	});
	
	var i = 0;
	// 使用回调的方式进行重绘
	function drawLine(data){
		var j = 0;
		var drawOne = setInterval(function(){
			if(data[i] != undefined && j < data[i].linedots.length-1){
				nctx.beginPath();
				nctx.strokeStyle = data[i].color;
				nctx.moveTo(data[i].linedots[j][0],data[i].linedots[j][1]);
				j++;
				nctx.lineTo(data[i].linedots[j][0],data[i].linedots[j][1]);
				nctx.stroke();
				nctx.closePath();
			}else{
				i++;
				clearInterval(drawOne);
				if(i < data.length){
					drawLine(data);
				}
			}
		},10);
	}

	$("#review").on("click",function(){
		var ajaxdata = JSON.parse(linesdata); // 获取后台数据
		console.log(ajaxdata);
		drawLine(ajaxdata);
	})
})