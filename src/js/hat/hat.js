var proportion = 750 / window.screen.width;
export default class Hat {
	constructor() {
		this.canvas = canvas;
		this.imageLayer = []; //图层数据
		this.isEdit = false; //编辑状态
		this.editTyle = undefined; //编辑类型 scale rotate
		this.hanleArc = undefined; //点击1和3=scale,否则rotate
		this.isLayer = undefined; //活动状态图层
		this.handleEdit();
	};
	//编辑事件
	handleEdit() {
		var than = this;
		var ctx = this.canvas.getContext("2d");
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
		canvas.addEventListener("touchstart", function(e) {
			e.preventDefault();
			//是否在编辑状态
			if (than.isEdit) {
				var noSetFloor = than.setEditType(ctx, e.touches[0].pageX, e.touches[0].pageY);
			}

			//设置编辑图层
			if (!noSetFloor) {
				than.drawEdit(ctx, e.touches[0].pageX, e.touches[0].pageY);
				if (than.isLayer === undefined) {
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
				var srx = ex * 2 - than.imageLayer[than.isLayer].translate.x;
				var sry = than.imageLayer[than.isLayer].translate.y - ey * 2;
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

				mtx = than.imageLayer[than.isLayer].translate.x;
				mty = than.imageLayer[than.isLayer].translate.y;
				mr = than.imageLayer[than.isLayer].rotate;
				one = true;
			} else {
				one = false;
				sx = e.touches[1].pageX > e.touches[0].pageX ? e.touches[1].pageX - e.touches[0].pageX : e.touches[0].pageX - e.touches[1].pageX;
				sy = e.touches[1].pageY - e.touches[0].pageY;
				ex = sx;
				ey = sy;
			}
			mx = than.imageLayer[than.isLayer].dx;
			my = than.imageLayer[than.isLayer].dy;
			mw = than.imageLayer[than.isLayer].dw;
			mh = than.imageLayer[than.isLayer].dh;
		}, false);
		canvas.addEventListener("touchmove", function(e) {
			e.preventDefault();
			if (than.isLayer === undefined) {
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
				if (than.hanleArc) {
					// 右上方和左下方
					var ab = Math.abs(Math.sqrt(Math.pow(sx - ex, 2) + Math.pow(sy - ey, 2)));
					if (than.editTyle == undefined && ab > 2) {
						// var direction = angle / 90;
						if (than.hanleArc == 1 || than.hanleArc == 3) {
							than.editTyle = "scale";
							var rotateYU = mr % 360;
							if (rotateYU < 90 || (rotateYU > 180 && rotateYU < 270)) {
								scaleXY = "H"
							} else {
								scaleXY = "W"
							}
							// scaleXY = Math.abs(w) >= Math.abs(h) ? "W" : "H";
						} else {
							than.editTyle = "rotate";
						}
					}
					if (than.editTyle === "scale") {
						var rotateYU = parseInt(mr % 360);
						if (rotateYU > 90 && rotateYU < 270) {

							if (than.hanleArc == 3) {
								w = -w;
								h = -h;
							}
						} else {

							if (than.hanleArc == 1) {
								w = -w;
								h = -h;
							}
						}

						var scale = scaleXY === "W" ? w : h;
						than.imageLayer[than.isLayer].dw = parseInt(mw + scale * proportion * 2);
						than.imageLayer[than.isLayer].dh = than.imageLayer[than.isLayer].dw * mh / mw;
						than.imageLayer[than.isLayer].dx = parseInt(mx - scale * proportion);
						than.imageLayer[than.isLayer].dy = than.imageLayer[than.isLayer].dx * my / mx;
					}
					if (than.editTyle === "rotate") {
						var srx = ex * proportion - than.imageLayer[than.isLayer].translate.x;
						var sry = than.imageLayer[than.isLayer].translate.y - ey * proportion
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
							than.imageLayer[than.isLayer].rotate = (angleRotate + mr);
						}
					}
				} else {
					than.imageLayer[than.isLayer].translate.x = parseInt(mtx + w * proportion);
					than.imageLayer[than.isLayer].translate.y = parseInt(mty + h * proportion);
				}


			} else {
				ex = e.touches[1].pageX > e.touches[0].pageX ? e.touches[1].pageX - e.touches[0].pageX : e.touches[0].pageX - e.touches[1].pageX;;
				ey = e.touches[1].pageY - e.touches[0].pageY;
				var w = (sx - ex) * proportion;
				than.imageLayer[than.isLayer].dw = parseInt(mw - w);
				than.imageLayer[than.isLayer].dh = parseInt(mh * than.imageLayer[than.isLayer].dw / mw);

				than.imageLayer[than.isLayer].dx = mx + (w / 2);
				than.imageLayer[than.isLayer].dy = my * than.imageLayer[than.isLayer].dx / mx;
			}
			than.renderLayer(ctx)
		}, false);
		canvas.addEventListener("touchend", function(e) {
			than.editTyle = undefined;
			console.log("角度", parseInt(than.imageLayer[than.isLayer].rotate % 360))
		}, false)
	};
	//rect
	drawRect(ctx) {
		ctx.clearRect(0, 0, 750, 750)
		ctx.save();
		ctx.fillStyle = "#f5f5f5";
		ctx.fillRect(40, 40, 750 - 80, 750 - 80);
		ctx.restore();
	};
	//renderLayer
	renderLayer(ctx) {
		this.drawRect(ctx);
		//绘画图层
		this.imageLayer.forEach(function(item) {
			item.render(ctx);
		})
		if (this.isLayer >= 0) {
			this.Edit(ctx);
		}
	};
	//生成图片
	buildImg() {

		var createCanvas = document.getElementById("builCanvas") || document.createElement("canvas")
		createCanvas.width = 750;
		createCanvas.height = 750;
		createCanvas.style.width = "100%";
		createCanvas.id = "builCanvas";
		var ctx = createCanvas.getContext("2d");
		ctx.clearRect(0, 0, 750, 750)
		ctx.fillStyle = "#fff"
		ctx.fillRect(0, 0, 750, 750)

		this.imageLayer.forEach(function(item, index) {
			item.build(ctx);
		});
		var src = createCanvas.toDataURL("image/png");
		canvasImg.src = src;
		document.querySelector("#createHeadImg").style.display = "block";
	}

