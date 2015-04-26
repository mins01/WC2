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
	this.init(width,height,colorset);
}
(function(){
	/**
	* canvas에 추가 멤버변수와 메소드를 설정한다. (프로토타입에 넣는건 아니다.)
	*/
	WebCanvasBundle.prototype = {
		"init":function(width,height,colorset){
			//-- 멤버변수 초기화
			this.node = null;
			this.width = 100
			this.height = 100
			this.webCanvases = []
			this.shadowWebCanvas = null
			this.error = "";
			this.zoom = 1
			this.toolName = ""
			this.context2dCfg = {}
			this.name = "";
			this.tempCounter = 0
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
		,"setError":function(error){
			this.error = error;
			console.log(this.error);
			return this.error;
		}
		,"setName":function(name){
			this.name = name;
			this.node.alt = this.name;
			return this.name;
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
		,"removeWebCanvas":function(){
			if(this.webCanvases.length == 1){
				this.setError( "WebCanvasBundle.removeWebCanvas(): 마지막 요소는 삭제할 수 없습니다.");
				return false
			}
			var idx = this.getIndexAcviceWebCanvas();
			this.webCanvases.splice(idx,1);
			var idx2 = Math.max(idx-1,0);
			this.setActiveWebCanvasByIndex(idx2);
			return true;
		}
		,"addWebCanvas":function(colorset){
			var c = WebCanvas(this.width,this.height,colorset);
			c.className = "WC";
			c.setAlt("레이어"+ (++this.tempCounter));
			var idx = this.getIndexAcviceWebCanvas();
			this.webCanvases.splice(idx+1,0,c);
			this.setActiveWebCanvas(c);
			return c;
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
				this.setError( this.constructor+".setActiveWebCanvasByIndex() : 숫자만 입력되야합니다.");
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
				this.setError(this.constructor+".rotate90To() : not support degrees : "+deg);
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
		,"_syncContext2d":function(){
			this.activeWebCanvas.configContext2d(this.context2dCfg);
			this.shadowWebCanvas.configContext2d(this.context2dCfg);
		}
		/**
		* 웹캔버스 순서 관련
		*/
		,"upOrder":function(n,isDown){
			if(!isDown){
				if(n+1 > (this.webCanvases.length-1)){
					this.setError( "upOrder() : 최상단 입니다.");
					return false;
				}
				return this.changeOrder(n,n+1)
			}else{
				if(n-1 < 0){
					this.setError( "upOrder() : 최하단 입니다.");
					return false;
				}
				return this.changeOrder(n,n-1)
			}
		}
		,"changeOrder":function(n,m){
			var t = this.webCanvases[m];
			this.webCanvases[m] = this.webCanvases[n];
			this.webCanvases[n] = t;
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
				default:
					this.setError("지원되지 않는 mime-type("+type+")입니다.");return false;
				break;
			}
			var c = this.mergeAll()
			var str = c.toDataURL(type,encoderOptions);
			if(str.indexOf(type)== -1 || str.indexOf(type)>10){ //
				//console.log(str);
				this.setError("지원되지 않는 mime-type("+type+")입니다. (2)");return false;
			}
			return str;
		}
		,"clear":function(){
			return this.execAllWebCanvas("clear",arguments)
		}
		,"flip":function(){
			return this.execAllWebCanvas("flip",arguments)
		}
	}
})();