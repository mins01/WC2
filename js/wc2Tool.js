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
		//-- 제어용 함수. init -> down -> move -> up -> end
		,"init":function(toolName,wcb){
			if(!this[toolName]){
				this.error = "wc2Tool.init : "+toolName+"라는 툴이 지원되지 않습니다.";
				return false;
			}
			return this[toolName].init(wcb);
		}
		,"down":function(toolName,event){
			//에러는 init에서 이미 체크했다.
			return this[toolName].down(event);
		}
		,"move":function(toolName,event){
			//에러는 init에서 이미 체크했다.
			return this[toolName].move(event);
		}
		,"up":function(toolName,event){
			//에러는 init에서 이미 체크했다.
			return this[toolName].up(event);
		}
		,"end":function(toolName){
			//에러는 init에서 이미 체크했다.
			return this[toolName].end();
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
			,"init":function(wcb){
				this.wcb = wcb;
				//console.log("init");				
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
				this.wcb.shadowWebCanvas.line(this.x0,this.y0,this.x1,this.y1);
			}
		}
	}
	return r;
}();