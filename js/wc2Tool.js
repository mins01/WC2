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
			var evt = event.originalEvent?event.originalEvent:event;
			// $("#dev_text").text(":1"+evt.type+":"+evt.pointerType);
			this.isDown=1;
			//에러는 init에서 이미 체크했다.
			return this[toolName].down(evt);
		}
		,"onMove":function(toolName,event){
			var evt = event.originalEvent?event.originalEvent:event;
			if(this.isDown==0 && !this[toolName].ignoreIsDown){ return false;}
			//에러는 init에서 이미 체크했다.
			return this[toolName].move(evt);
		}
		,"onUp":function(toolName,event){
			var evt = event.originalEvent?event.originalEvent:event;

			if(this.isDown==0 && !this[toolName].ignoreIsDown){ return false;}
			this.isDown = 0;
			//에러는 init에서 이미 체크했다.
			return this[toolName].up(evt);
		}
		,"end":function(toolName){
			//에러는 init에서 이미 체크했다.
			return this[toolName].end();
		}
		,"predraw":function(toolName,wcb){
			//에러는 init에서 이미 체크했다.
			this[toolName].wcb = wcb;
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
		,"initPreview":function(toolName){ //특정 툴에서만 있다. 위치를 초기화시킨다.
			if(!toolName || !this[toolName].initPreview){ return false;}
			return this[toolName].initPreview();
		}
		,"onMouseWheel":function(toolName,event){ //여기만 mouse를 나타내는 이유는 다른것들은 터치 이벤트와 공통으로 사용하기 때문.
			//에러는 init에서 이미 체크했다.
			var evt = event.originalEvent?event.originalEvent:event;
			if(!toolName || !this[toolName].mousewheel){ return false;}
			return this[toolName].mousewheel(evt);
		}
		,"saveHistory":function(){
			wc2.saveHistory("Tool."+this.lastToolName+":"+wc2.activeWcb.activeWebCanvas.label);
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
				if(this.wcb){
					this.wcb.shadowWebCanvas.clear();
				}
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
				//console.log(this.step);
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
			,"_move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.pos.push([t.x,t.y])
				this.predraw();
				//console.log("move");
				return true;
			}
			,"move":function(event){
				var evts = ('getCoalescedEvents' in event)?event.getCoalescedEvents():[event];
				for(var i=0,m=evts.length;i<m;i++){
					this._move(evts[i]);
				}
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
		}//-- end fn
		//-- 지우개
		,"eraser":{
			"wcb":null
			,"x0":-1,"y0":-1
			,"ing":0
			,"lastLen":0
			,"init":function(wcb){
				//this.wcb = wcb;
				this.lastLen = 0;
				this.brushIMG = wc2.eraserIMG;
				return true;
			}
			,"end":function(){
				this.wcb.shadowWebCanvas.clear();
				$(this.wcb.activeWebCanvas).removeClass("WC-hidden");
				wc2Tool.saveHistory();
				return true;
			}
			,"down":function(event){
				var pressureDimeter = (event.pointerType=='pen')?wc2.brush4Eraser.calculatePressureDimeter(event.pressure):1; //압력감지, 팬일 경우만
				var pressureAlpha = (event.pointerType=='pen')?wc2.brush4Eraser.calculatePressureAlpha(event.pressure):1; //압력감지, 팬일 경우만

				$(this.wcb.activeWebCanvas).addClass("WC-hidden");
				this.wcb.shadowWebCanvas.copyImageData(this.wcb.activeWebCanvas);
				this.wcb.shadowWebCanvas.configContext2d({"globalCompositeOperation":"destination-out"});
				this.ing = 1;

				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.wcb.shadowWebCanvas.beginBrush(t.x,t.y,wc2.brush4Eraser.brushWC,wc2.brush4Eraser.spacing,pressureDimeter,pressureAlpha);

				return true;
			}
			,"_move":function(event){
				var pressureDimeter = (event.pointerType=='pen')?wc2.brush4Eraser.calculatePressureDimeter(event.pressure):1; //압력감지, 팬일 경우만
				var pressureAlpha = (event.pointerType=='pen')?wc2.brush4Eraser.calculatePressureAlpha(event.pressure):1; //압력감지, 팬일 경우만
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);

				this.wcb.shadowWebCanvas.drawBrush(t.x,t.y,pressureDimeter,pressureAlpha);
				return true;
			}
			,"move":function(event){
				var evts = ('getCoalescedEvents' in event)?event.getCoalescedEvents():[event];
				for(var i=0,m=evts.length;i<m;i++){
					this._move(evts[i]);
				}
				return true;
			}
			,"up":function(event){
				this.wcb.shadowWebCanvas.endBrush();
				this.wcb.activeWebCanvas.copyImageData(this.wcb.shadowWebCanvas);
				this.end();
				return true;
			}
			,"predraw":function(){

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
			,"ing":0
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
				this.ing = 1;
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
				this.ing = 0;
				//this.predraw();
				this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				console.log("up");
				this.end();
				return true;
			}
			,"predraw":function(){
				if(this.ing == 0){return false;}
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
			,"tf":null
			,"init":function(wcb){
				this.tf = document.formPropTransformProperty;
				this.predraw();
				return true;
			}
			,"_initXYWH":function(){ //계산이 두번 같은 걸 하기에...
				this.dw = this.wcb.width; //기준 너비
				this.dh =  this.wcb.height; //기준 높이
				this.w0 = this.dw;
				this.h0 = this.dh;
				//this.x0 = (this.wcb.width-this.w0)/2;
				this.tf.x0.value = (this.wcb.width-this.w0)/2;
				//this.y0 = (this.wcb.height-this.h0)/2;
				this.tf.y0.value = (this.wcb.height-this.h0)/2;
				//this.sc = 1;
				this.tf.sc.value = 1;
				//this.deg = 0;
				this.tf.deg.value = 0;

			}
			,"end":function(){
				return true;
			}
			,"_scale":function(deltaY){
				var sc = parseFloat(this.tf.sc.value) + (deltaY/50);
				sc = Math.min(100,Math.max(0.01,sc)).toFixed(2); //0.1 ~ 10 배까지 가능하도록
				this.tf.sc.value = sc;
				// var w = this.dw * sc;
				// var h = this.dh * sc;
				// this.x0 += (this.w0-w)/2;
				// this.y0 += (this.h0-h)/2;
				// this.w0  = w;
				// this.h0  = h;
			}
			,"_rotate":function(deltaY){
				var deg = parseFloat(this.tf.deg.value) -1*deltaY; //아래로 휠을 돌리면 시계반향으로 돌아가게 -1을 곱함
				//this.deg += deg;
				this.tf.deg.value = deg;
			}
			,"mousewheel":function(event){
				if(this.ing == 0){ return false; }
				//console.log(event.deltaX, event.deltaY, event.deltaFactor);
				if(event.altKey){ //rotate
					this._rotate(event.deltaY);
				}else{ //scale
					this._scale(event.deltaY);
				}
				this.predraw();
				//console.log(this.sc);
				return true;
			}
			,"down":function(event){
				if(this.ing ==0){
					//this.wcb = wcb;
					$(this.wcb.activeWebCanvas).addClass("WC-hidden");
					this.wcb.shadowWebCanvas.copyImageData(this.wcb.activeWebCanvas);
					this._initXYWH();
				}
				this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				console.log("init")
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.tf.x0.value = parseFloat(this.tf.x0.value) + t.x-this.x1;
				this.tf.y0.value = parseFloat(this.tf.y0.value) + t.y-this.y1;
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
				var x0 = parseFloat(this.tf.x0.value)
				var y0 = parseFloat(this.tf.y0.value)
				var sc = parseFloat(this.tf.sc.value)
				var deg = parseFloat(this.tf.deg.value)

				if(sc == 1 && deg == 0){
					this.wcb.shadowWebCanvas.clear();
					this.wcb.shadowWebCanvas.copyImageData(this.wcb.activeWebCanvas,x0,y0);
				}else{
					this.wcb.shadowWebCanvas.clear();
					var rotateCenterX = (this.dw)/2
					var rotateCenterY = (this.dh)/2
					this.wcb.shadowWebCanvas.setScale(sc,sc);
					//var t = this.wcb.shadowWebCanvas.getRotateXY(this.deg,this.x0/this.sc,this.y0/this.sc);
					var t = this.wcb.shadowWebCanvas.getRotateXY(deg,x0/sc,y0/sc);
					this.wcb.shadowWebCanvas.setRotate(deg,rotateCenterX,rotateCenterY)
					//this.wcb.shadowWebCanvas.merge(this.img,t.x,t.y);
					this.wcb.shadowWebCanvas.copyWithoutOpacity(this.wcb.activeWebCanvas,t.x,t.y);
					this.wcb.shadowWebCanvas.resetRotate()
					this.wcb.shadowWebCanvas.resetScale();
				}
			}
			,"confirm":function(noQ){
				if(this.ing == 1){
					if(noQ || confirm("OK?")){
						this.wcb.activeWebCanvas.copyImageData(this.wcb.shadowWebCanvas);
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
					this.ing = 0;
					this.wcb.shadowWebCanvas.clear();
					$(this.wcb.activeWebCanvas).removeClass("WC-hidden");

				}
				return true;
			}
			,"initPreview":function(){
				// if(this.ing ==1){
					this._initXYWH();
					this.predraw();
				// }
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
			,"f":null
			,"init":function(wcb){
				this.tf = document.formPropTransformProperty;
				this.img  = document.getElementById('imageNode');
				this.img.onload = function(toolImage){
					return function(){
						toolImage._initXYWH();
						toolImage.predraw()
					}
				}(this);

				if(this.ing ==0){
					this.ing = 1;
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
				//this.x0 = (this.wcb.width-this.w0)/2;
				this.tf.x0.value = (this.wcb.width-this.w0)/2;
				//this.y0 = (this.wcb.height-this.h0)/2;
				this.tf.y0.value = (this.wcb.height-this.h0)/2;
				//this.sc = 1;
				this.tf.sc.value = 1;
				//this.deg = 0;
				this.tf.deg.value = 0;
			}
			,"end":function(){
				return true;
			}
			,"_scale":function(deltaY){
				return wc2Tool.transform._scale.call(this,deltaY);
			}
			,"_rotate":function(deltaY){
				return wc2Tool.transform._rotate.call(this,deltaY);
			}
			,"mousewheel":function(event){
				if(this.ing == 0){ return false; }
				//console.log(event.deltaX, event.deltaY, event.deltaFactor);
				if(event.altKey){ //rotate
					//wc2Tool.transform._rotate.call(this,event.deltaY);
					this._rotate(event.deltaY);
				}else{ //scale
					//wc2Tool.transform._scale.call(this,event.deltaY);
					this._scale(event.deltaY);
				}
				this.predraw();
				//console.log(this.sc);
			}
			,"down":function(event){
				//this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x1 = t.x;
				this.y1 = t.y;
				this.predraw();
				return true;
			}
			,"move":function(event){
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				//this.x0 += t.x-this.x1;
				//this.y0 += t.y-this.y1;
				this.tf.x0.value = parseFloat(this.tf.x0.value) + t.x-this.x1;
				this.tf.y0.value = parseFloat(this.tf.y0.value) + t.y-this.y1;
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
				var x0 = parseFloat(this.tf.x0.value)
				var y0 = parseFloat(this.tf.y0.value)
				var sc = parseFloat(this.tf.sc.value)
				var deg = parseFloat(this.tf.deg.value)

				this.wcb.shadowWebCanvas.clear();
				var rotateCenterX = (this.dw)/2
				var rotateCenterY = (this.dh)/2
				this.wcb.shadowWebCanvas.setScale(sc,sc);
				//var t = this.wcb.shadowWebCanvas.getRotateXY(this.deg,this.x0/this.sc,this.y0/this.sc);
				var t = this.wcb.shadowWebCanvas.getRotateXY(deg,x0/sc,y0/sc);
				this.wcb.shadowWebCanvas.setRotate(deg,rotateCenterX,rotateCenterY)
				this.wcb.shadowWebCanvas.merge(this.img,t.x,t.y);
				this.wcb.shadowWebCanvas.resetRotate()
				this.wcb.shadowWebCanvas.resetScale();
			}
			,"confirm":function(noQ){
				if(noQ || confirm("OK?")){
					this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
					wc2Tool.saveHistory();
					//this.ing = 0;
				}
				return true;

			}
			,"reset":function(type){
				if(this.ing ==1){
					if(confirm("Not Confirm! Confirm OK?")){
						var r = this.confirm(true);
						this.end;
						return r;
					}else{
						this.ing = 0;
						if(this.wcb){
							this.wcb.shadowWebCanvas.clear();
						}
					}
				}
				return true;
			}
			,"initPreview":function(){
				if(this.ing ==1){
					this._initXYWH();
					this.predraw();
				}
				return true;
			}
		} //-- end fn
		//--- 이미지
		//-- 사용 후 로컬(file://)에서는 에러날 수 있다. (Uncaught SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.)
		,"image2":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"w0":-1,"h0":-1
			,"dw":-1,"dh":-1,"sc":1 //확대관련
			,"deg":0//회전관련(각도)
			,"ing":0
			,"f":null
			,"sa":null
			,"initSelectArea":function(){
				var f = document.formPropImage;
				if(!this.sa){
					this.sa = SelectArea(this.wcb.activeWebCanvas,this.wcb.wcbFrame)
					this.sa.className +=" selectArea-no-info selectArea-pointer-xs"
					var wcb = this.wcb;
					this.sa.addEventListener('change',function(tool_image){ return function(evt){ // 커스텀 이벤트
						var r = this.getSelectedAreaRect()
						var f = document.formPropImage;
						var z = wcb.zoom;
						f.left.value = r.left/z;
						f.top.value = r.top/z;
						f.right.value = r.right/z;
						f.bottom.value = r.bottom/z;
						tool_image.predrawOnlyImage()
						// console.log('SelectArea',evt.type);
					}}(this));
					this.sa.addEventListener('hide',function(tool_image){ return function(evt){ // 커스텀 이벤트
						tool_image.predrawOnlyImage()
						// console.log('SelectArea',evt.type);
					}}(this));
					this.sa.selectedArea.addEventListener("dblclick",function(tool_image){
						return function(evt){
							tool_image.confirm();
						}
					}(this));
				}else{
					this.sa.setTarget(this.wcb.activeWebCanvas,this.wcb.wcbFrame);
				}
				this.sa.selectedArea.style.opacity = f.globalAlpha.value;
				return this.sa;
			}
			,"init":function(wcb){
				this.initSelectArea();
				this.tf = document.formPropTransformProperty;
				this.img  = document.getElementById('imageNode');
				this.img.onload = function(tool_image){
					return function(){
								tool_image.predrawOnlyImage()
					}
				}(this);
				this.sa.enable();
				this.sa.hide();
				if(this.ing ==0){
					this.ing = 1;
				}

				return true;
			}
			,"end":function(){
				return true;
			}
			,"down":function(event){
				this.sa.enable();
				return true;
			}
			,"move":function(event){
				return true;
			}
			,"up":function(event){
				return true;
			}
			,"predraw":function(){
				var f = document.formPropImage;
				var z = this.wcb.zoom;
				var r = this.sa.getSelectedAreaRect()
				this.sa.drawFromCoordinate(parseFloat(f.left.value,10)*z,parseFloat(f.top.value,10)*z,parseFloat(f.right.value,10)*z,parseFloat(f.bottom.value,10)*z);
				// this.sa.selectedArea.style.opacity = f.globalAlpha.value;
				// this.predrawOnlyImage(); //onchange 에서 처리되니깐 할 필요 없음
			}
			,"predrawOnlyImage":function(){
				var f = document.formPropImage;
				var z = this.wcb.zoom;
				var r = this.sa.getSelectedAreaRect()
				var swc = this.wcb.shadowWebCanvas;
				var img = this.img;
				if(this.sa.isShow()){
					setTimeout(function(){
						swc.saveContext2d();
						swc.clear();
						// swc.configContext2d({"globalAlpha":f.globalAlpha.value,"imageSmoothingEnabled":false,"imageSmoothingQuality":'high'})
						swc.configContext2d({"globalAlpha":f.globalAlpha.value,"imageSmoothingEnabled":(f.imageSmoothingEnabled.value=="1"),"imageSmoothingQuality":f.imageSmoothingQuality.value})
						// console.log(swc.context2d.imageSmoothingQuality);
						swc.drawImage(img,r.left/z,r.top/z,r.width/z,r.height/z );
						swc.restoreContext2d();
					},0)	
				}else{
					swc.clear();
				}
				// console.log(this.img,r.left/z,r.top/z,r.width/z,r.height/z )
			}
			,"fitCanvas":function(){
				var w = this.wcb.activeWebCanvas
				var f = document.formPropImage;
				f.left.value=0;
				f.top.value=0;
				f.right.value=w.width;
				f.bottom.value=w.height;
				this.predraw();
			}
			,"draw":function(){
				var f = document.formPropImage;
				var r = this.sa.getSelectedAreaRect()
				var z = this.wcb.zoom;
				this.wcb.activeWebCanvas.saveContext2d();
				// this.wcb.activeWebCanvas.configContext2d({"globalAlpha":f.globalAlpha.value,"imageSmoothingEnabled":true,"imageSmoothingQuality":'high'})
				// this.wcb.activeWebCanvas.drawImage(this.img,r.left/z,r.top/z,r.width/z,r.height/z );
				this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				this.wcb.activeWebCanvas.restoreContext2d();
				this.wcb.shadowWebCanvas.clear();
			}
			,"confirm":function(noQ){

				if(noQ || confirm("OK?")){
					// this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
					this.draw();
					this.sa.hide();
					wc2Tool.saveHistory();
					this.ing = 0;
					console.log("confirm")
				}
				return true;

			}
			,"reset":function(type){
				var r = true;
				if(this.ing ==1){
					if(!this.sa.isShow()){
						this.ing = 0;
					}else if(confirm("Not Confirm! Confirm OK?")){
						r = this.confirm(true);
					}
				}
				this.ing = 0;
				this.wcb.shadowWebCanvas.clear();
				this.sa.disable();
				return r;
			}
			,"initPreview":function(){
				if(this.ing ==1){
					this.sa.hide();
				}
				return true;
			}
		} //-- end fn
		//--- 집중선 - 방사형
		,"concentratedLineRadial":{
			"wcb":null
			,"ctx":null
			,"deg":0//회전관련(각도)
			,"ing":0
			,"f":null
			,"init":function(wcb){
				this.f = document.formPropConcentratedLineRadial;
				this.f2 = document.formPropConcentratedLineRadialColorStops;
				this.ctx = this.wcb.shadowWebCanvas.context2d;
				if(this.ing ==0){
					this.ing = 1;
					this._initXYWH();
					this.predraw();
				}

				return true;
			}
			,"_initXYWH":function(){ //계산이 두번 같은 걸 하기에...
				this.f.x.min = -2*this.wcb.width
				this.f.x.max = 2*this.wcb.width
				this.f.x.value = this.wcb.width/2

				this.f.y.min = -2*this.wcb.height
				this.f.y.max = 2*this.wcb.height
				this.f.y.value = this.wcb.height/2

				this.f.lineLength.min = 1
				this.f.lineLength.max = Math.round(Math.sqrt(Math.pow(this.wcb.width,2)+Math.pow(this.wcb.height,2)))*2
				this.f.lineLength.value = this.f.lineLength.max/4

			}
			,"end":function(){
				return true;
			}
			,"down":function(event){
				//this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.f.x.value = t.x
				this.f.y.value = t.y
				this.predraw();
				return true;
			}
			,"move":function(event){
				this.down(event);
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
				// ctx.lineWidth = parseFloat(f.lineWidth.value);
				var x = parseFloat(this.f.x.value);
				var y = parseFloat(this.f.y.value);
				var multi = parseFloat(this.f.multi.value);
				var lineLength = parseFloat(this.f.lineLength.value);
				// var strokeStyle = null;



				var colorset = wc2Helper.string2Colorset(this.ctx.strokeStyle);
				// console.log(this.ctx.strokeStyle,colorset);
				// colorset2String
				console.log(colorset);

				var addColorStops = []

				addColorStops.push([this.f2.colorStops_pos1.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity1.value])]);
				addColorStops.push([this.f2.colorStops_pos2.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity2.value])]);
				addColorStops.push([this.f2.colorStops_pos3.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity3.value])]);
				addColorStops.push([this.f2.colorStops_pos4.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity4.value])]);


		    var strokeStyle = ConcentratedLine.createRadialGradient(this.ctx,addColorStops);

				ConcentratedLine.radial(this.ctx,x,y,multi,lineLength,strokeStyle);
			}
			,"confirm":function(noQ){
				if(noQ || confirm("OK?")){
					this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
					wc2Tool.saveHistory();
					//this.ing = 0;
				}
				return true;

			}
			,"reset":function(type){
				if(this.ing ==1){
					if(confirm("Not Confirm! Confirm OK?")){
						var r = this.confirm(true);
						this.end;
						return r;
					}else{
						this.ing = 0;
						if(this.wcb){
							this.wcb.shadowWebCanvas.clear();
						}
					}
				}
				return true;
			}
			,"initPreview":function(){
				if(this.ing ==1){
					this._initXYWH();
					this.predraw();
				}
				return true;
			}
		} //-- end fn
		//--- 집중선 - 선형
		,"concentratedLineLinear":{
			"wcb":null
			,"ctx":null
			,"deg":0//회전관련(각도)
			,"ing":0
			,"f":null
			,"init":function(wcb){
				this.f = document.formPropConcentratedLineLinear;
				this.f2 = document.formPropConcentratedLineLinearColorStops;
				this.ctx = this.wcb.shadowWebCanvas.context2d;
				if(this.ing ==0){
					this.ing = 1;
					this._initXYWH();
					this.predraw();
				}

				return true;
			}
			,"_initXYWH":function(){ //계산이 두번 같은 걸 하기에...
				this.f.x.min = -2*this.wcb.width
				this.f.x.max = 2*this.wcb.width
				// this.f.x.value = this.wcb.width/2

				this.f.y.min = -2*this.wcb.height
				this.f.y.max = 2*this.wcb.height
				// this.f.y.value = this.wcb.height/2

				this.f.lineLength.min = 1
				this.f.lineLength.max = Math.round(Math.sqrt(Math.pow(this.wcb.width,2)+Math.pow(this.wcb.height,2)))*2
				this.f.lineLength.value = this.f.lineLength.max/2

			}
			,"end":function(){
				return true;
			}
			,"down":function(event){
				//this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.f.x.value = t.x
				this.f.y.value = t.y
				this.predraw();
				return true;
			}
			,"move":function(event){
				this.down(event);
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
				// ctx.lineWidth = parseFloat(f.lineWidth.value);
				var x = parseFloat(this.f.x.value);
				var y = parseFloat(this.f.y.value);
				var multi = parseFloat(this.f.multi.value);
				var lineLength = parseFloat(this.f.lineLength.value);
				var gapY = parseFloat(this.f.gapY.value);
				var deg = parseFloat(this.f.deg.value);
				// var strokeStyle = null;



				var colorset = wc2Helper.string2Colorset(this.ctx.strokeStyle);
				// console.log(this.ctx.strokeStyle,colorset);
				// colorset2String
				console.log(colorset);

				var addColorStops = []

				addColorStops.push([this.f2.colorStops_pos1.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity1.value])]);
				addColorStops.push([this.f2.colorStops_pos2.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity2.value])]);
				addColorStops.push([this.f2.colorStops_pos3.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity3.value])]);
				addColorStops.push([this.f2.colorStops_pos4.value,wc2Helper.colorset2String([colorset[0],colorset[1],colorset[2],this.f2.colorStops_opacity4.value])]);


				var strokeStyle = ConcentratedLine.createLinearGradient(this.ctx,addColorStops);

				ConcentratedLine.linear(this.ctx,x,y,multi,lineLength,gapY,deg,strokeStyle);
			}
			,"confirm":function(noQ){
				if(noQ || confirm("OK?")){
					this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
					wc2Tool.saveHistory();
					//this.ing = 0;
				}
				return true;

			}
			,"reset":function(type){
				if(this.ing ==1){
					if(confirm("Not Confirm! Confirm OK?")){
						var r = this.confirm(true);
						this.end;
						return r;
					}else{
						this.ing = 0;
						if(this.wcb){
							this.wcb.shadowWebCanvas.clear();
						}
					}
				}
				return true;
			}
			,"initPreview":function(){
				if(this.ing ==1){
					this._initXYWH();
					this.predraw();
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
			,"f":null
			,"textNode":null
			,"init":function(wcb){
				this.tf = document.formPropTransformProperty;
				this.textNode  = document.getElementById('textareaText');

				if(this.ing ==0){
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
				this.tf.x0.value = (this.wcb.width-this.w0)/2;
				this.tf.y0.value = (this.wcb.height-this.h0)/2;
				this.tf.sc.value = 1;
				this.tf.deg.value = 0;
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
				this.tf.x0.value = parseFloat(this.tf.x0.value) + t.x-this.x1;
				this.tf.y0.value = parseFloat(this.tf.y0.value) + t.y-this.y1;
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
				var x0 = parseFloat(this.tf.x0.value)
				var y0 = parseFloat(this.tf.y0.value)
				var sc = parseFloat(this.tf.sc.value)
				var deg = parseFloat(this.tf.deg.value)

				this.wcb.shadowWebCanvas.clear();
				var rotateCenterX = (this.dw)/2
				var rotateCenterY = (this.dh)/2
				this.wcb.shadowWebCanvas.setScale(sc,sc);
				var t = this.wcb.shadowWebCanvas.getRotateXY(deg,x0/sc,y0/sc);
				this.wcb.shadowWebCanvas.setRotate(deg,rotateCenterX,rotateCenterY)
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
					this.ing = 0;
					this.wcb.shadowWebCanvas.clear();

				}
				return true;
			}
			,"initPreview":function(){
				if(this.ing ==1){
					this._initXYWH();
					this.predraw();
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
				if(!this.wcb){return false;}
				this.move(event);
				$("#divSelectedColorSpuit").css("backgroundColor",this.colorStyle);
				$("#divSelectedColorSpuit").text(this.colorStyle)
				return true;
			}
			,"move":function(event){
				if(!this.wcb){return false;}
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = t.x;
				this.y0 = t.y;
				this.predraw();
				return true;

			}
			,"up":function(event){
				if(!this.wcb){return false;}
				this.predraw();
				this.end();
				wc2.setSpuitColorTo('stroke');
				return true;
			}
			,"predraw":function(){
				var colorset = this.wcb.pickupColor(this.x0,this.y0);
				this.colorStyle = this.wcb.shadowWebCanvas.colorset2String(colorset);
				if(this.colorStyle=== false){return true;}
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
		//-- 브러쉬
		,"brush":{
			"wcb":null
			,"ing":0
			,"lastLen":0
			,"init":function(){
				this.ing = 1;
				// wc2.brush4Brush;
				return true;
			}
			,"end":function(){

				this.ing = 0;
				//-- 쉐도우 캔퍼스 사용시
				// this.wcb.shadowWebCanvas.clear();
				//-- 바로 캔버스에 그릴 경우

				wc2Tool.saveHistory();
				return true;
			}
			,"down":function(event){
				var pressureDimeter = (event.pointerType=='pen')?wc2.brush4Brush.calculatePressureDimeter(event.pressure):1; //압력감지, 팬일 경우만
				var pressureAlpha = (event.pointerType=='pen')?wc2.brush4Brush.calculatePressureAlpha(event.pressure):1; //압력감지, 팬일 경우만

				// $("#dev_text").text(evt.pointerType+":"+pressure);

				this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				//-- 쉐도우 캔퍼스 사용시
				// this.wcb.shadowWebCanvas.clear();
				// this.wcb.shadowWebCanvas.beginBrush(t.x,t.y,wc2.brush4Brush.brushWC,wc2.brush4Brush.spacing);
				//-- 바로 캔버스에 그릴 경우
				this.wcb.activeWebCanvas.beginBrush(t.x,t.y,wc2.brush4Brush.brushWC,wc2.brush4Brush.spacing,pressureDimeter,pressureAlpha);
				return true;
			}
			,"_move":function(event){
				var pressureDimeter = (event.pointerType=='pen')?wc2.brush4Brush.calculatePressureDimeter(event.pressure):1; //압력감지, 팬일 경우만
				var pressureAlpha = (event.pointerType=='pen')?wc2.brush4Brush.calculatePressureAlpha(event.pressure):1; //압력감지, 팬일 경우만

				// $("#dev_text").text(evt.pointerType+":"+evt.pressure+"-"+pressure+":"+wc2.brush4Brush.disablePressure);
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				//-- 쉐도우 캔퍼스 사용시
				// this.wcb.shadowWebCanvas.drawBrush(t.x,t.y);
				//-- 바로 캔버스에 그릴 경우
				//--
				this.wcb.activeWebCanvas.drawBrush(t.x,t.y,pressureDimeter,pressureAlpha);
				return true;
			}
			,"move":function(event){
				var evts = ('getCoalescedEvents' in event)?event.getCoalescedEvents():[event];
				for(var i=0,m=evts.length;i<m;i++){
					this._move(evts[i]);
				}
				return true;
			}
			,"up":function(event){
				//-- 쉐도우 캔퍼스 사용시
				// this.wcb.shadowWebCanvas.endBrush();
				// this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//-- 바로 캔버스에 그릴 경우
				// console.log("endBrush");
				this.wcb.activeWebCanvas.endBrush();

				this.end();
				return true;
			}
			,"predraw":function(){
			}
		}//-- end fn
		//-- 잘라내기, 크롭, crop
		,"crop2":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"left":-1,"top":-1
			,"left1":-1,"top1":-1
			,"f":null
			,"initSelectArea":function(){
				var f = document.formToolCrop2;
				if(!this.sa){
					this.sa = SelectArea(this.wcb.activeWebCanvas,this.wcb.node)
					this.sa.className +=" selectArea-no-info selectArea-pointer-xs"
					var wcb = this.wcb;
					this.sa.addEventListener('change',function(tool_image){ return function(evt){ // 커스텀 이벤트
						var r = this.getSelectedAreaRect()
						var f = document.formToolCrop2;
						var z = wcb.zoom;
						f.left.value = r.left/z;
						f.top.value = r.top/z;
						f.right.value = r.right/z;
						f.bottom.value = r.bottom/z;
						// tool_image.predrawOnlyImage()
						// console.log('SelectArea',evt.type);
					}}(this));
					this.sa.addEventListener('hide',function(tool_image){ return function(evt){ // 커스텀 이벤트
						// tool_image.predrawOnlyImage()
						// console.log('SelectArea',evt.type);
					}}(this));
					this.sa.selectedArea.addEventListener("dblclick",function(tool_image){
						return function(evt){
							tool_image.confirm();
						}
					}(this));
				}else{
					this.sa.setTarget(this.wcb.activeWebCanvas,this.wcb.node);
				}
				// this.sa.selectedArea.style.opacity = f.globalAlpha.value;
				return this.sa;
			}
			,"init":function(wcb){
				// imageAreaSelect
				this.f = document.formToolCrop2;
				this.initSelectArea();
				this.sa.enable();
				this.sa.hide();
				return true;
			}
			,"end":function(){
				return true;
			}
			,"mousewheel":function(event){
				return true;
			}
			,"down":function(event){
				return true;
			}
			,"move":function(event){
				return true;
			}
			,"up":function(event){
				return true;
			}
			,"predraw":function(){
				var f = this.f
				var z = this.wcb.zoom;
				// var r = this.sa.getSelectedAreaRect()
				this.sa.drawFromCoordinate(parseFloat(f.left.value,10)*z,parseFloat(f.top.value,10)*z,parseFloat(f.right.value,10)*z,parseFloat(f.bottom.value,10)*z);
				return true;
			}
			,"confirm":function(){
				this.reset(1);
				var x = parseInt(this.f.left.value,10), y  = parseInt(this.f.top.value,10);
				var width = parseInt(this.f.right.value,10)-x,height = parseInt(this.f.bottom.value,10)-y;
				if(isNaN(x) ||isNaN(y)  ||isNaN(width)  ||isNaN(height)){
					wc2.setError("tool.crop() : 잘못된 입력값.")
				}else{
					wc2.cmdWcb("crop",x,y,width,height);
				}
			}
			,"reset":function(){
				if(this.sa){
					this.sa.disable();
				}
				return true;
			}
		} //-- end fn
		//-- 패턴
		,"pattern":{
			"wcb":null
			,"x0":-1,"y0":-1,"x1":-1,"y1":-1
			,"w":-1
			,"ing":0
			,"lastLen":0
			,"init":function(){
				this.ing = 1;
				this.lastLen = 0;
				this.brushIMG = wc2.brushIMG;
				return true;
			}
			,"end":function(){
				//console.log("end");
				this.ing = 0;
				this.wcb.shadowWebCanvas.clear();
				$(this.wcb.activeWebCanvas).removeClass("WC-hidden");
				wc2Tool.saveHistory();
				return true;
			}
			,"down":function(event){
				// var pressureDimeter = (event.pointerType=='pen')?wc2.brush4Brush.calculatePressureDimeter(event.pressure):1; //압력감지, 팬일 경우만
				var shadowWebCanvas = this.wcb.shadowWebCanvas;
				$(this.wcb.activeWebCanvas).addClass("WC-hidden");
				//this.wcb.shadowWebCanvas.copyImageData(this.wcb.activeWebCanvas);
				shadowWebCanvas.copyImageData(this.wcb.activeWebCanvas);
				shadowWebCanvas.saveContext2d();
				shadowWebCanvas.configContext2d({"patternImage":document.getElementById("imagePattern"),"disableStroke":1});

				this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				//wc2.brush4Brush.beginBrush(this.wcb.shadowWebCanvas,t.x,t.y);
				//shadowWebCanvas.beginBrush(t.x,t.y,wc2.brush4Brush.brushWC,parseFloat(document.formToolBrush.brushSpacing.value));
				//shadowWebCanvas.beginCircleBrush(t.x,t.y,10,10,document.getElementById('strokeStyle').value);
				var r = document.formToolPattern.width.value/2
				var brushSpacing = document.formToolPattern.brushSpacing.value/2
				shadowWebCanvas.beginCircleBrush(t.x,t.y,r,brushSpacing);

				return true;


				$(this.wcb.activeWebCanvas).addClass("WC-hidden");
				//shadowWebCanvas.copyImageData(this.wcb.activeWebCanvas);
				shadowWebCanvas.copyImageData(this.wcb.activeWebCanvas);
				shadowWebCanvas.saveContext2d();
				shadowWebCanvas.configContext2d({"patternImage":document.getElementById("imagePattern"),"disableStroke":1});


				this.ing = 1;
				this.brushSpacing =  parseFloat(document.formToolPattern.brushSpacing.value);
				this.w =  parseFloat(document.formToolPattern.width.value);
				var w2

				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				this.x0 = this.x1 = t.x;
				this.y0 = this.y1 = t.y;

				var x = this.x0;
				var y = this.y0;
				shadowWebCanvas.circle(this.x0,this.x1,w2);
				this.predraw();
				//console.log("down");
				return true;


				shadowWebCanvas.clear();

				this.ing = 1;
				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				//wc2.brush4Brush.beginBrush(this.wcb.shadowWebCanvas,t.x,t.y);
				// shadowWebCanvas.beginBrush(t.x,t.y,wc2.brush4Brush.brushWC,parseFloat(document.formToolBrush.brushSpacing.value));

				shadowWebCanvas.beginBrush(t.x,t.y,wc2.brush4Brush.brushWC,wc2.brush4Brush.spacing,1);

				return true;
			}
			,"move":function(event){

				var t= wc2.getOffsetXY(event,this.wcb.node,this.wcb.zoom);
				//wc2.brush4Brush.drawBrush(t.x,t.y);
				this.wcb.shadowWebCanvas.drawCircleBrush(t.x,t.y);
				return true;

				return wc2Tool.brush.move.apply(this,arguments);
			}
			,"up":function(event){
				this.wcb.shadowWebCanvas.configContext2d({"patternImage":"","disableStroke":1});
				this.wcb.activeWebCanvas.copyImageData(this.wcb.shadowWebCanvas);
				this.wcb.shadowWebCanvas.restoreContext2d();
				//this.wcb.activeWebCanvas.copy(this.wcb.shadowWebCanvas);
				//this.wcb.activeWebCanvas.merge(this.wcb.shadowWebCanvas);
				//console.log("up");
				this.end();
				return true;
			}

			,"predraw":function(){
				return;
				if(this.ing){

					var xys = this.dotsInLine(this.x0,this.y0,this.x1,this.y1,this.brushSpacing);
					var w2 = this.w/2
					var h2 = this.w/2
					//console.log(xys);
					for(var i=0,m=xys.length;i<m;i++){
						//this.wcb.shadowWebCanvas.drawImage(this.brushIMG,xys[i][0]-w2,xys[i][1]-h2);
						this.wcb.shadowWebCanvas.circle(xys[i][0],xys[i][1],w2);
					}
				}
			}
			,"dotsInLine":function(){
				return wc2Tool.brush.dotsInLine.apply(this,arguments);
			}
		}//-- end fn
	}
	r.brush2 = r.brush;
	r.brush3 = r.brush;
	return r;
}();
