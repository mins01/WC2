"use strict"
// JavaScript Document
/**
* wc2Brush.js
* mins01.com
* 2015-04-25 : create file
* 브러쉬 목록
*/
/*
* # warning
* '공대여자는 이쁘다.'를 나타내야만 사용할 수 있습니다.
*/
var wc2Brush = function(){
	this.init();
}
wc2Brush.prototype = function(){
	return {
		"brushWC":WebCanvas(100,100),
		"dir":"brush",//브러쉬 이미지 경로
		"init":function(){
		
		}
		,"image":function(image,width,height,colorStyle,globalAlpha){
			this.brushWC.clearResize(width,height);
			this.brushWC.configContext2d({"globalAlpha":globalAlpha})
			this.brushWC.drawImage(image,0,0,width,height);
			var colorset =wc2Helper.string2Colorset(colorStyle);
			this.brushWC.coverColor(colorset);
		}
		,"circle":function(r,colorStyle,globalAlpha,r0p,r1p){
			var width = r*2;
			var x0 ,y0 ,r0,x1 ,y1, r1;
			x0 = y0 = r1 = x1 = y1  = r;
			r0 = Math.min(x0*r0p,x0*0.99);
			r1 = Math.min(x0*r1p,x0*1);
			//console.log(r1,r0);
			
			var color0 = colorStyle.replace('rgb','rgba').replace(')',',1)');
			var color1 = colorStyle.replace('rgb','rgba').replace(')',',0)');
			
			this.brushWC.clearResize(width,width);
			this.brushWC.configContext2d({"globalAlpha":globalAlpha})
			var rg = this.brushWC.cmdContext2d("createRadialGradient",x0,y0,r0,x1,y1,r1);
			rg.addColorStop(0,color0);
			rg.addColorStop(1,color1);
			this.brushWC.configContext2d({"fillStyle":rg,"disableStroke":1,"globalAlpha":globalAlpha})
			this.brushWC.rect(0,0,width,width);
			this.brushWC.configContext2d({"fillStyle":color0,"disableStroke":1,"globalAlpha":globalAlpha})
			this.brushWC.circle(x0,y0,r0);
			var colorset =wc2Helper.string2Colorset(colorStyle);
			this.brushWC.coverColor(colorset);
		}
		
		,"toDataURL":function(){
			return this.brushWC.toDataURL();
		}
	}
}();