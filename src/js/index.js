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
			dx: 600,
			dy: 100
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
	mx = 0,
	my = 0,
	one = false;
getCanvas.addEventListener("touchstart", function(e) {
	e.preventDefault();
	drawEdit(e.touches[0].pageX, e.touches[0].pageY);
	var i = imgFloor.length - 1 - isFloor;
	if (isFloor === undefined) {
		return;
	}
	//拖拽移动
	if (e.touches.length == 1) {
		console.log(1)
		sx = e.touches[0].pageX;
		sy = e.touches[0].pageY;
		ex = sx;
		ey = sy;

		mx = imgFloor[i].dx;
		my = imgFloor[i].dy;
		one = true;
	} else {
		one = false;
		sx = e.touches[1].pageX - e.touches[0].pageX;
		sy = e.touches[1].pageY - e.touches[0].pageY;
		ex = sx;
		ey = sy;

		mx = imgFloor[i].dw;
		my = imgFloor[i].dh;
		document.getElementById("text2").innerHTML = mx
	}


}, false);
getCanvas.addEventListener("touchmove", function(e) {
	e.preventDefault();
	if (isFloor === undefined) {
		return;
	}
	var i = imgFloor.length - 1 - isFloor;
	//拖拽
	if (e.touches.length == 1 && one) {
		ex = e.touches[0].pageX;
		ey = e.touches[0].pageY;

		var w = ex - sx;
		var h = ey - sy;
		imgFloor[i].dx = parseInt(mx + w * 2);
		imgFloor[i].dy = parseInt(my + h * 2);
	} else {
		ex = e.touches[1].pageX - e.touches[0].pageX;
		ey = e.touches[1].pageY - e.touches[0].pageY;
		var w = ex - sx;
		imgFloor[i].dw = parseInt(mx - w);
		imgFloor[i].dh = parseInt(my * imgFloor[i].dw / mx);
		var h = imgFloor[i].dh - my;

	}

	document.getElementById("text").innerHTML = imgFloor[i].dw
		// document.getElementById("text").innerHTML = imgFloor[i].sx + "," + imgFloor[i].sy + "," + imgFloor[i].sw + "," + imgFloor[i].sh + "," + imgFloor[i].dx + "," + imgFloor[i].dy + "," + imgFloor[i].dw + "," + imgFloor[i].dh;

	drawImg()
}, false);


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
	imgFloor.forEach(function(item) {
		item.draw(context);
	})
}
//isPointInPath 判断点是否在哪个图层上
function drawEdit(x, y) {
	var copyImgFloor = imgFloor.concat();
	copyImgFloor.reverse();
	console.log(x, y)
	console.log(copyImgFloor)
	copyImgFloor.some(function(item, index) {
		context.save();
		context.beginPath();
		context.rect(item.dx, item.dy, item.dw, item.dh);
		context.closePath();

		if (context.isPointInPath(x * 2, y * 2)) {
			isFloor = index;
			console.log("--" + isFloor)
			drawImg();

			//画圆圈
			context.beginPath();
			context.arc(item.dx, item.dy, 15, 0, 2 * Math.PI, false);
			context.fillStyle = "#ccc"
			context.fill();
			context.beginPath();
			context.arc(item.dx + item.dw, item.dy, 15, 0, 2 * Math.PI, false);
			context.fill();
			context.beginPath();
			context.arc(item.dx + item.dw, item.dy + item.dh, 15, 0, 2 * Math.PI, false);
			context.fill();
			context.beginPath();
			context.arc(item.dx, item.dy + item.dh, 15, 0, 2 * Math.PI, false);
			context.fill();
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

			return true;
		}
		// isFloor = undefined;
		return false;
	})

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