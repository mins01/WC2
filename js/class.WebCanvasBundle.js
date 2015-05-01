"use strict"
// JavaScript Document
/**
* class.WebCanvasBundle.js
* mins01.com
* 2015-04-22 : create file
* require : class.WebCanvas.js
*/
/*
* # warning
* '공대여자는 이쁘다.'를 나타내야만 사용할 수 있습니다.
*/
/*
globalAlpha 와 opacity의 차이
globalAlpha는 그려지는것의 알파값
opacity는 레이어의 알파값(나중에 합쳐질 때 계산되어 합쳐진다)
*/

function WebCanvasBundle(width,height,colorset){
	//초기형태
	this.init();
	this.create(width,height,colorset);
}
(function(){
	/**
	* canvas에 추가 멤버변수와 메소드를 설정한다. (프로토타입에 넣는건 아니다.)
	*/
	WebCanvasBundle.prototype = {
		"commonConfig":{ //WebCanvasBundle 에서 공용으로 사용가능.
			"limitHistoryLog":20 //언두 로그 제한수
		}
		,"init":function(){
			//-- 멤버변수 초기화
			this.node = null;
			this.width = 100
			this.height = 100
			this.webCanvases = []
			this.activeWebCanvas = null
			this.shadowWebCanvas = null
			this.error = "";
			this.zoom = 1
			this.toolName = ""
			this.context2dCfg = {}
			this.name = "";
			this.tempCounter = 0
			this.historyLog = [];
			this.historyIdx = -1; //-1로 초기화
		}
		,"setError":function(error){
			this.error = error;
			console.log(this.error);
			return this.error;
		}
		,"setName":function(name){
			this.name = name;
			this.node.dataset.wcbName = name;
			return this.name;
		}
		// 너비 높이로 만들기
		,"create":function(width,height,colorset){
			//-- 설정 초기화
			this.width = width;
			this.height = height;
			this.node = document.createElement('div');
			this.node.className = "WCB";
			this.node.wcb = this;
			this.shadowWebCanvas = WebCanvas(this.width,this.height);
			this.shadowWebCanvas.className = "WC WC-shadow";
			this.shadowWebCanvas.alt="쉐도우레이어";
			this.addWebCanvas(colorset);
			//this.initEvent();
			//this.setToolName("line");
			//this.context2dCfg = JSON.parse( JSON.stringify( this.shadowWebCanvas.initContext2dCfg ) );
			this.setName("WCB")
			this.setZoom(1);

		}
		//-- 이미지 객체에서 읽어온다.
		,"openByImage":function(image){
			//이미지 점검
			var w = 0,h=0;
			w = image.naturalWidth!=undefined?image.naturalWidth:(image.width?image.width:0);
			h = image.naturalHeight!=undefined?image.naturalHeight:(image.height?image.height:0);
			if(w==0 || h==0){
				this.setError("대상이 이미지가 아닙니다.");
				return false;
			}
			while(this.webCanvases.length>1){
				this.removeWebCanvasByIndex(1);
			}
			this.resize(w,h);
			console.log(image,w,h);
			this.webCanvases[0].copy(image);
			return this;
		}
		,"setLabel":function(label){
			return this.activeWebCanvas(label);
		}
		,"setZoom":function(zoom){
			if(!isNaN(zoom)){
				this.zoom = zoom;
			}
			//this.node.style.transform="scale("+this.zoom+","+this.zoom+")";
			this.node.style.width = (this.width*zoom)+'px';this.node.style.height = (this.height*zoom)+'px';
		}
		,"_syncNode":function(){
			this.node.innerHTML = "";//내용 초기화
			this.node.style.width = this.width+"px";
			this.node.style.height = this.height+"px";
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				this.node.appendChild(this.webCanvases[i]);
				//var zIndex = (m-i)*10
				var zIndex = i*10
				this.webCanvases[i].style.zIndex = zIndex;
				this.webCanvases[i].dataset.wcbIndex = i;
				this.webCanvases[i].dataset.wcbActive = 0;
			}
			this.activeWebCanvas.dataset.wcbActive = 1;
			this.shadowWebCanvas.style.zIndex = this.activeWebCanvas.dataset.wcbIndex*10+5;
			this.node.appendChild(this.shadowWebCanvas);
			this.setZoom();
			return true;
		}
		//-- undo
		,"saveHistory":function(action){
			//this.historyIdx = (this.historyIdx+1)%this.commonConfig.limitHistoryLog;
			this.historyIdx++;
			this.historyLog.splice(this.historyIdx,this.commonConfig.limitHistoryLog,{"action":action,"data":this.getDataForHistory(),"time":(new Date()).getTime()});
			if(this.historyLog.length > this.commonConfig.limitHistoryLog){
				this.historyLog.splice(0,1);
				this.historyIdx--;
			}
			return this.historyLog.length;
		}
		,"undo":function(){
			if(this.historyIdx<=0){this.setError("더 이상의 히스토리가 없습니다");return;}
			this.putDataForHistory(this.historyLog[--this.historyIdx]);
		}
		,"redo":function(){
			if(this.historyIdx>=(this.historyLog.length-1)){this.setError("더 이상의 히스토리가 없습니다");return;}
			this.putDataForHistory(this.historyLog[++this.historyIdx]);
			
		}
		,"getDataForHistory":function(action){
			var data = [];
			if(this.webCanvases[0].getDataForHistory ==undefined){this.setError("해당 메소드는 지원되지 않습니다.");return false;}
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				data.push(this.webCanvases[i].getDataForHistory());
			}
			return data;
		}
		,"putDataForHistory":function(historyData){
			for(var i=0,m=historyData.data.length;i<m;i++){
				if(!this.webCanvases[i]){ //없으면 레이어 하나를 붇인다.
					this.addWebCanvas();
				}
				this.webCanvases[i].putDataForHistory(historyData.data[i]);
			}
			for(var m=this.webCanvases.length;i<m;i++){
				this.removeWebCanvasByIndex(i);
			}
		}
		//--
		,"removeWebCanvasByIndex":function(idx){
			return this._removeWebCanvas(idx);
		}
		,"removeWebCanvas":function(){
			return this.removeWebCanvasByIndex(this.getIndexAcviceWebCanvas());
		}
		,"_removeWebCanvas":function(idx){	
			if(this.webCanvases.length == 1){
				this.setError( "WebCanvasBundle.removeWebCanvas(): 마지막 요소는 삭제할 수 없습니다.");
				return false
			}
			var actIdx = this.getIndexAcviceWebCanvas();
			this.webCanvases.splice(idx,1);
			if(idx == actIdx){
				var idx2 = Math.max(idx-1,0);
				this.setActiveWebCanvasByIndex(idx2);
			}
			this._syncNode();
			return true;
		}
		,"addWebCanvas":function(colorset){
			var c = WebCanvas(this.width,this.height,colorset);
			c.className = "WC";
			c.setLabel("Layer"+ (++this.tempCounter));
			return this._addWebCanvas(c);
		}
		,"_addWebCanvas":function(c){
			var idx = this.getIndexAcviceWebCanvas();
			this.webCanvases.splice(idx+1,0,c);
			this.setActiveWebCanvas(c);
			return c;
		}
		,"addDuplicateWebCanvas":function(){
			var c = this.activeWebCanvas.clone();
			c.className = "WC";
			c.setLabel(this.activeWebCanvas.alt+"-copy");
			return this._addWebCanvas(c);
		}
		,"mergeDown":function(){
			var idx = this.getIndexAcviceWebCanvas();
			if(idx==0){
				this.setError("WebCanvasBundle.mergeDown() : 최하단 요소는 mergeDown 할 수 없습니다.");
				return false;
			}
			var r = this.activeWebCanvas.mergeTo(this.webCanvases[idx-1]);
			this.removeWebCanvasByIndex(idx-1);
		}
		,"getIndexAcviceWebCanvas":function(){
			if(!this.activeWebCanvas){
				return -1;
			}
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				if( this.webCanvases[i] == this.activeWebCanvas){
					return i;
				}
			}
			this.setError( "WebCanvasBundle.getIndexAcviceWebCanvas(): activeWebCanvas는 어디서 온거야?");
			return false;
		}
		,"setActiveWebCanvas":function(c){
			this.activeWebCanvas = c;
			this._syncContext2d();
			this._syncNode();
			return this.activeWebCanvas;
		}
		,"setActiveWebCanvasByIndex":function(n){
			n = parseInt(n);
			if(n==-1){
				n = this.webCanvases.length-1;
			}
			if(typeof n != "number" || this.webCanvases[n] === undefined){
				this.setError( "WebCanvasBundle.setActiveWebCanvasByIndex() : 숫자만 입력되야합니다.");
			}else{
				this.activeWebCanvas = this.webCanvases[n];
				return this.setActiveWebCanvas(this.webCanvases[n]);
			}
			return false;
		}
		,"resize":function(width,height){
			if(this.execAllWebCanvas("resize",arguments)){
				this.width = width;
				this.height = height;
				this._syncNode();
				return true;
			}
			return false;
		}
		,"crop":function(x0,y0,width,height){
			if(this.execAllWebCanvas("crop",arguments)){
				this.width = width;
				this.height = height;
				this._syncNode();
				return true;
			}
			return true;
		}
		,"rotate90To":function(deg){
			if(deg % 90 !== 0){
				this.setError("WebCanvasBundle.rotate90To() : not support degrees : "+deg);
				return false;
			}
			if(this.execAllWebCanvas("rotate90To",arguments)){
				var n = deg/90;
				if(n%2 == 0){
				}else{ //너비 높이 바꾸기
					var t = this.width;
					this.width = this.height;
					this.height = t;
					this._syncNode();
				}
				return true;
			}
			return false;
		}
		/**
		* 웹캔버스에 일괄 메소드 적용 시
		*/
		,"execWebCanvases":function(method,args){
			if(this.webCanvases[0][method]==undefined){this.setError("해당 메소드는 지원되지 않습니다.");return false;}
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				var r = this.webCanvases[i][method].apply(this.webCanvases[i],args);
				if(r === false){ this.setError( "webCanvases["+i+"]"+this.webCanvases[i].error); return false;}
			}
			return true;
		}
		/**
		* 웹캔버스에 일괄 메소드 적용 시 (쉐도우 캔버스 포함)
		*/
		,"execAllWebCanvas":function(method,args){
			if(!this.execWebCanvases(method,args)){
				return false;
			}
			if(this.shadowWebCanvas[method]==undefined){this.setError("해당 메소드는 지원되지 않습니다.");return false;}
			return this.shadowWebCanvas[method].apply(this.shadowWebCanvas,args);
		}
		/**
		* 활성화된 웹캔버스에 환경설정을 한다.
		*/
		,"configContext2d":function(context2dCfg){
			this.context2dCfg = context2dCfg;
			this._syncContext2d();
		}
		,"_syncContext2d":function(withActiveWebCanvas){
			//기본적으로 shadowWebCanvas 만 설정한다.
			if(withActiveWebCanvas){
				this.activeWebCanvas.configContext2d(this.context2dCfg);
			}
			this.shadowWebCanvas.configContext2d(this.context2dCfg);
		}
		/**
		* 웹캔버스 순서 관련
		*/
		,"moveUpWebCanvasByIndex":function(idx,isDown){
			if(isNaN(idx)) idx = this.getIndexAcviceWebCanvas();
			if(!isDown){
				if(idx+1 > (this.webCanvases.length-1)){
					this.setError( "WebCanvasBundle.moveUpWebCanvasByIndex() : 최상단 입니다.");
					return false;
				}
				return this.changeOrder(idx,idx+1)
			}else{
				if(idx-1 < 0){
					this.setError( "WebCanvasBundle.moveUpWebCanvasByIndex() : 최하단 입니다.");
					return false;
				}
				return this.changeOrder(idx,idx-1)
			}
		}
		,"moveDownWebCanvasByIndex":function(idx){
			if(isNaN(idx)) idx = this.getIndexAcviceWebCanvas();
			return this.moveUpWebCanvasByIndex(idx,true);
		}
		,"changeOrder":function(idx0,idx1){
			var t = this.webCanvases[idx1];
			this.webCanvases[idx1] = this.webCanvases[idx0];
			this.webCanvases[idx0] = t;
			this._syncNode();
			return true;
		}
		,"mergeAll":function(){
			var c = WebCanvas(this.width,this.height);
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				c.merge(this.webCanvases[i]);
			}
			return c
		}
		,"pickupColor":function(x0,y0){
			var c = this.mergeAll()
			return c.pickupColor(x0,y0);
		}
		,"toDataURL":function(type,encoderOptions){
			var useEncoderOptions = false;
			
			if(type && type.toLowerCase){
				type = type.toLowerCase()
			}
			switch(type){
				case null:
				case undefined:
				case 'png':
				case 'image/png':
					type = "image/png";
				break;
				case 'jpg':
				case 'jpeg':
				case 'image/jpeg':
					type = "image/jpeg";
					useEncoderOptions = true;
					if(isNaN(encoderOptions)){encoderOptions=1;}
				break;
				case 'webp':
				case 'image/webp':
					type = "image/webp";
					useEncoderOptions = true;
					if(isNaN(encoderOptions)){encoderOptions=1;}
				break;
				default:
					this.setError("지원되지 않는 mime-type("+type+")입니다.");return false;
				break;
			}
			var c = this.mergeAll()
			var str = c.toDataURL(type,encoderOptions);
			if(str.indexOf(type)== -1 || str.indexOf(type)>10){ //
				//console.log(str);
				this.setError("브라우저에서 지원되지 않는 mime-type("+type+")입니다.");return false;
			}
			return str;
		}
		,"clear":function(){
			var r = this.execWebCanvases("clear",{})
			this.webCanvases[0].clear(1); //마지막 레이어만 색을 칠함
			 return r;
		}
		,"flip":function(){
			return this.execAllWebCanvas("flip",arguments)
		}
	}
})();