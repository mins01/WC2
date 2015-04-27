"use strict"
// JavaScript Document
/**
* wc2.tool.js
* mins01.com
* 2015-04-25 : create file
* require : jquery,jquery-ui,bootstrap,spectrum(color picker on jquery), wc.js
* 이벤드에 따른 그림 그리기 툴을 정의
*/
/*
* # warning
* '공대여자는 이쁘다.'를 나타내야만 사용할 수 있습니다.
*/
var wc2Tool = function(){
	if(!wc2){
		console.error("wc2가 없습니다.");
		return null;
	}
	var r = {
		"error":""
		,"lastToolName":""
		//-- 제어용 함수 흐름 :  init -> onDown -> onMove -> onUp -> end
		//-- ETC : predraw,onScroll
		,"init":function(toolName,wcb){
			if(!this[toolName]){
				this.error = "wc2Tool.init : "+toolName+"라는 툴이 지원되지 않습니다.";
				return false;
			}
			if(this.lastToolName != toolName && this[this.lastToolName] && this[this.lastToolName].reset){
				this[this.lastToolName].reset(); //이전 동작에 대한 남겨진 내용을 초기화
			}
			this.lastToolName  = toolName;
			return this[toolName].init(wcb);
		}
		,"onDown":function(toolName,event){
			//에러는 init에서 이미 체크했다.
			return this[toolName].down(event);
		}
		,"onMove":function(toolName,event){
			//에러는 init에서 이미 체크했다.
			return this[toolName].move(event);
		}
		,"onUp":function(toolName,event){
			//에러는 init에서 이미 체크했다.
			return this[toolName].up(event);
		}
		,"end":function(toolName){
			//에러는 init에서 이미 체크했다.
			return this[toolName].end();
		}
		,"predraw":function(toolName){
			//에러는 init에서 이미 체크했다.
			return this[toolName].predraw();
		}
		,"confirm":function(toolName){ //특정 툴에서만 있다. 확인을 받아야만 적용되는 경우. reset과 짝을 이루어 있어야한다.
			if(!toolName || !this[toolName].confirm){ return false;}
			return this[toolName].confirm();
		}
		,"reset":function(toolName){ //특정 툴에서만 있다. 확인을 받아야만 적용되는 경우. confirm과 짝을 이루어 있어야한다.
			if(!toolName || !this[toolName].reset){ return false;}
			return this[toolName].reset();
		}
		,"onScroll":function(toolName,event){
			//에러는 init에서 이미 체크했다.
			if(!toolName || !this[toolName].scroll){ return false;}
			return this[toolName].scroll(event);
		}
		//-- 라인
		,"line":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"init":function(wcb){
				this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				this.wcb = null;
				return true;
			}
			,"down":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = t.x;
				this.y0 = t.y;
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("down");
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				this.wcb.shadowWebCanvas.clear();
				this.wcb.shadowWebCanvas.line(this.x0,this.y0,this.x1,this.y1);
			}
		}
		//-- 펜
		,"pen":{
			"wcb":null
			,"pos":[]
			,"init":function(wcb){
				this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				this.wcb = null;
				this.pos = [];
				return true;
			}
			,"down":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.pos.push([t.x,t.y])
				this.predraw();
				//console.log("down");
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.pos.push([t.x,t.y])
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.pos.push([t.x,t.y])
				this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				this.wcb.shadowWebCanvas.clear();
				this.wcb.shadowWebCanvas.lines(this.pos);
			}
		}
		//-- 지우개
		,"eraser":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"eraserMode":"pen"
			,"init":function(wcb){
				this.wcb = wcb;
				//console.log("init");				
				this.eraserMode = this.wcb.shadowWebCanvas.getConfigContext2d("eraserMode");
				
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				$(this.wcb.activeWebCanvas).removeClass("WC-hidden");
				this.wcb = null;
				return true;
			}
			,"down":function(event){
				$(this.wcb.activeWebCanvas).addClass("WC-hidden");
				this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas);
				this.wcb.shadowWebCanvas.configContext2d({"globalCompositeOperation":"destination-out"});
				
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = t.x;
				this.y0 = t.y;
				this.x1 = t.x;
				this.y1 = t.y;
				
				this.predraw();
				//console.log("down");
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = this.x1;
				this.y0 = this.y1;
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = this.x1;
				this.y0 = this.y1;
				this.x1 = t.x;
				this.y2 = t.y;
				this.predraw();
				
				this.wcb.activeWebCanvas.copy(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				if(this.eraserMode=="pen"){
					this.wcb.shadowWebCanvas.line(this.x0,this.y0,this.x1,this.y1);
				}
			}
		}
		//-- 사각형
		,"rect":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"init":function(wcb){
				this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				this.wcb = null;
				return true;
			}
			,"down":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = t.x;
				this.y0 = t.y;
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("down");
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				this.wcb.shadowWebCanvas.clear();
				this.wcb.shadowWebCanvas.rect(this.x0,this.y0,this.x1-this.x0,this.y1-this.y0);
			}
		}
		//-- 원
		,"circle":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"init":function(wcb){
				this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				this.wcb = null;
				return true;
			}
			,"down":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = t.x;
				this.y0 = t.y;
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("down");
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				this.wcb.shadowWebCanvas.clear();
				//-- 정원 그리기
				var xd = (this.x1 - this.x0)/2;
				var yd = (this.y1 - this.y0)/2;
				var r = Math.sqrt(xd*xd+yd*yd)*2;			
				this.wcb.shadowWebCanvas.circle(this.x0,this.y0,r);
			}
		}
		//-- 이동
		,"move":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"ing":0
			,"init":function(wcb){
				if(this.ing ==0){
					this.wcb = wcb;
					$(this.wcb.activeWebCanvas).addClass("WC-hidden");
					this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas);
					this.wcb.node.style.cursor = "move";
				}
				return true;
			}
			,"end":function(){

				return true;
			}
			,"down":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				if(this.ing ==0){
					this.x0 = 0;
					this.y0 = 0;
					this.ing = 1;
				}
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 += t.x-this.x1;
				this.y0 += t.y-this.y1;
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				//this.wcb.shadowWebCanvas.clear();
				this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas,this.x0,this.y0);
			}
			,"confirm":function(){
				if(this.ing == 1){
					if(confirm("OK?")){
						this.wcb.activeWebCanvas.copy(this.wcb.shadowWebCanvas);
					}
					this.ing = 0;
					return this.reset();
				}
				return true;
				
			}
			,"reset":function(){
				//console.log("reset");
				if(this.wcb){
					this.wcb.node.style.cursor = "";
					this.ing = 0;
					this.wcb.shadowWebCanvas.clear();
					$(this.wcb.activeWebCanvas).removeClass("WC-hidden");
					this.wcb = null;
				}
				return true;
			}
		}
		//--- 이미지
		//-- 사용 후 로컬(file://)에서는 에러날 수 있다. (Uncaught SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.)
		,"image":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"w0":-1,"h0":-1
			,"ing":0
			,"init":function(wcb){
				this.img  = document.getElementById('imageNode');
				this.img.onload = function(toolImage){
					return function(){
						toolImage._initXYWH();
						toolImage.predraw()
					}
				}(this);
				
				if(this.ing ==0){
					this.wcb = wcb;
					//$(this.wcb.activeWebCanvas).addClass("WC-hidden");
					//this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas);
					this.wcb.node.style.cursor = "move";
					this._initXYWH();
					this.predraw();
				}
				return true;
			}
			,"_initXYWH":function(){ //계산이 두번 같은 걸 하기에...
				this.w0 = this.img.naturalWidth;
				this.h0 = this.img.naturalHeight;
				this.x0 = (this.wcb.width-this.w0)/2;
				this.y0 = (this.wcb.height-this.h0)/2;
			}
			,"end":function(){
				return true;
			}
			,"scroll":function(event){
			}
			,"down":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				if(this.ing ==0){
					this.ing = 1;
				}
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 += t.x-this.x1;
				this.y0 += t.y-this.y1;
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				//this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				this.wcb.shadowWebCanvas.clear();
				//this.wcb.shadowWebCanvas.save();
				this.wcb.shadowWebCanvas.merge(this.img,this.x0,this.y0);
				//this.wcb.shadowWebCanvas.restore();
			}
			,"confirm":function(){
				if(this.ing == 1){
					if(confirm("OK?")){
						this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
					}
					this.ing = 0;
					return this.reset();
				}
				return true;
				
			}
			,"reset":function(type){
				//console.log("reset");
				if(this.wcb){
					this.wcb.node.style.cursor = "";
					this.ing = 0;
					this.wcb.shadowWebCanvas.clear();
					this.wcb = null;
				}
				return true;
			}
		}
	}
	return r;
}();