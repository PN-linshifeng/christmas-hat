var ImgDraw = function(obj) {
	this.context = null;
	this.name = "";
	this.padding = 40;
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
}
ImgDraw.prototype.init = function() {
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

}
ImgDraw.prototype.draw = function(context) {
	context.save();
	context.beginPath()
	context.rect(this.padding, this.padding, 750 - this.padding * 2, 750 - this.padding * 2);
	context.clip()

	context.translate(this.translate.x, this.translate.y);
	context.rotate(this.rotate * Math.PI / 180)
	context.drawImage(this.imgObj, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
	context.restore();
}
ImgDraw.prototype.build = function(context) {

	context.save();
	context.beginPath()
	context.scale(750 / 670, 750 / 670)
	context.translate(this.translate.x - this.padding, this.translate.y - this.padding);
	context.rotate(this.rotate * Math.PI / 180)

	context.drawImage(this.imgObj, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
	context.restore();
}

export default ImgDraw;

if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}