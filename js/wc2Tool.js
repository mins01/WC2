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
	return {
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
			,"init":function(wcb){
				console.log("init");
				return true;
			}
			,"end":function(){
				console.log("end");
				this.wcb = null;
				return true;
			}
			,"down":function(event){
				console.log("down");
				return true;
			}
			,"move":function(event){
				console.log("move");
				return true;
			}
			,"up":function(event){
				console.log("up");
				this.end();
				return true;
			}
		}
	}
}();