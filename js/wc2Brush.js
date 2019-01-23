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

		"dir":"brush",//브러쉬 이미지 경로
		"spacing":0, //선간격
		"disablePressureDiameter":false, //압력감지 지름 적용여부
		"minimumPressureDiameter":0.1, //알파 최소 압력값
		"disablePressureAlpha":false, //압력감지 알파 적용여부
		"minimumPressureAlpha":0.1, //알파 최소 압력값
		"init":function(){
			this.brushWC = WebCanvas(100,100)
			this.previewBrushWC = WebCanvas(150,100)
		}

		,"calculatePressureDimeter":function(pressure){
			if(this.disablePressureDiameter) return 1;
			return Math.min(this.minimumPressureDiameter+pressure,1)
		}
		,"calculatePressureAlpha":function(pressure){
			if(this.disablePressureAlpha) return 1;
			return Math.min(this.minimumPressureAlpha+pressure,1)
		}
		,"loadUrl":function(url,width,height,colorStyle,globalAlpha){
			var image = new Image();
			var thisC = this;
			image.onload = function(e){
				thisC.image(this,width,height,colorStyle,globalAlpha);
			}
			image.onerror = function(e){
				console.log(e)
			}
			image.src = url;
			return;
		}
		,"image":function(image,width,height,colorStyle,globalAlpha){
			this.brushWC.clearResize(width,height);
			this.brushWC.configContext2d({"globalAlpha":globalAlpha})
			this.brushWC.drawImage(image,0,0,width,height);
			var colorset =wc2Helper.string2Colorset(colorStyle);
			//console.log(colorset);
			this.brushWC.coverColor(colorset);
		}
		,"circle":function(r,colorStyle,globalAlpha,r0p,r1p){
			var width = r*2;
			var x0 ,y0 ,r0,x1 ,y1, r1;
			x0 = y0 = r1 = x1 = y1  = r;
			//r0 = x0*Math.min(r0p,1);
			//r1 = x0*Math.max(r1p,r0p);
			//console.log(r1,r0);
			r0 = 0;
			r1 = x0;
			if(r<1){ //크롬 4.4.0.2403.115 에서 r이 0 미만이면 그라데이션 원 그리는데 문제가 있다.
				r0p = 1; //그라에션은을 사용 안하도록 한다.
			}
			var color0 = colorStyle.replace('rgb','rgba').replace(')',',1)');
			var color1 = colorStyle.replace('rgb','rgba').replace(')',',0)');
			this.brushWC.clearResize(width,width);
			this.brushWC.configContext2d({"globalAlpha":globalAlpha,"imageSmoothingEnabled":true})
			this.brushWC.saveContext2d();
			if(r0p<1){
				var rg = this.brushWC.cmdContext2d("createRadialGradient",x0,y0,r0,x1,y1,r1);
				rg.addColorStop(0,color0);
				rg.addColorStop(r0p,color0);
				rg.addColorStop(1,color1);
				this.brushWC.configContext2d({"fillStyle":rg,"disableStroke":1})
				//this.brushWC.rect(0,0,width,width);
				this.brushWC.circle(x0,y0,r1);
			}else{
				this.brushWC.configContext2d({"fillStyle":color0,"disableStroke":1})
				this.brushWC.circle(x0,y0,r1);
			}
			this.brushWC.restoreContext2d();
			var colorset =wc2Helper.string2Colorset(colorStyle);
			this.brushWC.coverColor(colorset);
		}
		,"toDataURL":function(){
			return this.brushWC.toDataURL();
		}
		//--포물선으로 선 미리보기를 보여준다.
		,"previewBrush":function(){
			this.previewBrushWC.clear();
			var r = 20;
			var xlimit = 60;
			var r2 = (r*r);
			var a = -1*r*0.5;
			var x = -1*xlimit;
			var left = 75,top=50;

			//var y = Math.sqrt(r2-(x*x));
			//var y = (x*x)/a
			var y = 0;

			var pressureDimeter , pressureAlpha  , gapPressureDimeter , gapPressureAlpha;
			pressureDimeter = pressureAlpha  = gapPressureDimeter = gapPressureAlpha = this.spacing/xlimit;
			if(this.disablePressureDiameter){
				pressureDimeter = 1;
				gapPressureDimeter = 0;
			}
			if(this.disablePressureAlpha){
				pressureAlpha = 1;
				gapPressureAlpha = 0;
			}
			y = -1*Math.abs(Math.sqrt(a*x));
			this.previewBrushWC.beginBrush(x+left,y+top,this.brushWC,this.spacing,this.minimumPressureDiameter,this.minimumPressureAlpha);

			while((x+=this.spacing )<0 ){
				//y = Math.sqrt(r2-(x*x));
				y = -1*Math.abs(Math.sqrt(a*x));
				// y= -1*(4*x*x*x+3*x*x+2*x);
				// console.log(y);

				this.previewBrushWC.drawBrush(x+left,y+top,Math.max(this.minimumPressureDiameter,pressureDimeter),Math.max(this.minimumPressureAlpha,pressureAlpha));
				pressureDimeter+=gapPressureDimeter;
				pressureAlpha+=gapPressureAlpha;
			}
			a *= -1;
			while((x+=this.spacing )<=xlimit ){
				//console.log(x);
				//y = Math.sqrt(r2-(x*x));
				y = Math.abs(Math.sqrt(a*x));

				this.previewBrushWC.drawBrush(x+left,y+top,Math.max(this.minimumPressureDiameter,pressureDimeter),Math.max(this.minimumPressureAlpha,pressureAlpha));
				pressureDimeter-=gapPressureDimeter;
				pressureAlpha-=gapPressureAlpha;
			}
			this.previewBrushWC.saveContext2d();
			this.previewBrushWC.configContext2d({"fontSize":14,"fontWeight":"bold","lineHeight":1.2,"disableStroke":1,"textBaseline":"top","fillStyle":"#fff","filter":"drop-shadow(0px 0px 5px white)"})
			var txt = "Size:"+this.brushWC.width+"\n"+"Alpha:"+this.brushWC.context2d.globalAlpha.toFixed(2)+"\nSpacing:"+this.spacing+"\n";
			this.previewBrushWC.text(txt,1,31)

			this.previewBrushWC.configContext2d({"fillStyle":"#000"})
			var txt = "Size:"+this.brushWC.width+"\n"+"Alpha:"+this.brushWC.context2d.globalAlpha.toFixed(2)+"\nSpacing:"+this.spacing+"\n";
			this.previewBrushWC.text(txt,0,30)

			this.previewBrushWC.restoreContext2d();
			/*
			this.previewBrushWC.beginBrush(20,20,this.brushWC,this.spacing);
			this.previewBrushWC.drawBrush(110,80);
			this.previewBrushWC.drawBrush(75,80);
			*/
			this.previewBrushWC.endBrush();
		}
	}






}();
