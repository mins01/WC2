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
			var _name = "";
			Object.defineProperty(this, 'name', {
				get:function(){ return _name; },
				set:function(wcb){
						return function(newValue){
							_name = newValue;
							wcb._setName();
					}
				}(this),
				enumerable: true,
				configurable: false
			});

			this.tempCounter = 0
			this.historyLog = [];
			this.historyIdx = -1; //-1로 초기화
		}
		,"setError":function(error){
			this.error = error;
			console.log(this.error);
			return this.error;
		}
		,"_setName":function(){
			this.node.setAttribute('data-wcb-name',this.name);
			return this.name;
		}
		,"setName":function(name){
			return this.name = name;
		}
		// 너비 높이로 만들기
		,"create":function(width,height,colorset){
			//-- 설정 초기화
			this.width = width;
			this.height = height;
			this.outNode = document.createElement('div');
			this.outNode.className = "WCB-box";
			this.node = document.createElement('div');
			this.node.className = "WCB";
			this.nodeGuide = document.createElement('div');
			this.nodeGuide.setAttribute('data-guide',0);
			this.nodeGuide.className="WCB-guide";
			this.node.appendChild(this.nodeGuide)
			this.outNode.appendChild(this.node);
			this.node.wcb = this;
			this.shadowWebCanvas = WebCanvas(this.width,this.height);
			this.shadowWebCanvas.className = "WC WC-shadow";
			this.shadowWebCanvas.node.className = "WC-node WC-node-shadow";
			this.shadowWebCanvas.setLabel("shadow");
			this.addWebCanvas(colorset);
			//this.initEvent();
			//this.setToolName("line");
			//this.context2dCfg = JSON.parse( JSON.stringify( this.shadowWebCanvas.initContext2dCfg ) );
			this.name="WCB";
			this.setZoom(1);
			this.guideLine(0)

		}
		//가이드 설정
		,"guideLine":function(n){
			if(n==undefined){

			}else{
				n = parseInt(n)
				console.log(n);
				var n2 = n/2;
				var px = Math.ceil(n/256)+'px'
				var px2 = (Math.ceil(n/256)+1)+'px'
				// this.nodeGuide.style.backgroundImage = "linear-gradient(0deg,transparent "+(n2-1)+"px,#999 "+(n2-1)+"px,#999 "+(n2+1)+"px,transparent "+(n2+1)+"px ),linear-gradient(90deg,transparent "+(n2-1)+"px,#999 "+n2+"px,transparent "+(n2+1)+"px )"
				this.nodeGuide.style.backgroundImage = "linear-gradient(0deg,transparent "+(n2-1)+"px,#999 "+(n2-1)+"px,#999 "+(n2+1)+"px,transparent "+(n2+1)+"px ),linear-gradient(90deg,transparent "+(n2-1)+"px,#999 "+(n2-1)+"px,#999 "+(n2+1)+"px,transparent "+(n2+1)+"px )"
				// this.nodeGuide.style.backgroundImage = "linear-gradient(0deg,transparent calc(50% - "+px+"),#999  calc(50% - "+px+"),#999 calc(50% + "+px+") ,transparent calc(50% + "+px2+") ),linear-gradient(90deg,transparent calc(50% - "+px+"),#999  50%,transparent calc(50% + "+px+"))"
				this.nodeGuide.style.backgroundSize=n+"px "+n+"px";
			}
			return parseInt(this.nodeGuide.style.backgroundSize);

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
			this.webCanvases[0].copy(image);
			return this;
		}
		//-- wcbDataObject 에서 읽어온다.(비동기라서 callbakc을 위해서 함수(onload)를 받는다.
		,"openByWcbDataObj":function(wcbdo,onload){
			this.setName(wcbdo.name);
			this.resize(wcbdo.width,wcbdo.height);
			var callback = function(wcb,loopCnt,onload){
				var success = 0;
				var call = 0;
				return function(img,isSuccess){
					call++;
					success+=isSuccess?1:-1;
					if(call == loopCnt){
						if(success != loopCnt){
							wcb.setError("WcbDataObj 처리에 문제가 있습니다.");
							return false;
						}
						onload(wcb);
					}
				}
			}(this,wcbdo.data.length,onload)
			for(var i=0,m=wcbdo.data.length;i<m;i++){
				if(!this.webCanvases[i]){
					this.addWebCanvas();
				}
				this.webCanvases[i].putWcDataObject(wcbdo.data[i],callback);
			}
			return this;
		}
		,"setLabel":function(label){
			return this.activeWebCanvas(label);
		}
		,"setZoom":function(zoom){
			if(!isNaN(zoom)){
				this.zoom = zoom;
			}
			this.node.style.transform="scale("+this.zoom+","+this.zoom+")";
			//this.node.style.width = (this.width*this.zoom)+'px';this.node.style.height = (this.height*this.zoom)+'px';
			//this.node.style.width = (this.width)+'px';this.node.style.height = (this.height)+'px';
			//this.outNode.style.width = (this.width)+'px';this.outNode.style.height = (this.height)+'px';
			this._resizeNode(this.width,this.height);

			this.outNode.style.width = this.width*this.zoom+'px';
			this.outNode.style.height = this.height*this.zoom+'px';
		}
		,"_syncNode":function(){
			//this.node.innerHTML = "";//내용 초기화
			//this.node.style.width = this.width+"px";
			//this.node.style.height = this.height+"px";
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				//this.webCanvases[i].node.appendChild(this.webCanvases[i]); //IE버그인듯.. 왜 사라지는지, 다시 붙여 넣게 바꾼다.
				this.node.appendChild(this.webCanvases[i].node);
				//var zIndex = (m-i)*10
				var zIndex = i*10
				this.webCanvases[i].node.style.zIndex = zIndex;
				this.webCanvases[i].setAttribute('data-wcb-index',i);
				this.webCanvases[i].setAttribute('data-wcb-active',0);

			}
			this.activeWebCanvas.setAttribute('data-wcb-active',1);
			this.activeWebCanvas.node.appendChild(this.shadowWebCanvas.node);
			this.setZoom();
			return true;
		}
		//-- undo
		//-- 현재 히스토리
		,"currentHistory":function(){
			return this.historyLog[this.historyIdx];
		}
		//-- 현재 히스토리를 모든 내용을 담은 히스토리로 바꾼다.
		,"resaveHistory":function(){
			var oldMtime = 0;
			if(this.historyLog[this.historyIdx].data.skip == 0){ //이미 전레이어 정보가 들어가 있다.
				//console.log("리세이브 스킵");
				return false;
			}
			this.historyLog[this.historyIdx].data = this.getDataForHistory(oldMtime);
			//console.log("히스토리 재저장",oldMtime);
			return true;
		}
		// 히스토리 저장
		,"saveHistory":function(action){
			//this.historyIdx = (this.historyIdx+1)%this.commonConfig.limitHistoryLog;
			if(this.historyIdx<0){
				var oldMtime = 0;
			}else{
				var oldMtime = this.historyLog[this.historyIdx].time;
			}
			this.historyIdx++;
			this.historyLog.splice(this.historyIdx,this.commonConfig.limitHistoryLog,
			{"action":action,"name":this.name,"activeIdx":this.getIndexAcviceWebCanvas(),"width":this.width,"height":this.height,"data":this.getDataForHistory(oldMtime),"time":(new Date()).getTime()}
			);
			if(this.historyLog.length > this.commonConfig.limitHistoryLog){
				this.historyLog.splice(0,1);
				this.historyIdx--;
			}
			return this.historyLog.length;
		}
		,"resetHistory":function(){
			this.historyLog.splice(0,this.historyLog.length);
			this.historyIdx = -1;
		}
		,"loadHistory":function(historyData){
			this.resizeNode(historyData.width,historyData.height); //.resize()를 사용하면 상관 없는 것들의 크기도 변경해서 mtime이 바뀜
			this.name = historyData.name;
			this.putDataForHistory(historyData);
			this.setActiveWebCanvasByIndex(historyData.activeIdx);
			//console.log("액티브 히스토리"+historyData.activeIdx);
			return true
		}
		,"undo":function(){
			if(this.historyIdx<=0){this.setError("undo() : 더 이상의 히스토리가 없습니다");return false;}
			var historyData = this.historyLog[--this.historyIdx];
			this.loadHistory(historyData);
			return true;
		}
		,"redo":function(){
			if(this.historyIdx>=(this.historyLog.length-1)){this.setError("redo() : 더 이상의 히스토리가 없습니다");return false;}
			var historyData = this.historyLog[++this.historyIdx];
			this.loadHistory(historyData)
			return true;

		}
		,"getDataForHistory":function(oldMtime){
			var data = [];
			data.skip = 0;
			if(this.webCanvases[0].getDataForHistory ==undefined){this.setError("해당 메소드는 지원되지 않습니다.");return false;}
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				if(this.webCanvases[i].isModified(oldMtime)){
					data.push(this.webCanvases[i].getDataForHistory());
					//console.log("PUSH : "+this.webCanvases[i].label);
				}else{
					data.push(this.webCanvases[i].getDataForHistory(true));
					data.skip++;
					//console.log("SKIP : "+this.webCanvases[i].label);
				}
			}
			return data;
		}
		,"putDataForHistory":function(historyData){
			for(var i=0,m=historyData.data.length;i<m;i++){
				if(!this.webCanvases[i]){ //없으면 레이어 하나를 붇인다.
					var c = this.addWebCanvas();
				}
			}
			for(var m=this.webCanvases.length;i<m;i++){
				this.removeWebCanvasByIndex(i);
			}
			for(var i=0,m=historyData.data.length;i<m;i++){
				this.webCanvases[i].resize(historyData.width,historyData.height);
				this.webCanvases[i].putDataForHistory(historyData.data[i]);
			}
		}
		//--- 웹캔버스 제어부분
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
			if(this.webCanvases[idx].node.parentNode){
				this.webCanvases[idx].node.parentNode.removeChild(this.webCanvases[idx].node); //IE때문에 삭제시 여기서 node에서도 빼버린다.
			}

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
			c.label = "Layer"+(++this.tempCounter);
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
			var c = WebCanvas(this.width,this.height);
			//c.copy(this.webCanvases[idx-1]);
			c.merge(this.webCanvases[idx-1]);
			c.merge(this.activeWebCanvas);
			this.activeWebCanvas.copy(c);
			this.activeWebCanvas.setOpacity(1); //강제로 1로 만듬
			this.removeWebCanvasByIndex(idx-1);
			return true;
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
		,"adjustSize":function(width,height,controlPoint){
			if(this.execAllWebCanvases("adjustSize",arguments)){
				this.width = width;
				this.height = height;
				this._syncNode();
				return true;
			}
			return false;
		}
		,"_resizeNode":function(width,height){ //wc는 무시하고 wcb.node만 리사이즈.
			if(!isNaN(width)){
				this.width = width;
				this.height = height;
			}

			this.shadowWebCanvas.clearResize(this.width,this.height);
			this.node.style.width = this.width+"px";
			this.node.style.height = this.height+"px";
			//this.outNode.style.width = (this.width*this.zoom)+"px";
			//this.outNode.style.height = (this.height*this.zoom)+"px";

			return true;
		}
		,"resizeNode":function(width,height){ //wc는 무시하고 wcb.node만 리사이즈.
			this._resizeNode(width,height)
			this._syncNode();
			return true;
		}
		,"resize":function(width,height){ //wc도 같이 리사이즈
			if(this.execWebCanvases("resize",arguments)){
				this.resizeNode(width,height);
				return true;
			}
			return false;
		}
		,"crop":function(x0,y0,width,height){
			if(this.execAllWebCanvases("crop",arguments)){
				this.resizeNode(width,height)
				return true;
			}
			return true;
		}
		,"rotate90To":function(deg){
			if(deg % 90 !== 0){
				this.setError("WebCanvasBundle.rotate90To() : not support degrees : "+deg);
				return false;
			}
			if(this.execAllWebCanvases("rotate90To",arguments)){
				var n = deg/90;
				if(n%2 == 0){
				}else{ //너비 높이 바꾸기
					var h = this.width;
					var w = this.height;
					this.resizeNode(w,h);
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
		,"execAllWebCanvases":function(method,args){
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
			//this.shadowWebCanvas.configContext2d({"globalAlpha":this.activeWebCanvas.opacity});
			//this.shadowWebCanvas.setOpacity(this.activeWebCanvas.opacity);
			//this.shadowWebCanvas.setOpacity(1);

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
			this.webCanvases[idx0].modified();
			this.webCanvases[idx1].modified();
			this._syncNode();
			return true;
		}
		,"mergeAll":function(){
			var c = WebCanvas(this.width,this.height);
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				if(this.webCanvases[i].hide){ //숨긴경우 머지 안한다.
					continue;
				}
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
			var mimeType = "";
			switch(type){
				case null:
				case undefined:
				case 'png':
				case 'image/png':
					mimeType = "image/png";
				break;
				case 'jpg':
				case 'jpeg':
				case 'image/jpeg':
					mimeType = "image/jpeg";
					useEncoderOptions = true;
					if(encoderOptions != undefined){
							encoderOptions = parseFloat(encoderOptions);
					}
					if(isNaN(encoderOptions)){encoderOptions=1;}
				break;
				case 'webp':
				case 'image/webp':
					mimeType = "image/webp";
					useEncoderOptions = true;
					if(encoderOptions != undefined){
							encoderOptions = parseFloat(encoderOptions);
					}
					if(isNaN(encoderOptions)){encoderOptions=1;}
				break;
				case "wcb.json":
				case "wcbjson":
					mimeType = "application/json";
				break;
				default:
					this.setError("지원되지 않는 mime-type("+mimeType+")입니다.");return false;
				break;
			}
			if(mimeType == "application/json"){
				var str = this.toWcbDataURL();
			}else{
				var c = this.mergeAll()
				var str = c.toDataURL(mimeType,encoderOptions);
			}
			if(str.indexOf(mimeType)== -1 || str.indexOf(mimeType)>10){ //
				//console.log(str);
				this.setError("브라우저에서 지원되지 않는 mime-type("+mimeType+")입니다.");return false;
			}
			return str;
		}
		//-- wcbjson 형식으로 저장하기 위한 것.
		,"toWcbDataURL":function(){
			return "data:application/json;base64,"+window.btoa(unescape(encodeURIComponent(this.toWcbDataJson())));
		}
		,"toWcbDataJson":function(){
			return JSON.stringify(this.toWcbDataObject());
		}
		,"toWcbDataObject":function(){
			var data = [];
			//-- 미리보기용 데이터
			var c = this.mergeAll();
			c.resize(100,Math.round(this.height*100/this.width));
			//var preview = c.toWcDataObject("image/jpeg",0.1); //미리보기는 jpg 로 한다.(용량 적어지겠다... 얼마 차이 안나네))
			var preview = c.toWcDataObject(); //얼마 차이 안나네. 투명 부분도 있으니 png로 한다. (나중에 압축도 생각해보자.)

			if(this.webCanvases[0].getDataForHistory ==undefined){this.setError("해당 메소드는 지원되지 않습니다.");return false;}
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				data.push(this.webCanvases[i].toWcDataObject());
			}
			return {"dataType":"wcb","name":this.name,"width":this.width,"height":this.height,"preview":preview,"data":data};
		}
		,"clear":function(){
			var r = this.execWebCanvases("clear",{})
			this.webCanvases[0].clear(1); //마지막 레이어만 색을 칠함
			 return r;
		}
		,"flip":function(){
			return this.execAllWebCanvases("flip",arguments)
		}
	}
})();
