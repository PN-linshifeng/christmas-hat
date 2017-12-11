var ImgDraw = function(obj) {
	this.context = null;
	this.imgObj = null;
	this.state = 0;
	this.full = true;
	this.src = null;
	this.sx = 0;
	this.sy = 0;
	this.sw = 0;
	this.sh = 0;
	this.dx = 0;
	this.dy = 0;
	this.dw = 750;
	this.dh = 750;
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
}
ImgDraw.prototype.init = function(context) {
	if (this.full) {
		this.sw = this.imgObj.width;
		this.sh = this.imgObj.height;
		this.dx = 40;
		this.dy = 40;
		this.dw = 750 - 80;
		this.dh = parseInt(this.sh * this.dw / this.imgObj.width);
	} else {
		this.sw = this.imgObj.width;
		this.sh = this.imgObj.height;
		this.dw = this.sw;
		this.dh = this.sh;
	}

}
ImgDraw.prototype.draw = function(context) {
		context.save();
		context.beginPath()
		context.rect(40, 40, 670, 670);
		context.clip()
			// context.scale(this.scale.x, this.scale.y)
		context.drawImage(this.imgObj, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
		// console.log(this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh)


		context.restore();
	}
	// module.exports = ImgDraw;
export default ImgDraw;