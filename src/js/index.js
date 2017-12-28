import ImgDraw from "./ImgDraw";
import Snow from "./snow.js";
// import "./modai.js";
if (process.env.NODE_ENV == "dev") {
	require("html-loader!../index.html");
}
// var ImgDraw = require('./ImgDraw')
import "../scss/index.scss";
import defaultHatSrc from '../images/99.png';


//屏幕大小
var windowW = document.body.clientWidth;
var windowH = document.body.clientHeight;

var hatBox = document.querySelector(".hat-box");
var createImg = document.getElementById("createImg");
var canvasImg = document.getElementById("canvasImg")
var imgFile = document.getElementById("imgFile");
var selectHead = document.getElementById("selectHead"); //选择头像按钮
var getCanvas = document.getElementById("canvas");
var context = getCanvas.getContext("2d");
var createCanvas; //生成图片用canvas
drawRect();
var imgFloor = []; //图层对象
var isFloor = undefined; //活动状态图层
var proportion = 750 / window.screen.width;
var isEdit = false;
var editTyle = undefined; //编辑类型
var hanleArc = 0;

//默认图片
var defaultHat = new Image();
defaultHat.src = defaultHatSrc;

//点击生成图片
createImg.addEventListener("click", function() {
	buildImg();
}, false);

//点击选择图片
selectHead.addEventListener("click", function(e) {
	var handleClick = document.createEvent("MouseEvents");
	handleClick.initEvent("click", true, true);
	imgFile.dispatchEvent(handleClick)
}, false);

//选择帽子
hatBox.addEventListener('click', function(e) {
	if (e.target.tagName === "IMG") {
		imgFloor.pop();
		var img = new Image();
		img.onload = function() {
			imgFloor.push(new ImgDraw({
				name: 'hat',
				translate: {
					x: 50,
					y: 50
				},
				imgObj: img,
				full: false,
			}));
			drawImg();
		}
		img.src = e.target.src;
	}
}, false);

//关闭弹窗
document.querySelector(".close").addEventListener("click", function() {
	document.querySelector("#createHeadImg").style.display = "none";
}, false);


// imgFile.style.display = "none";
//选择加载图片
imgFile.addEventListener("change", function() {
	imgFile.style.display = "none";
	var src = getFileUrl(this);
	var headerImg = new Image();
	headerImg.src = src;
	headerImg.onload = function() {
		document.querySelector(".tip").style.display = "none";
		switch (imgFloor.length) {
			case 0:
				imgFloor.push(new ImgDraw({
					imgObj: headerImg,
					name: 'header'
				}));
				imgFloor.push(new ImgDraw({
					name: 'hat',
					imgObj: defaultHat,
					full: false,
					translate: {
						x: 50,
						y: 50
					}
				}));
				break;
			case 1:
				imgFloor.unshift(new ImgDraw({
					imgObj: headerImg,
					name: 'header'
				}));
				break;

			default:
				imgFloor.shift();
				imgFloor.unshift(new ImgDraw({
					imgObj: headerImg,
					name: 'header'
				}));
				break;
		}

		drawImg();
	}

}, false);

// getCanvas.addEventListener("click", function(e) {
// 	drawEdit(e.pageX, e.pageY)
// }, false);
var sx = 0,
	sy = 0,
	ex = 0,
	ey = 0,
	sr = 0,
	er = 0,
	mx = 0,
	my = 0,
	mw = 0,
	mh = 0,
	mtx = 0,
	mty = 0,
	mr = 0,
	scaleXY = "W",
	one = false;
