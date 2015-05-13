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
		,"sync":function(image,colorStyle,width,globalAlpha){
			this.brushWC.clearResize(width,width);
			this.brushWC.configContext2d({"globalAlpha":globalAlpha})
			this.brushWC.drawImage(image,0,0,width,width);
			var colorset =wc2Helper.string2Colorset(colorStyle);
			this.brushWC.coverColor(colorset);
		}
		,"toDataURL":function(){
			return this.brushWC.toDataURL();
		}
	}
}();