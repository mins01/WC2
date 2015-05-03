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
		,"isDown":0 //down이벤트가 발생되었는지 체크용.
		//-- 제어용 함수 흐름 :  init -> onDown -> onMove -> onUp -> end
		//-- ETC : predraw,onScroll
		,"init":function(toolName){
			if(!this[toolName]){
				this.error = "wc2Tool.init : "+toolName+"라는 툴이 지원되지 않습니다.";
				return false;
			}
			if(this.lastToolName != toolName && this[this.lastToolName] && this[this.lastToolName].reset){
				this[this.lastToolName].reset(); //이전 동작에 대한 남겨진 내용을 초기화
			}
			this.lastToolName  = toolName;
			//this[toolName].wcb = wc2.this.activeWcb
			if(wc2.activeWcw){
				this[toolName].wcb = wc2.activeWcw.wcb
			}else if(wc2.activeWcb){
				this[toolName].wcb = wc2.activeWcb
			}else{
				return false;
			}
			return this[toolName].init();
		}
		,"onDown":function(toolName,event){
			this.isDown=1;
			//에러는 init에서 이미 체크했다.
			return this[toolName].down(event);
		}
		,"onMove":function(toolName,event){
			if(this.isDown==0 && !this[toolName].ignoreIsDown){ return false;}
			//에러는 init에서 이미 체크했다.
			return this[toolName].move(event);
		}
		,"onUp":function(toolName,event){
			if(this.isDown==0 && !this[toolName].ignoreIsDown){ return false;}
			this.isDown = 0;
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
		,"onMouseWheel":function(toolName,event){ //여기만 mouse를 나타내는 이유는 다른것들은 터치 이벤트와 공통으로 사용하기 때문.
			//에러는 init에서 이미 체크했다.
			if(!toolName || !this[toolName].mousewheel){ return false;}
			return this[toolName].mousewheel(event);
		}
		,"saveHistory":function(){
			wc2.saveHistory("Tool."+this.lastToolName);
		}
		//-- 라인
		,"line":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"init":function(wcb){
				//this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				wc2Tool.saveHistory();
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
		} //-- end fn
		//-- 곡선
		,"curve":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1,"x2":-1,"y2":-1,"x3":-1,"y3":-1
			,"step":0
			,"ing":false
			,"init":function(wcb){
				if(!this.ing){ this.step = 0; }
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.reset();
				wc2Tool.saveHistory();
				return true;
			}
			,"reset":function(){ 
				this.ing = false;
				this.step = 0
				this.wcb.shadowWebCanvas.clear();
				return true;
			}
			,"down":function(event){
				this.ing = true;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				if(this.step==0){
					this.x0 = t.x;
					this.y0 = t.y;
					this.x1 = t.x;
					this.y1 = t.y;
				}else if(this.step==1){
					this.x2 = t.x;
					this.y2 = t.y;
				}else if(this.step==2){
					this.x3 = t.x;
					this.y3 = t.y;
				}
				this.predraw();
				//console.log("down");
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				if(this.step==0){
					this.x1 = t.x;
					this.y1 = t.y;
				}else if(this.step==1){
					this.x2 = t.x;
					this.y2 = t.y;
				}else if(this.step==2){
					this.x3 = t.x;
					this.y3 = t.y;
				}
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				
				this.predraw();
				if(this.step == 2){
					this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
					this.end();
				}else{
					this.step++;
				}
				return true;
			}
			,"predraw":function(){
				console.log(this.step);
				this.wcb.shadowWebCanvas.clear();
				if(this.step == 0){ //직선.
					this.wcb.shadowWebCanvas.line(this.x0,this.y0,this.x1,this.y1);
				}else if(this.step == 1){ //1단 곡선 quadraticCurveTo
				this.wcb.shadowWebCanvas.curve(this.x0,this.y0,this.x2,this.y2,this.x1,this.y1);
				}else if(this.step == 2){ //3단 곡선 bezierCurveTo
					this.wcb.shadowWebCanvas.curve(this.x0,this.y0,this.x2,this.y2,this.x3,this.y3,this.x1,this.y1);
				}
			}
		} //-- end fn
		//-- 펜
		,"pen":{
			"wcb":null
			,"pos":[]
			,"init":function(wcb){
				//this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				this.pos = [];
				wc2Tool.saveHistory();
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
				//this.wcb = wcb;
				//console.log("init");				
				this.eraserMode = this.wcb.shadowWebCanvas.getConfigContext2d("eraserMode");
				
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
				$(this.wcb.activeWebCanvas).removeClass("WC-hidden");
				wc2Tool.saveHistory();
				return true;
			}
			,"down":function(event){
				$(this.wcb.activeWebCanvas).addClass("WC-hidden");
				this.wcb.shadowWebCanvas.copyWithoutOpacity(this.wcb.activeWebCanvas);
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
				//this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
			wc2Tool.saveHistory();
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
				//this.wcb = wcb;
				//console.log("init");
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.wcb.shadowWebCanvas.clear();
			wc2Tool.saveHistory();
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
		//-- 변형
		,"transform":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"w0":-1,"h0":-1
			,"dw":-1,"dh":-1,"sc":1 //확대관련
			,"deg":0//회전관련(각도)
			,"ing":0
			,"init":function(wcb){
				if(this.ing ==0){
					//this.wcb = wcb;
					$(this.wcb.activeWebCanvas).addClass("WC-hidden");
					this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas);
					this.wcb.node.style.cursor = "move";
					this._initXYWH();
					this.sc = 1;
				}
				return true;
			}
			,"_initXYWH":function(){ //계산이 두번 같은 걸 하기에...
				this.dw = this.wcb.width; //기준 너비
				this.dh =  this.wcb.height; //기준 높이
				this.w0 = this.dw;
				this.h0 = this.dh;
				this.x0 = (this.wcb.width-this.w0)/2;
				this.y0 = (this.wcb.height-this.h0)/2;
				this.sc = 1;
				this.deg = 0;
			}
			,"end":function(){
				return true;
			}
			,"_scale":function(deltaY){
				this.sc +=(deltaY/50);
				this.sc = Math.min(100,Math.max(0.01,this.sc)); //0.1 ~ 10 배까지 가능하도록
				var w = this.dw * this.sc;
				var h = this.dh * this.sc;
				this.x0 += (this.w0-w)/2;
				this.y0 += (this.h0-h)/2;
				this.w0  = w;
				this.h0  = h;
			}
			,"_rotate":function(deltaY){
				var deg = -1*deltaY; //아래로 휠을 돌리면 시계반향으로 돌아가게 -1을 곱함
				this.deg += deg;
			}
			,"mousewheel":function(event){
				if(this.ing == 0){ return false; }
				//console.log(event.deltaX, event.deltaY, event.deltaFactor);
				if(event.altKey){ //rotate
					wc2Tool.transform._rotate.call(this,event.deltaY);
				}else{ //scale
					wc2Tool.transform._scale.call(this,event.deltaY);
				}
				this.predraw();
				//console.log(this.sc);
				return true;
			}
			,"down":function(event){
				this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
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
				this.predraw();
				//this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				/* scale을 사용안할 경우
				this.wcb.shadowWebCanvas.clear();
				var rotateCenterX = (this.w0)/2
				var rotateCenterY = (this.h0)/2
				var t = this.wcb.shadowWebCanvas.getRotateXY(this.deg,this.x0,this.y0);
				this.wcb.shadowWebCanvas.setRotate(this.deg,rotateCenterX,rotateCenterY)
				this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas,t.x,t.y,this.w0,this.h0);
				this.wcb.shadowWebCanvas.resetRotate()
				*/
				this.wcb.shadowWebCanvas.clear();
				var rotateCenterX = (this.dw)/2
				var rotateCenterY = (this.dh)/2
				this.wcb.shadowWebCanvas.setScale(this.sc,this.sc);
				var t = this.wcb.shadowWebCanvas.getRotateXY(this.deg,this.x0/this.sc,this.y0/this.sc);
				this.wcb.shadowWebCanvas.setRotate(this.deg,rotateCenterX,rotateCenterY)
				this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas,t.x,t.y);
				this.wcb.shadowWebCanvas.resetRotate()
				this.wcb.shadowWebCanvas.resetScale();
			}
			,"confirm":function(noQ){
				if(this.ing == 1){
					if(noQ || confirm("OK?")){
						this.wcb.activeWebCanvas.copy(this.wcb.shadowWebCanvas);
						wc2Tool.saveHistory();
					}
					this.ing = 0;
					return this.reset();
				}
				return true;
				
			}
			,"reset":function(){
				//console.log("reset");
				if(this.ing ==1 && confirm("Not Confirm! Confirm OK?")){
					return this.confirm(true);
				}
				if(this.wcb){
					this.wcb.node.style.cursor = "";
					this.ing = 0;
					this.wcb.shadowWebCanvas.clear();
					$(this.wcb.activeWebCanvas).removeClass("WC-hidden");
				
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
			,"dw":-1,"dh":-1,"sc":1 //확대관련
			,"deg":0//회전관련(각도)
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
					//this.wcb = wcb;
					//$(this.wcb.activeWebCanvas).addClass("WC-hidden");
					//this.wcb.shadowWebCanvas.copy(this.wcb.activeWebCanvas);
					this.wcb.node.style.cursor = "move";
					this._initXYWH();
					this.predraw();
				}
				return true;
			}
			,"_initXYWH":function(){ //계산이 두번 같은 걸 하기에...
				this.dw = this.img.naturalWidth; //기준 너비
				this.dh = this.img.naturalHeight; //기준 높이
				this.w0 = this.dw;
				this.h0 = this.dh;
				this.x0 = (this.wcb.width-this.w0)/2;
				this.y0 = (this.wcb.height-this.h0)/2;
				this.sc = 1;
				this.deg = 0;
			}
			,"end":function(){
				return true;
			}
			,"mousewheel":function(event){
				return wc2Tool.move.mousewheel.apply(this,arguments); //동작이 똑같아서 가져다 쓴다.
			}
			,"down":function(event){
				this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
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
				this.predraw();
				//this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				/*
				this.wcb.shadowWebCanvas.clear();
				var rotateCenterX = (this.w0)/2
				var rotateCenterY = (this.h0)/2
				var t = this.wcb.shadowWebCanvas.getRotateXY(this.deg,this.x0,this.y0);
				this.wcb.shadowWebCanvas.setRotate(this.deg,rotateCenterX,rotateCenterY)
				this.wcb.shadowWebCanvas.merge(this.img,t.x,t.y,this.w0,this.h0);
				this.wcb.shadowWebCanvas.resetRotate()
				*/
				this.wcb.shadowWebCanvas.clear();
				var rotateCenterX = (this.dw)/2
				var rotateCenterY = (this.dh)/2
				this.wcb.shadowWebCanvas.setScale(this.sc,this.sc);
				var t = this.wcb.shadowWebCanvas.getRotateXY(this.deg,this.x0/this.sc,this.y0/this.sc);
				this.wcb.shadowWebCanvas.setRotate(this.deg,rotateCenterX,rotateCenterY)
				this.wcb.shadowWebCanvas.merge(this.img,t.x,t.y);
				this.wcb.shadowWebCanvas.resetRotate()
				this.wcb.shadowWebCanvas.resetScale();
			}
			,"confirm":function(noQ){
				if(this.ing == 1){
					if(noQ || confirm("OK?")){
						this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
						wc2Tool.saveHistory();
					}
					this.ing = 0;
					return this.reset();
				}
				return true;
				
			}
			,"reset":function(type){
				if(this.ing ==1 && confirm("Not Confirm! Confirm OK?")){
					return this.confirm(true);
				}
				if(this.wcb){
					this.wcb.node.style.cursor = "";
					this.ing = 0;
					this.wcb.shadowWebCanvas.clear();
				
				}
				return true;
			}
		} //-- end fn
		//--- 텍스트
		,"text":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"w0":-1,"h0":-1
			,"dw":-1,"dh":-1,"sc":1 //확대관련
			,"deg":0//회전관련(각도)
			,"ing":0
			,"textNode":null
			,"init":function(wcb){
				this.textNode  = document.getElementById('textareaText');
				
				if(this.ing ==0){
					this.wcb.node.style.cursor = "move";
					this._initXYWH();
					this.predraw();
				}
				return true;
			}
			,"_initXYWH":function(){ //계산이 두번 같은 걸 하기에...
				var t = this.wcb.shadowWebCanvas.measureText(this.textNode.value)
				this.dw = t.width; //기준 너비
				this.dh = t.height; //기준 높이
				this.w0 = this.dw;
				this.h0 = this.dh;
				this.x0 = (this.wcb.width-this.w0)/2;
				this.y0 = (this.wcb.height-this.h0)/2;
				this.sc = 1;
				this.deg = 0;
			}
			,"end":function(){
				return true;
			}
			,"mousewheel":function(event){
				if(this.ing == 0){ return false; }
				//console.log(event.deltaX, event.deltaY, event.deltaFactor);
				if(event.altKey){ //rotate
					wc2Tool.transform._rotate.call(this,event.deltaY);
				}else{ //scale
					wc2Tool.transform._scale.call(this,event.deltaY);
				}
				this.predraw();
				//console.log(this.sc);
				return true;
			}
			,"down":function(event){
				this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
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
				this.predraw();
				//this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				this.wcb.shadowWebCanvas.clear();
				var rotateCenterX = (this.dw)/2
				var rotateCenterY = (this.dh)/2
				this.wcb.shadowWebCanvas.setScale(this.sc,this.sc);
				var t = this.wcb.shadowWebCanvas.getRotateXY(this.deg,this.x0/this.sc,this.y0/this.sc);
				this.wcb.shadowWebCanvas.setRotate(this.deg,rotateCenterX,rotateCenterY)
				this.wcb.shadowWebCanvas.text(this.textNode.value,t.x,t.y)
				
				this.wcb.shadowWebCanvas.resetRotate()
				this.wcb.shadowWebCanvas.resetScale();
			}
			,"confirm":function(noQ){
				if(this.ing == 1){
					if(noQ || confirm("OK?")){
						this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
						this.ing = 0;
						wc2Tool.saveHistory();
						return this.reset();
					}
				}
				return true;
				
			}
			,"reset":function(type){
				if(this.ing ==1 && confirm("Not Confirm! Confirm OK?")){
					return this.confirm(true);
				}
				if(this.wcb){
					this.wcb.node.style.cursor = "";
					this.ing = 0;
					this.wcb.shadowWebCanvas.clear();
				
				}
				return true;
			}
		} //-- end fn
		//--- 스포이드
		,"spuit":{
			"wcb":null
			,"x0":-1,"y0":-1
			,"colorStyle":"rgba(0,0,0,1)"
			,"ignoreIsDown":1 //isDown 체크하지 않는다.
			,"init":function(wcb){
				//this.wcb = wcb;
				return true;
			}
			,"end":function(){
				return true;
			}
			,"down":function(event){
				this.move(event);
				$("#divSelectedColorSpuit").css("backgroundColor",this.colorStyle);
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = t.x;
				this.y0 = t.y;
				this.predraw();
				return true;
				
			}
			,"up":function(event){
				this.predraw();
				this.end();
				return true;
			}
			,"predraw":function(){
				 var colorset = this.wcb.pickupColor(this.x0,this.y0);
				this.colorStyle = this.wcb.shadowWebCanvas.colorset2String(colorset);
				if(this.colorStyle=== false){return true;}
				//console.log(colorset,this.colorStyle);
				$("#divPreviewColorSpuit").css("backgroundColor",this.colorStyle);
				return true;
			}
			,"reset":function(){ 
			
				return true;
			}
		} //-- end fn
		//--- 이동
		,"move":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"left":-1,"top":-1
			,"left1":-1,"top1":-1
			,"init":function(wcb){
				//this.wcb = wcb;
				this.left = parseFloat(this.wcb.wcbMove.style.left);
				this.top = parseFloat(this.wcb.wcbMove.style.top);
				this.left1 = 0;
				this.top1 = 0;
				return true;
			}
			,"end":function(){
				return true;
			}
			,"mousewheel":function(event){
				var t= wc2.getOffsetXY(event,document.body,1);
				this.left1 += event.deltaX*10
				this.top1 += event.deltaY*10
				this.predraw();
				//console.log(this.sc);
				return true;
			}
			,"down":function(event){
				var t= wc2.getOffsetXY(event,document.body,1);
				this.x0 = t.x;
				this.y0 = t.y;
				this.left = parseFloat(this.wcb.wcbMove.style.left);
				this.top = parseFloat(this.wcb.wcbMove.style.top);
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,document.body,1);

				this.x1 = t.x;
				this.y1 = t.y;
				this.left1 = (this.x1-this.x0);
				this.top1 = (this.y1-this.y0);
				this.predraw();
				//console.log("move");
				return true;
			}
			,"up":function(event){
				//this.predraw();
				this.end();
				return true;
			}
			,"predraw":function(){
				var t = $(this.wcb.wcbMove);
				var l0 = this.left + this.left1
				var h0 = this.top + this.top1
				t.css("left",l0+"px").css("top",h0+"px");
				//console.log((this.x1-this.x0),(this.y1-this.y0),this.left,this.top,l0,h0);
				return true;
			}
			,"confirm":function(){
				var t = $(this.wcb.wcbMove).css("left","0px").css("top","0px");
			}
			,"reset":function(){ 
			
				return true;
			}
		} //-- end fn
	}
	return r;
}();