	//isPointInPath 判断点是否在哪个图层上
	drawEdit(ctx, x, y) {
		var than = this;
		var copyImgFloor = this.imageLayer.concat();
		var padding = 40; //设置内边距
		copyImgFloor.reverse();
		copyImgFloor.some(function(item, index) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(item.translate.x + item.dx, item.translate.y + item.dy, item.dw, item.dh);
			ctx.closePath();
			ctx.restore();
			if (ctx.isPointInPath(x * proportion, y * proportion)) {
				ctx.save();
				ctx.beginPath();
				ctx.rect(item.translate.x + item.dx + padding, item.translate.y + item.dy + padding, item.dw - padding, item.dh - padding);
				ctx.closePath();
				ctx.restore();
				if (ctx.isPointInPath(x * proportion, y * proportion)) {
					than.isLayer = copyImgFloor.length - 1 - index;
					than.isEdit = true;
				}
				than.renderLayer(ctx)
				return true;
			}
			// isFloor = undefined;
			return false;
		})
	};
	//编辑状态
	Edit(ctx) {

		var item = this.imageLayer[this.isLayer];
		var r = 15;
		//画圆圈
		ctx.save();
		ctx.translate(item.translate.x, item.translate.y);
		ctx.rotate(item.rotate * Math.PI / 180);
		ctx.beginPath();
		ctx.arc(item.dx, item.dy, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ccc";
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(item.dx - r - 10, item.dy);
		ctx.lineTo(item.dx - r - 10, item.dy - r - 10);
		ctx.lineTo(item.dx, item.dy - r - 10);
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#ff0000";
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(item.dx + item.dw, item.dy, r + 10, 2 * Math.PI, 3 / 2 * Math.PI, true);
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 3
		ctx.stroke()
		ctx.beginPath();
		ctx.arc(item.dx + item.dw, item.dy, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ccc";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(item.dx + item.dw, item.dy + item.dh, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ccc";
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(item.dx + item.dw + r + 10, item.dy + item.dh);
		ctx.lineTo(item.dx + item.dw + r + 10, item.dy + item.dh + r + 10);
		ctx.lineTo(item.dx + item.dw, item.dy + item.dh + r + 10);
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#ff0000";
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(item.dx, item.dy + item.dh, r, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#ccc";
		ctx.fill();
		ctx.beginPath();
		ctx.arc(item.dx, item.dy + item.dh, r + 10, 1 / 2 * Math.PI, Math.PI, false);
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 3
		ctx.stroke();
		//画线
		ctx.beginPath();
		ctx.moveTo(item.dx, item.dy);
		ctx.lineTo(item.dx + item.dw, item.dy);
		ctx.lineTo(item.dx + item.dw, item.dy + item.dh);
		ctx.lineTo(item.dx, item.dy + item.dh);
		ctx.lineTo(item.dx, item.dy);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#ccc";
		ctx.stroke();
		ctx.closePath()

		//中心点
		ctx.beginPath();
		ctx.arc(0, 0, 10, 0, 2 * Math.PI, false)
		ctx.fillStyle = "#ccc";
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	//设置编辑类型
	setEditType(ctx, x, y) {
		var item = this.imageLayer[this.isLayer];
		var r = 45;
		//画圆圈
		ctx.save();
		ctx.translate(item.translate.x, item.translate.y);
		ctx.rotate(item.rotate * Math.PI / 180);
		ctx.beginPath();
		ctx.arc(item.dx, item.dy, r, 0, 2 * Math.PI, false);
		ctx.closePath();
		if (ctx.isPointInPath(x * proportion, y * proportion)) {
			this.hanleArc = 1;
			ctx.restore();
			return true;
		}

		ctx.beginPath();
		ctx.arc(item.dx + item.dw, item.dy, r, 0, 2 * Math.PI, false);
		ctx.closePath();
		if (ctx.isPointInPath(x * proportion, y * proportion)) {
			this.hanleArc = 2;
			ctx.restore();
			return true;
		}
		ctx.beginPath();
		ctx.arc(item.dx + item.dw, item.dy + item.dh, r, 0, 2 * Math.PI, false);
		ctx.closePath();
		if (ctx.isPointInPath(x * proportion, y * proportion)) {
			this.hanleArc = 3;
			ctx.restore();
			return true;
		}
		ctx.beginPath();
		ctx.arc(item.dx, item.dy + item.dh, r, 0, 2 * Math.PI, false);
		ctx.closePath();
		if (ctx.isPointInPath(x * proportion, y * proportion)) {
			this.hanleArc = 4;
			ctx.restore();
			return true;
		}

		this.hanleArc = 0;
		ctx.restore();
		return undefined;
	}
}