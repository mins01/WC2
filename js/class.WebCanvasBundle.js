// JavaScript Document
/**
* class.WebCanvasBundle.js
* mins01.com
* 2015-04-22 : create file
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
		"node":null
		,"width":100
		,"height":100
		,"webCanvases":[]
		,"shadowWebCanvas":null
		,"error":""
		,"zoom":1
		,"toolName":""
		,"context2dCfg":{}
		,"init":function(width,height,colorset){
			this.width = width;
			this.height = height;
			this.node = document.createElement('div');
			this.node.className = "WCG";
			this.shadowWebCanvas = WebCanvas(this.width,this.height);
			this.shadowWebCanvas.className = "WC WC-shadow";
			this.shadowWebCanvas.alt="쉐도우레이어";
			this.addWebCanvas(colorset);
			//this.initEvent();
			this.setToolName("line");
			this.context2dCfg = JSON.parse( JSON.stringify( this.shadowWebCanvas.initContext2dCfg ) );;
			
		}
		// 외부에서 사용하도록 하자.
		,"initEvent":function(){
			var onmousedown = function(wcg){
				return function(event){
					if(wcg.toolName.length==0){return false;}
					WC2Tool[wcg.toolName].init(wcg);
					WC2Tool[wcg.toolName].down(event);
				}
			}(this)
			var onmousemove = function(wcg){
				return function(event){
					event.preventDefault();
					if(wcg.toolName.length==0){return false;}
					WC2Tool[wcg.toolName].move(event);
				}
			}(this)
			var onmouseup = function(wcg){
				return function(event){
					if(wcg.toolName.length==0){return false;}
					WC2Tool[wcg.toolName].up(event);
				}
			}(this)
			
			_M.EVENT.add(this.node,'onmousedown',onmousedown);
			_M.EVENT.add(document.body,'onmousemove',onmousemove);
			_M.EVENT.add(document,'onmouseup',onmouseup);
			
			//드래그 방지용
			document.onmousedown = function(evt){
				var target = _M.EVENT.target(evt);
				if(target.tagName && 
					(target.tagName =='INPUT'||target.tagName =='SELECT'||target.tagName =='OPTION'||target.tagName =='TEXTAREA')){
				}else{
					return false;
				}
			}

		}
		,"setToolName":function(toolName){
			if(!WC2Tool[toolName]){alert(toolName+"는 지원되지 않는 툴입니다."); return false;}
			this.toolName = toolName;
			return this.toolName;
		}
		,"_syncNode":function(){
			this.node.innerHTML = "";//내용 초기화
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				this.node.appendChild(this.webCanvases[i]);
				this.webCanvases[i].style.zIndex = i*10;
				this.webCanvases[i]._sortNum = i;
				this.webCanvases[i].dataset.active = 0;
			}
			this.activeWebCanvas.dataset.active = 1;
			this.shadowWebCanvas.style.zIndex = this.activeWebCanvas._sortNum*10+5;
			this.node.appendChild(this.shadowWebCanvas);
			this.node.style.width=this.width+"px";
			this.node.style.height=this.height+"px";
			return true;
		}
		,"addWebCanvas":function(colorset){
			var c = WebCanvas(this.width,this.height,colorset);
			c.className = "WC";
			c.alt = "레이어";
			this.activeWebCanvas = c;
			this.webCanvases.push(c);
			this._syncNode();
			//this.activeWebCanvasByNum(c._sortNum);
			return c;
		}
		,"activeWebCanvasByNum":function(n){
			if(n==-1){
				n = this.addWebCanvas.length-1;
			}
			if(!n || this.addWebCanvas[n] === undefined){
			}else{
				this.activeWebCanvas = this.addWebCanvas[n];
			}
			return this.activeWebCanvas;
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
				this.error =this.constructor+".rotate90To() : not support degrees : "+deg;
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
			if(this.webCanvases[0][method]==undefined){this.error="해당 메소드는 지원되지 않습니다.";return false;}
			for(var i=0,m=this.webCanvases.length;i<m;i++){
				var r = this.webCanvases[i][method].apply(this.webCanvases[i],args);
				if(r === false){ this.error = "webCanvases["+i+"]"+this.webCanvases[i].error; return false;}
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
			if(this.shadowWebCanvas[method]==undefined){this.error="해당 메소드는 지원되지 않습니다.";return false;}
			return this.shadowWebCanvas[method].apply(this.shadowWebCanvas,args);
		}
		/**
		* 활성화된 웹캔버스에 환경설정을 한다.
		*/
		,"configContext2d":function(context2dCfg){
			this.activeWebCanvas.configContext2d(context2dCfg);
		}
		/**
		* 웹캔버스 순서 관련
		*/
		,"upOrder":function(n,isDown){
			if(!isDown){
				if(n+1 > (this.webCanvases.length-1)){
					this.error = "upOrder() : 최상단 입니다.";
					return false;
				}
				return this.changeOrder(n,n+1)
			}else{
				if(n-1 < 0){
					this.error = "upOrder() : 최하단 입니다.";
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
					this.error="지원되지 않는 mime-type("+type+")입니다.";return false;
				break;
			}
			var c = this.mergeAll()
			var str = c.toDataURL(type,encoderOptions);
			if(str.indexOf(type)== -1 || str.indexOf(type)>10){ //
				//console.log(str);
				this.error="지원되지 않는 mime-type("+type+")입니다. (2)";return false;
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