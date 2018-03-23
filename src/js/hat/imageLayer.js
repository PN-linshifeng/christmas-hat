class ImageLayer {
	constructor(obj) {
		this.context = null;
		this.name = ""; //图层名称
		this.padding = 40; //图片内距
		this.imgObj = null; //图片对象
		this.state = 0; //图层状态
		this.full = true; //是否填满画布
		this.src = null; //图片URL
		this.sx = 0; //图层X坐标
		this.sy = 0;
		this.sw = 0;
		this.sh = 0;
		this.dx = 0;
		this.dy = 0;
		this.dw = 750;
		this.dh = 750;
		this.point = {
			x: 0,
			y: 0
		};
		this.translate = {
			x: 0,
			y: 0
		};
		this.scale = {
			x: 1,
			y: 1
		};
		this.rotate = 0; //Math.PI =180度
		Object.assign(this, obj);

		this.init();
	};
	//默认执行
	init() {
		if (this.full) {
			this.sw = this.imgObj.width;
			this.sh = this.imgObj.height;
			this.dw = 750 - this.padding * 2;
			this.dh = parseInt(this.sh * this.dw / this.imgObj.width);
			this.dx = -this.dw / 2;
			this.dy = -this.dh / 2;
			this.translate = {
				x: this.dx * -1 + this.padding,
				y: this.dy * -1 + this.padding
			};

		} else {
			this.sw = this.imgObj.width;
			this.sh = this.imgObj.height;
			this.dw = this.sw;
			this.dh = this.sh;
			this.dx = -this.dw / 2;
			this.dy = -this.dh / 2;
			this.translate = {
				x: this.dx * -1 + this.padding + this.translate.x,
				y: this.dy * -1 + this.padding + this.translate.y
			};
		}
	};
	//编辑图片
	render(ctx) {
		ctx.save();
		ctx.beginPath()
		ctx.rect(this.padding, this.padding, 750 - this.padding * 2, 750 - this.padding * 2);
		ctx.clip()

		ctx.translate(this.translate.x, this.translate.y);
		ctx.rotate(this.rotate * Math.PI / 180)
		ctx.drawImage(this.imgObj, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
		ctx.restore();
	};
	//生成图片
	build(ctx) {
		ctx.save();
		ctx.beginPath()
		ctx.scale(750 / 670, 750 / 670)
		ctx.translate(this.translate.x - this.padding, this.translate.y - this.padding);
		ctx.rotate(this.rotate * Math.PI / 180)

		ctx.drawImage(this.imgObj, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
		ctx.restore();
	}
}


export default ImageLayer;