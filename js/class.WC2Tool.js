// JavaScript Document
/**
* class.WC2Tool.js
*/
/*
globalAlpha 와 opacity의 차이
globalAlpha는 그려지는것의 알파값
opacity는 레이어의 알파값(나중에 합쳐질 때 계산되어 합쳐진다)
*/

var WC2Tool = {}
WC2Tool.line = {
	"wcg":null
	,"step":0
	,"init":function(wcg){
		this.wcg = wcg;
		this.context2d = this.wcg.shadowWebCanvas.context2d;
	}
	,"down":function(evt){ //그리기 시작
		this.wcg.shadowWebCanvas.clear();
		var XY = WC2.getXYSet(evt,this.wcg.node,this.wcg.zoom);
		this.hs = [XY[0],XY[1]]

		this.context2d.beginPath();
		this.context2d.moveTo(XY[0],XY[1]);
		this.step = 1;
		console.log(XY);
	}
	,"move":function(evt){ //움직이는중
		if(this.step ==0){ return;}
		this.wcg.shadowWebCanvas.clear();
		var XY = WC2.getXYSet(evt,this.wcg.node,this.wcg.zoom);
		var shiftKey = _M.EVENT.shiftKey(evt);
		
		var context2d = this.context2d;
		//WC.CONTEXT2D.setCfg(this.context2d,this.wcg.context2dCfg);
		context2d.beginPath();
		context2d.moveTo(this.hs[0],this.hs[1]);
		if(shiftKey){ //수직,수평 처리
			if(Math.abs(XY[0]-this.hs[0]) > Math.abs(XY[1]-this.hs[1])){
				context2d.lineTo(XY[0],this.hs[1]);
			}else{
				context2d.lineTo(this.hs[0],XY[1]);
			}
		}else{
			context2d.lineTo(XY[0],XY[1]);
		}
	//	context2d.moveTo(0,0);
	//	context2d.lineTo(50,50);
		context2d.stroke();
		context2d.closePath();
		console.log(XY+"MOVE");
		
	}
	,"up":function(evt){ // 그리기 동작 완료
		if(this.step ==0){ return;}
		var XY = WC2.getXYSet(evt,this.wcg.node,this.wcg.zoom);
		this.confirm();
		console.log(XY+"UP");
		this.step = 0;
	}
	,"confirm":function(){ //그린 내용 적용
		this.wcg.activeWebCanvas.merge(this.wcg.shadowWebCanvas);
		this.wcg.shadowWebCanvas.clear();
	}
	,"cancel":function(){ //적용 취소
	}
}