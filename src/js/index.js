import ImgDraw from "./ImgDraw";
import ImgLoading from "./imgLoad.js";

// var ImgDraw = require('./ImgDraw')
import "../scss/index.scss";
import icon from '../images/icon.png';

var imgFile = document.getElementById("imgFile");
var getCanvas = document.getElementById("canvas");
var context = getCanvas.getContext("2d");
drawRect()
var imgFloor = []; //图层对象
var imgSrc = []; //图片src集合
var imgLoad = null; //图片对象
var isFloor = undefined; //活动状态图层
var proportion = 750 / window.screen.width;
var isEdit = false;
var editTyle = undefined; //编辑类型
var hanleArc = 0;


// imgFile.style.display = "none";
//选择加载图片
imgFile.addEventListener("change", function() {
	imgFile.style.display = "none";
	var src = getFileUrl(this);
	imgSrc = [src, icon]
	imgLoad = new ImgLoading(imgSrc);
	imgLoad.load(function() {

		imgFloor.push(new ImgDraw({
			imgObj: imgLoad.getImgObg[0],
		}));
		imgFloor.push(new ImgDraw({
			imgObj: imgLoad.getImgObg[1],
			full: false,
			translate: {
				x: 300,
				y: 300
			}
		}));
		drawImg()
	});
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
	one = false;
getCanvas.addEventListener("touchstart", function(e) {
	e.preventDefault();
	//是否在编辑状态
	if (isEdit) {
		var noSetFloor = setEditType(e.touches[0].pageX, e.touches[0].pageY);
		// console.log(hanleArc);

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

		console.log("度：" + sr)

		er = sr;
		mx = imgFloor[isFloor].dx;
		my = imgFloor[isFloor].dy;
		mw = imgFloor[isFloor].dw;
		mh = imgFloor[isFloor].dh;
		mtx = imgFloor[isFloor].translate.x;
		mty = imgFloor[isFloor].translate.y;
		mr = imgFloor[isFloor].rotate * 180 / Math.PI;
		one = true;
		// console.log("MR:", mr)
	} else {
		one = false;
		sx = e.touches[1].pageX > e.touches[0].pageX ? e.touches[1].pageX - e.touches[0].pageX : e.touches[0].pageX - e.touches[1].pageX;
		sy = e.touches[1].pageY - e.touches[0].pageY;
		ex = sx;
		ey = sy;

		mx = imgFloor[isFloor].dw;
		my = imgFloor[isFloor].dh;
		document.getElementById("text2").innerHTML = mx
	}


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

		var w = ex - sx;
		var h = ey - sy;
		//放大或旋转
		if (hanleArc) {
			// 右上方和左下方
			var ab = Math.abs(Math.sqrt(Math.pow(sx - ex, 2) + Math.pow(sy - ey, 2)))
			console.log(ab)
			if (editTyle == undefined && ab > 2) {
				if (w * h < 0) {
					editTyle = "scale";
				} else {
					editTyle = "rotate";
				}
			}
			if (editTyle === "scale") {
				imgFloor[isFloor].dw = parseInt(mw + w * 4);
				imgFloor[isFloor].dh = imgFloor[isFloor].dw * mh / mw;
				imgFloor[isFloor].dx = parseInt(mx - w * 2);
				imgFloor[isFloor].dy = imgFloor[isFloor].dx * mx / mx;
			}
			if (editTyle === "rotate") {
				var srx = ex * 2 - imgFloor[isFloor].translate.x;
				var sry = imgFloor[isFloor].translate.y - ey * 2
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
				if (er >= 0) {
					imgFloor[isFloor].rotate = (er - sr + mr) * Math.PI / 180;
				}
			}
		} else {
			imgFloor[isFloor].translate.x = parseInt(mtx + w * 2);
			imgFloor[isFloor].translate.y = parseInt(mty + h * 2);
			console.log("走走")
		}


	} else {
		ex = e.touches[1].pageX > e.touches[0].pageX ? e.touches[1].pageX - e.touches[0].pageX : e.touches[0].pageX - e.touches[1].pageX;;
		ey = e.touches[1].pageY - e.touches[0].pageY;
		var w = (sx - ex) * proportion;
		imgFloor[isFloor].dw = parseInt(mx - w);
		imgFloor[isFloor].dh = parseInt(my * imgFloor[isFloor].dw / mx);
		var h = imgFloor[isFloor].dh - my;

	}

	document.getElementById("text").innerHTML = imgFloor[isFloor].dw

	drawImg()
}, false);
getCanvas.addEventListener("touchend", function(e) {
	editTyle = undefined;
}, false)

//rect
function drawRect() {
	context.clearRect(0, 0, 750, 750)
	context.save();
	context.fillStyle = "#fff";
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
		Edit()
	}
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
		// console.log(item.translate.x + item.dx, item.translate.y + item.dy, item.dw, item.dh)
		// console.log(item.translate.x + item.dx + padding, item.translate.y + item.dy + padding, item.dw - padding, item.dh - padding)
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
	var r = 30;
	//画圆圈
	context.beginPath();
	context.arc(item.translate.x + item.dx, item.translate.y + item.dy, r, 0, 2 * Math.PI, false);
	context.fillStyle = "#ccc";
	context.fill();
	context.beginPath();
	context.arc(item.translate.x + item.dx + item.dw, item.translate.y + item.dy, r, 0, 2 * Math.PI, false);
	context.fill();
	context.beginPath();
	context.arc(item.translate.x + item.dx + item.dw, item.translate.y + item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.fill();
	context.beginPath();
	context.arc(item.translate.x + item.dx, item.translate.y + item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.fill();
	//画线
	context.beginPath();
	context.moveTo(item.translate.x + item.dx, item.translate.y + item.dy);
	context.lineTo(item.translate.x + item.dx + item.dw, item.translate.y + item.dy);
	context.lineTo(item.translate.x + item.dx + item.dw, item.translate.y + item.dy + item.dh);
	context.lineTo(item.translate.x + item.dx, item.translate.y + item.dy + item.dh);
	context.lineTo(item.translate.x + item.dx, item.translate.y + item.dy);
	context.lineWidth = 1;
	context.strokeStyle = "#ccc";
	context.stroke();
	context.closePath()

	//中心点
	context.beginPath();
	context.arc(item.translate.x, item.translate.y, 10, 0, 2 * Math.PI, false)
	context.fillStyle = "#000";
	context.fill();
	context.closePath()
}

//设置编辑类型
function setEditType(x, y) {
	var item = imgFloor[isFloor];
	var r = 30;
	//画圆圈
	context.save();
	context.beginPath();
	context.arc(item.translate.x + item.dx, item.translate.y + item.dy, r, 0, 2 * Math.PI, false);
	// console.log(item.translate.x + item.dx, item.translate.y + item.dy)
	// console.log(x * proportion, y * proportion)
	context.closePath();
	context.restore();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 1;
		return true;
	}

	context.beginPath();
	context.arc(item.translate.x + item.dx + item.dw, item.translate.y + item.dy, r, 0, 2 * Math.PI, false);
	context.closePath();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 2;
		return true;
	}
	context.beginPath();
	context.arc(item.translate.x + item.dx + item.dw, item.translate.y + item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.closePath();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 3;
		return true;
	}
	context.beginPath();
	context.arc(item.translate.x + item.dx, item.translate.y + item.dy + item.dh, r, 0, 2 * Math.PI, false);
	context.closePath();
	if (context.isPointInPath(x * proportion, y * proportion)) {
		hanleArc = 4;
		return true;
	}
	hanleArc = 0;
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