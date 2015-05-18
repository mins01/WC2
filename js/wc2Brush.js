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
		"init":function(){
			this.brushWC = WebCanvas(100,100)
			//this.previewBrushWC = WebCanvas(150,100)
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
		,"drawPreview":function(){ //dont use it;
			this.previewBrushWC.clear();
			this.beginBrush(this.previewBrushWC,10,40);
			
			this.drawBrush(75,70);
			
			this.drawBrush(140,40);
			
			//this.drawBrush(130,80);
			//this.endBrush();
		}
		//--- 브러쉬 그리기용
		,"beginBrush":function(wc,x,y){
			this.wc = wc
			//this.spacing = spacing;
			this.lastLen = 0;
			this.x0 = x;
			this.y0 = y;
			this.ing = 1;
			
			var w2 = (this.brushWC.width)/2
			var h2 = (this.brushWC.height)/2
			console.log(x,y);
			this.wc.drawImage(this.brushWC,this.x0-w2,this.y0-h2);
		}
		,"drawBrush":function(x,y){
			this.x1 = x;
			this.y1 = y;
			this._draw();
			this.x0 = x;
			this.y0 = y;
		}
		,"endBrush":function(){
			this.lastLen = 0;
			this.ing = 0;
		}
		,"_draw":function(){
			if(this.ing){
				var xys = this._dotsInLine(this.x0,this.y0,this.x1,this.y1,this.spacing);
				var w2 = (this.brushWC.width)/2
				var h2 = (this.brushWC.height)/2
				//console.log(xys);
				for(var i=0,m=xys.length;i<m;i++){
					this.wc.drawImage(this.brushWC,xys[i][0]-w2,xys[i][1]-h2);
				}
			}
		}
		,"_dotsInLine":function(x0,y0,x1,y1){
				var spacing = this.spacing;
				var xys = [];
				
				if(x0==x1 && y0==y1){
					return xys;
				}
				var b = x1-x0; //밑변
				var a = y1-y0;	//높이
				var c = Math.sqrt(Math.pow(a,2)+Math.pow(b,2)); //빗변
				var sinA = a/c;
				var cosA = b/c;
				var ci = 0;
				this.lastLen+=c;

				if(this.lastLen < spacing){
						return xys;
				}
				this.lastLen -=spacing;
				ci += spacing;
				xys.push([x0,y0])
				
				while(ci<c && this.lastLen >= spacing){
					var a1 = ci * sinA;
					var b1 = ci * cosA;
					var x2 = x0+b1;
					var y2 = y0+a1;
					//var c2 = Math.sqrt(Math.pow(x2-x0,2)+Math.pow(y2-y0,2)); //빗변
					xys.push([x2,y2])
					//console.log([x2,y2]);
					ci += spacing;
					this.lastLen -=spacing;
					
				}
				//console.log(x0,y0,x2,y2,c2 );
				return xys;
				
			}
	}
}();