getCanvas.addEventListener("touchstart", function(e) {
	e.preventDefault();
	//是否在编辑状态
	if (isEdit) {
		var noSetFloor = setEditType(e.touches[0].pageX, e.touches[0].pageY);
	}

	//设置编辑图层
	if (!noSetFloor) {
		drawEdit(e.touches[0].pageX, e.touches[0].pageY);
		if (isFloor === undefined) {
			return;
		}
	}

	//拖拽移动
	if (e.touches.length == 1) {
		sx = e.touches[0].pageX;
		sy = e.touches[0].pageY;
		ex = sx;
		ey = sy;
		// sr = -sy / sx
		var srx = ex * 2 - imgFloor[isFloor].translate.x;
		var sry = imgFloor[isFloor].translate.y - ey * 2;
		sr = Math.atan(sry / srx) * 180 / Math.PI;

		if (srx > 0 && sry > 0) {
			sr = 360 - sr;
		} else if (srx > 0 && sry < 0) {
			sr = -sr
		} else if (srx < 0 && sry < 0) {
			sr = 180 - sr;
		} else if (srx < 0 && sry > 0) {
			sr = 180 - sr;
		}
		er = sr;

		mtx = imgFloor[isFloor].translate.x;
		mty = imgFloor[isFloor].translate.y;
		mr = imgFloor[isFloor].rotate;
		one = true;
	} else {
		one = false;
		sx = e.touches[1].pageX > e.touches[0].pageX ? e.touches[1].pageX - e.touches[0].pageX : e.touches[0].pageX - e.touches[1].pageX;
		sy = e.touches[1].pageY - e.touches[0].pageY;
		ex = sx;
		ey = sy;
	}
	mx = imgFloor[isFloor].dx;
	my = imgFloor[isFloor].dy;
	mw = imgFloor[isFloor].dw;
	mh = imgFloor[isFloor].dh;
}, false);
getCanvas.addEventListener("touchmove", function(e) {
	e.preventDefault();
	if (isFloor === undefined) {
		return;
	}

	//拖拽
	if (e.touches.length == 1 && one) {
		ex = e.touches[0].pageX;
		ey = e.touches[0].pageY;
		// er = -ey / ex

		var w = parseInt(ex - sx);
		var h = parseInt(ey - sy);
		//放大或旋转
		if (hanleArc) {
			// 右上方和左下方
			var ab = Math.abs(Math.sqrt(Math.pow(sx - ex, 2) + Math.pow(sy - ey, 2)));
			if (editTyle == undefined && ab > 2) {
				// var direction = angle / 90;
				if (hanleArc == 1 || hanleArc == 3) {
					editTyle = "scale";
					var rotateYU = mr % 360;
					if (rotateYU < 90 || (rotateYU > 180 && rotateYU < 270)) {
						scaleXY = "H"
					} else {
						scaleXY = "W"
					}
					// scaleXY = Math.abs(w) >= Math.abs(h) ? "W" : "H";
				} else {
					editTyle = "rotate";
				}
			}
			if (editTyle === "scale") {
				var rotateYU = parseInt(mr % 360);
				if (rotateYU > 90 && rotateYU < 270) {

					if (hanleArc == 3) {
						w = -w;
						h = -h;
					}
				} else {

					if (hanleArc == 1) {
						w = -w;
						h = -h;
					}
				}

				var scale = scaleXY === "W" ? w : h;
				imgFloor[isFloor].dw = parseInt(mw + scale * proportion * 2);
				imgFloor[isFloor].dh = imgFloor[isFloor].dw * mh / mw;
				imgFloor[isFloor].dx = parseInt(mx - scale * proportion);
				imgFloor[isFloor].dy = imgFloor[isFloor].dx * my / mx;
			}
			if (editTyle === "rotate") {
				var srx = ex * proportion - imgFloor[isFloor].translate.x;
				var sry = imgFloor[isFloor].translate.y - ey * proportion
				er = Math.atan(sry / srx) * 180 / Math.PI;

				if (srx > 0 && sry > 0) {
					er = 360 - er;
				} else if (srx > 0 && sry < 0) {
					er = -er
				} else if (srx < 0 && sry < 0) {
					er = 180 - er;
				} else if (srx < 0 && sry > 0) {
					er = 180 - er;
				}
				var angleRotate = er - sr < 0 ? 360 + er - sr : er - sr;
				if (er > 0 && er != 90) {
					imgFloor[isFloor].rotate = (angleRotate + mr);
				}
			}
		} else {
			imgFloor[isFloor].translate.x = parseInt(mtx + w * proportion);
			imgFloor[isFloor].translate.y = parseInt(mty + h * proportion);
		}


	} else {
		ex = e.touches[1].pageX > e.touches[0].pageX ? e.touches[1].pageX - e.touches[0].pageX : e.touches[0].pageX - e.touches[1].pageX;;
		ey = e.touches[1].pageY - e.touches[0].pageY;
		var w = (sx - ex) * proportion;
		imgFloor[isFloor].dw = parseInt(mw - w);
		imgFloor[isFloor].dh = parseInt(mh * imgFloor[isFloor].dw / mw);

		imgFloor[isFloor].dx = mx + (w / 2);
		imgFloor[isFloor].dy = my * imgFloor[isFloor].dx / mx;
	}
	drawImg()
}, false);
getCanvas.addEventListener("touchend", function(e) {
	editTyle = undefined;
	console.log("角度", parseInt(imgFloor[isFloor].rotate % 360))
}, false)


