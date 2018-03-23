import imageLoad from '../base/imageLoad';
import Snow from './snowflake';
import treeImgSrc from '../../images/tree.png';



var snowArr = []; //粒子对象
for (var i = 0; i < 60; i++) { //生成粒子的个数
	snowArr.push(new Snow());
	snowArr[i].init();
}
for (var i = 0; i < 30; i++) {
	snowArr[i].reset(); //初始化 分散粒子
}


/**
 * 下雪主函数
 */
export default class SnowMain {
	constructor(ctx, w, h) {
		this.loop = null;
		this.snowArr = snowArr;
		this.tree = null;
		this.init();
		this.ctx = ctx;
		this.w = w;
		this.h = h;
	}
	init() {
		var than = this;
		var promiseImg = imageLoad([treeImgSrc])
		Promise.all(promiseImg).then(function(imgArr) {
			than.tree = imgArr[0];
			than.render();
			console.log(than.tree);
		});
	};
	//绘画
	render() {
		var than = this;
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.drawImage(this.tree, this.w / 2 - this.tree.width / 2, this.h - this.tree.height + 80)
		this.snowArr.forEach(function(item) {
			item.render(than.ctx, than.w, than.h)
		});
		this.loop = requestAnimationFrame(this.render.bind(this));
	};
	//删除动画
	clearLoop() {
		cancelAnimationFrame(this.loop);
	}

}