/*--------------下面是方法---------------*/
//rect
function drawRect() {
	context.clearRect(0, 0, 750, 750)
	context.save();
	context.fillStyle = "#f5f5f5";
	context.fillRect(40, 40, 750 - 80, 750 - 80);
	context.restore();
}
//drawImg
function drawImg() {

	drawRect()
		//绘画图层
	imgFloor.forEach(function(item) {
		item.draw(context);
	})
	if (isFloor >= 0) {
		Edit();
	}
}
//生成图片
function buildImg() {
	document.querySelector("#createHeadImg").style.display = "block";
	if (!createCanvas) {
		createCanvas = document.createElement("canvas");
		createCanvas.width = 750;
		createCanvas.height = 750;
		createCanvas.style.width = "100%";
	}
	var cxt = createCanvas.getContext("2d");
	cxt.clearRect(0, 0, 750, 750)
	cxt.fillStyle = "#fff"
	cxt.fillRect(0, 0, 750, 750)

	imgFloor.forEach(function(item, index) {
		item.build(cxt);
	});
	var src = createCanvas.toDataURL("image/png");
	canvasImg.src = src;
	// document.querySelector("body").appendChild(createCanvas)
}

//isPointInPath 判断点是否在哪个图层上
function drawEdit(x, y) {
	var copyImgFloor = imgFloor.concat();
	var padding = 40; //设置内边距
	copyImgFloor.reverse();
	copyImgFloor.some(function(item, index) {
		context.save();
		context.beginPath();
		context.rect(item.translate.x + item.dx, item.translate.y + item.dy, item.dw, item.dh);
		context.closePath();
		context.restore();
		if (context.isPointInPath(x * proportion, y * proportion)) {
			context.save();
			context.beginPath();
			context.rect(item.translate.x + item.dx + padding, item.translate.y + item.dy + padding, item.dw - padding, item.dh - padding);
			context.closePath();
			context.restore();
			if (context.isPointInPath(x * proportion, y * proportion)) {
				isFloor = copyImgFloor.length - 1 - index;
				isEdit = true;
			}
			drawImg()
			return true;
		}
		// isFloor = undefined;
		return false;
	})
}
//编辑状态
function Edit() {

	var item = imgFloor[isFloor];
	var r = 15;
	//画圆圈
	context.save();
	context.translate(item.translate.x, item.translate.y);
	context.rotate(item.rotate * Math.PI / 180);
	context.beginPath();
	context.arc(item.dx, item.dy, r, 0, 2 * Math.PI, false);
	context.fillStyle = "#ccc";
	context.fill();
	context.beginPath();
	context.moveTo(item.dx - r - 10, item.dy);
	context.lineTo(item.dx - r - 10, item.dy - r - 10);
	context.lineTo(item.dx, item.dy - r - 10);
	context.lineWidth = 3;
	context.strokeStyle = "#ff0000";
	context.stroke();

	context.beginPath();
	context.arc(item.dx + item.dw, item.dy, r + 10, 2 * Math.PI, 3 / 2 * Math.PI, true);
	context.strokeStyle = "#ff0000";
	context.lineWidth = 3
	context.stroke()
	context.beginPath();
	context.arc(item.dx + item.dw, item.dy, r, 0, 2 * Math.PI, false);
	context.fillStyle = "#ccc";
	context.fill();
	context.beginPath();
	context.arc(item.dx + item.dw, item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.fillStyle = "#ccc";
	context.fill();
	context.beginPath();
	context.moveTo(item.dx + item.dw + r + 10, item.dy + item.dh);
	context.lineTo(item.dx + item.dw + r + 10, item.dy + item.dh + r + 10);
	context.lineTo(item.dx + item.dw, item.dy + item.dh + r + 10);
	context.lineWidth = 3;
	context.strokeStyle = "#ff0000";
	context.stroke();

	context.beginPath();
	context.arc(item.dx, item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.fillStyle = "#ccc";
	context.fill();
	context.beginPath();
	context.arc(item.dx, item.dy + item.dh, r + 10, 1 / 2 * Math.PI, Math.PI, false);
	context.strokeStyle = "#ff0000";
	context.lineWidth = 3
	context.stroke()
		//画线
	context.beginPath();
	context.moveTo(item.dx, item.dy);
	context.lineTo(item.dx + item.dw, item.dy);
	context.lineTo(item.dx + item.dw, item.dy + item.dh);
	context.lineTo(item.dx, item.dy + item.dh);
	context.lineTo(item.dx, item.dy);
	context.lineWidth = 1;
	context.strokeStyle = "#ccc";
	context.stroke();
	context.closePath()

	//中心点
	context.beginPath();
	context.arc(0, 0, 10, 0, 2 * Math.PI, false)
	context.fillStyle = "#ccc";
	context.fill();
	context.closePath();
	context.restore();
}

//设置编辑类型
function setEditType(x, y) {
	var item = imgFloor[isFloor];
	var r = 45;
	//画圆圈
	context.save();
	context.translate(item.translate.x, item.translate.y);
	context.rotate(item.rotate * Math.PI / 180);
	context.beginPath();
	context.arc(item.dx, item.dy, r, 0, 2 * Math.PI, false);
	context.closePath();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 1;
		context.restore();
		return true;
	}

	context.beginPath();
	context.arc(item.dx + item.dw, item.dy, r, 0, 2 * Math.PI, false);
	context.closePath();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 2;
		context.restore();
		return true;
	}
	context.beginPath();
	context.arc(item.dx + item.dw, item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.closePath();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 3;
		context.restore();
		return true;
	}
	context.beginPath();
	context.arc(item.dx, item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.closePath();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 4;
		context.restore();
		return true;
	}

	hanleArc = 0;
	context.restore();
	return undefined;
}

//file 图片资源
function getFileUrl(imgObj) {
	var url;
	if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
		url = imgObj.value;
	} else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox 
		url = window.URL.createObjectURL(imgObj.files.item(0));
	} else { // Chrome 
		url = window.URL.createObjectURL(imgObj.files.item(0));
	}
	return url;
}

window.imgFloor = imgFloor;



//下雪
import treeImgSrc from '../images/tree.png';

var treeImg = new Image();
var closeSnow = document.getElementById("closeSnow");
var snowCanvas = document.getElementById("snow");
var snowGct = snowCanvas.getContext("2d");
var stop = null;
snowCanvas.width = windowW * 2;
snowCanvas.height = windowH * 2;
closeSnow.addEventListener("click", function() {
	document.querySelector(".snow-box").style.display = "none";
	document.querySelector(".wechar-ani").classList.add('scaleDown')
	cancelAnimationFrame(stop);
}, false);

treeImg.onload = function() {
	ani()
}
treeImg.src = treeImgSrc
var snowArr = []; //粒子对象
for (var i = 0; i < 60; i++) { //生成粒子的个数
	snowArr.push(new Snow());
	snowArr[i].init();
}
for (var i = 0; i < 30; i++) {
	snowArr[i].reset(); //初始化 分散粒子
}

function ani() {
	snowGct.clearRect(0, 0, windowW * 2, windowH * 2);
	snowGct.drawImage(treeImg, windowW - treeImg.width / 2, windowH * 2 - treeImg.height + 80)
	snowArr.forEach(function(item) {
		item.draw(snowGct, windowW * 2, windowH * 2)
	});

	stop = requestAnimationFrame(ani)
}


//微信分享
import 'whatwg-fetch';
var abc = encodeURIComponent(window.location.href)
fetch('http://www.viphk.xin/ajax/weixin.ashx?url=' + abc, {
	method: "GET"
}).then((response) => {
	return response.json();
}).then((json) => {
	console.log(json)
	wxInfo(json)
})

function wxInfo(json) {
	//配置微信
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: 'wx3dcb634a12345331', // 必填，公众号的唯一标识
		timestamp: json.timestamp, // 必填，生成签名的时间戳
		nonceStr: json.noncestr, // 必填，生成签名的随机串
		signature: json.signature, // 必填，签名，见附录1
		jsApiList: [
			'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo'
		]
	});

	//分享信息   
	wx.ready(function() {
		var sdata = {
			title: "让微信头像带上圣诞帽子",
			desc: "只要15秒, 在线给微信头像制作圣诞老人帽子",
			link: window.location.href,
			imgUrl: "http://www.viphk.xin/static/html/hat/images/head.jpg"
		};
		wx.onMenuShareTimeline(sdata);
		wx.onMenuShareAppMessage(sdata);
		wx.onMenuShareQQ(sdata);
		wx.onMenuShareWeibo(sdata);
	});

};
var au = document.getElementById("bgm");
document.addEventListener("WeixinJSBridgeReady", function() {
	au.play();
}, false);