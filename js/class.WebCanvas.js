"use strict"
// JavaScript Document
/**
* class.WebCanvas.js
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

function WebCanvas(width,height,colorset){
	return WebCanvas.create(width,height,colorset);
}
(function(){
	WebCanvas.create = function(width,height,colorset){
		var c  = document.createElement('canvas');
		if(c.tagName != 'CANVAS'){
			c = null;
			//delete c;
			this.setError( "<canvas>를 사용할 수 없는 환경입니다");
			return false;
		}
		for(var x in this._prototype){
			c[x] = this._prototype[x];
		}
		c.init(width,height,colorset);
		return c;
	}
	/**
	* canvas에 추가 멤버변수와 메소드를 설정한다. (프로토타입에 넣는건 아니다.)
	*/
	WebCanvas._prototype = {
		//== 추가 변수
		 "width":100
		,"height":100
		,"context2d":null//"getContext('2d');
		,"initContext2dCfg":{}
		,"saveContext2dCfg":[]
		//== 추가 메소드
		//---context2d 메소드 호출용
		,"init":function(width,height,colorset){
			this.alt = "";
			//this.label = "";
			var o={}
			var _label = "";
			Object.defineProperty(this, 'label', {
				get:function(){ return _label; },
				set:function(wc){
						return function(newValue){ 
							_label = newValue;
							wc._setLabel();
					}
				}(this),
				enumerable: true,
				configurable: false
			});
			
			this.className = "WC";
			this.node = document.createElement('div');
			this.node.className = "WC-node";
			this.node.appendChild(this);
			this.node.wc = this;

			this.error = ""; //최후 에러 메세지
			this.width = width;
			this.height = height;
			this.opacity = 1;
			this.context2d = this.getContext('2d');
			//this.context2d.imageSmoothingEnabled = false;//
			//-- 추가 설정 (밖에서 설정 할 수 있게 기본값을 넣어둔다. 여기서 안 정하면 설정이 안된다.)
			this.context2d.lineHeight = 1.5;
			this.context2d.eraserMode = "pen";
			this.context2d.disableStroke = 0; //stroke 사용금지
			this.context2d.disableFill = 0; //strokFiil 사용금지
			this.context2d.opacity = 1; //레이어 투명도
			
			//-- config font
			//this.context2d.font = "normal 200 10px/1 sans-serif "; // fontStyle  fontVariant fontVariant fontWeight fontSize"px"/lineHeight
			this.context2d.fontStyle = "normal"; //normal,italic,oblique
			this.context2d.fontVariant = "normal"; //normal,small-caps
			this.context2d.fontWeight = "normal"; //normal,bold,bolder,lighter,100~900 //폰트가 지원되야함.
			this.context2d.fontStyleVariantWeight  = ""; //fontStyle + fontVariant+fontWeight "italic small-caps" 처럼 사용. length>0일 경우 이 값을 우선시함.
			this.context2d.fontSize = 10; //px
			this.context2d.lineheight = 1.2; // float number
			this.context2d.fontFamily = "sans-serif"; // font-name. ','로 다중으로 설정 가능
			
			//fontStyle(normal,italic,oblique), textWidth, fontSize/lineHeight fontFamily
			
			this._syncNode();
			if(colorset){
				this.configContext2d({"fillStyle":this.colorset2String(colorset)});
				this.cmdContext2d("fillRect",0,0,this.width,this.height);
			}
			this.setOpacity(1);
			this.mtime = (new Date()).getTime();
			this.modified();
		}
		//-- 수정 시간을 표시
		,"setMtime":function(mtime){
			return this.mtime = (mtime==undefined)?(new Date()).getTime():mtime;
		}
		,"modified":function(){
			this.setMtime();
		}
		,"isModified":function(mtime){
			return this.mtime > mtime; //수정시간과 입력된 시간을 비교해서 수정여부판단.
		}
		//-- context2d 관련해서 매핑해서 사용. mtime 때문에.
		,"cmdContext2d":function(){
			if(arguments.length<=0){
				this.setError("지원되지 않는 메소드(0) : ");
				return false;
			}
			var cmd = arguments[0];
			if(this.context2d[cmd] != undefined && typeof this.context2d[cmd] =="function"){
				var args = [];
				for(var i=1,m=arguments.length;i<m;i++){
					args.push(arguments[i]);
				}
				this._checkCmdContext2dArgument(cmd,args);
				if((/(clearRect|fillRect|strokeRect|fill|stroke|fillText|strokeText|drawImage|putImageData)/).test(cmd)){ //내용에 영향을 주는 메소드만
					this.modified();
					//console.log(this.label,cmd);
				}
				
				//-- 기본값 처리 
				return this.context2d[cmd].apply(this.context2d,args);
			}else{
				this.setError("지원되지 않는 메소드(1) : "+cmd+"("+args.join(',')+")");
				return false;
			}
		}
		//---  아큐멘트를 체크해서 기본값 처리를 한다.
		,"_checkCmdContext2dArgument":function(cmd,args){
			switch(cmd){
				case "getImageData":
					if(args[0]==undefined) args[0] = 0;
					if(args[1]==undefined) args[1] = 0;
					if(args[2]==undefined) args[2] = this.width;
					if(args[3]==undefined) args[3] = this.height;
				break;
				case "putImageData":
					//if(args[0]==undefined) args[0] = null; //imageData
					if(args[1]==undefined) args[1] = 0;
					if(args[2]==undefined) args[2] = 0;
				break;
			}
		}
		//--- 색상 변환용
		,"colorset2String":function(colorset){
			switch(colorset.length){
				case 3:return "rgb("+colorset.join(',')+")";break;
				case 4:return "rgba("+colorset.join(',')+")";break;
			}
			return false;
		}
		//-- deprecated, use setLabel();
		,"setName":function(alt){ 
			return this.setLabel(alt);
		}
		,"_setLabel":function(){
			this.dataset.wcLabel = this.label;
			this.modified();
			return this.label;
		}
		,"setLabel":function(label){
			return this.label = label;
		}
		,"setError":function(error){
			this.error = error;
			console.log(this.error);
			return this.error;
		}
		,"_syncNode":function(){
			//this.node.innerHTML = "";//내용 초기화
			this.node.style.width = this.width+"px";
			this.node.style.height = this.height+"px";
			return true;
		}
		//-- 리사이즈 (내용유지) Scale image
		,"resize":function(width,height){
			if(this.width == width && this.height == height){
				//this.setError("resize() not work");
				return true; //같은 너비,높이니깐 리사이즈 안함.
			}
			var twc = this.clone();
			this.clear();
			this.saveContext2d();
			this.width = width; 
			this.height = height;
			this.cmdContext2d("drawImage",twc, 0, 0, width, height);
			this.restoreContext2d(); //버그인지 font의 설정값이 초기화되기에 재설정한다.
			this._syncNode();
			this.modified();
			return true;
		}
		//-- 내용을 지우면서 리사이즈 한다.. 
		,"clearResize":function(width,height){
			if(this.width == width && this.height == height){
				this.saveContext2d();
				this.clear();
				this.modified();
				//this.setError("clearResize() not work. only clear()");
				this.restoreContext2d(); //버그인지 font의 설정값이 초기화되기에 재설정한다.
				return true; //같은 너비,높이니깐 리사이즈 안함.
			}
			this.saveContext2d();
			this.width = width; 
			this.height = height;
			this.restoreContext2d(); //버그인지 font의 설정값이 초기화되기에 재설정한다.
			this._syncNode();
			this.modified();
			return true;
		}
		//-- 사이즈 조정 (내용이 잘릴 수 있음.)
		/**
		* controlPoint
		* 0 1 2
		* 3 4 5
		* 7 8 9
		*/
		,"adjustSize":function(width,height,controlPoint){
			var twc = this.clone();
			this.clear();
			var x = 0, y=0;
			switch(controlPoint){
				case 0:
				case 3:
				case 6: x = 0; break;
				case 1:
				case 4:
				case 7: x = (width-this.width)/2; break;
				case 2:
				case 5:
				case 9: x = (width-this.width); break;
			}
			switch(controlPoint){
				case 0:
				case 1:
				case 2: y0 = 0; break;
				case 3:
				case 4:
				case 5: y = (width-this.width)/2; break;
				case 7:
				case 8:
				case 9: y = (width-this.width); break;
			}			
			
			var context2dCfg = this.getConfigContext2d()
			this.cmdContext2d("save");
			this.width = width; 
			this.height = height;
			this.cmdContext2d("drawImage",twc, x, y);
			this.cmdContext2d("restore");
			this.configContext2d(context2dCfg); //버그인지 font의 설정값이 초기화되기에 재설정한다.
			this._syncNode();
			return true;
		}
		,"clear":function(withFillStyle){
			//this.width = this.width; //이걸 사요하면 context2d의 설정이 초기화된다.
			if(withFillStyle){
				//console.log("fill");
				this.cmdContext2d("fillRect",0,0,this.width,this.height);
			}else{
				
				this.cmdContext2d("clearRect",0,0,this.width,this.height);
			}
			return true;
		}
		,"getConfigContext2d":function(name){
			if(name){ return this.context2d[name]}
			var cfg = {};
			for(var x in this.context2d){
				if(x.indexOf("webkit")===0){ continue; }
				if(this.context2d[x] === undefined){
					continue;
				}else if(typeof this.context2d[x] == "function" || typeof this.context2d[x] == "object"){
					continue;
				}
				cfg[x] = this.context2d[x];
			}
			return cfg;
		}
		,"setContext2d":function(cfg){
			return this.configContext2d(cfg);
		}
		,"saveContext2d":function(){
			this.saveContext2dCfg.push(this.getConfigContext2d());
			this.cmdContext2d("save");
		}
		,"restoreContext2d":function(){
			this.cmdContext2d("restore");
			var cfg = this.saveContext2dCfg.pop();
			this.configContext2d(cfg);
		}
		,"configContext2d":function(cfg){
			if(cfg != undefined){
				for(var x in cfg){
					if(this.context2d[x] === undefined){
						continue;
					}else if(typeof this.context2d[x] == "function"){
						continue;
					}
					if(typeof this.context2d[x] == "number"){
						this.context2d[x] = parseFloat(cfg[x]);
					}else{
						this.context2d[x] = cfg[x];
					}
				}
			}
			if(cfg["patternImage"]){
				//패턴의 스타일을 설정한다.
				// 라인 등의 그리기 툴과로 같이 사용해야 표시된다.
				// type : repeat|repeat-x|repeat-y|no-repeat
				
				this.context2d.fillStyle = this.cmdContext2d("createPattern",cfg["patternImage"],cfg["patternType"]?cfg["patternType"]:"repeat");
			}
			//--- 폰트 설정
			if(
			  cfg["fontStyleVariantWeight"] != undefined 
			|| cfg["fontStyle"] != undefined 
			|| cfg["fontVariant"] != undefined 
			|| cfg["fontWeight"] != undefined 
			|| cfg["fontSize"] != undefined 
			|| cfg["lineheight"] != undefined 
			|| cfg["fontFamily"] != undefined 
			){
				var t = [];
				if(cfg["fontStyleVariantWeight"] && cfg["fontStyleVariantWeight"].lenth>0){
					t.push(this.context2d["fontStyleVariantWeight"]);
				}else{
					t.push(this.context2d["fontStyle"]);
					t.push(this.context2d["fontVariant"]);
					t.push(this.context2d["fontWeight"]);
					
				}
				t.push(this.context2d["fontSize"]+"px/"+this.context2d["lineheight"]);
				t.push(this.context2d["fontFamily"]);
				this.context2d.font = t.join(" ");
			}
			
			return this.context2d;
		}
		/*
		,"resetContext2d":function(){
			return this.width = this.width;
		}
		*/
		,"pickupColor":function(x,y){
			x = Math.round(x);
			y = Math.round(y);
			if(x < 0 || x > this.width || y < 0 ||y > this.height){
				return false;
			}
			var imagedata = this.cmdContext2d("getImageData",x, y, 1, 1);
			//var pos = Math.round(this.width*y+x)*4
			var pos = 0;
			try{
				return [imagedata.data[pos],imagedata.data[pos+1],imagedata.data[pos+2],(imagedata.data[pos+3]/255)]
			}catch(e){
				return false;
			}
		}
		,"setZoom":function(){
		}
		,"setOpacity":function(opacity){
			if(!isNaN(opacity)){
				opacity = parseFloat(opacity);
				this.opacity = opacity;
				this.node.style.opacity = this.opacity;
				this.modified();
			}
			return this.opacity;
		}
		// 인자의 webCanvas가 위에 그려진다.
		,"merge":function(webCanvas,x0,y0,w0,h0){
			var opacity = webCanvas.opacity?webCanvas.opacity:1;
			
			if(isNaN(x0)){x0 = 0;}
			if(isNaN(y0)){y0 = 0;}
			this.saveContext2d();	
			this.configContext2d({"globalAlpha":opacity , "globalCompositeOperation":"source-over"});
			this.drawImage(webCanvas, x0, y0,w0,h0);
			this.restoreContext2d();
			return this;
		}
		// 인자의 webCanvas가 위에 그려진다.
		,"mergeWithoutOpacity":function(webCanvas,x0,y0,w0,h0){
			this.saveContext2d();
			this.configContext2d({"globalAlpha": 1 , "globalCompositeOperation":"source-over"});
			if(isNaN(x0)){x0 = 0;}
			if(isNaN(y0)){y0 = 0;}
			this.drawImage(webCanvas, x0, y0,w0,h0);
			this.restoreContext2d();
			return this;
		}
		// 인자의 webCanvas가 아래에 그려진다.
		,"mergeTo":function(webCanvas,x0,y0,w0,h0){
			var opacity = webCanvas.opacity?webCanvas.opacity:1;
			
			var c = webCanvas.clone();
			c.cmdContext2d("save");

			c.configContext2d({"globalAlpha":c.context2d.globalAlpha *= opacity , "globalCompositeOperation":"source-over"});

			if(isNaN(x0)){x0 = 0;}
			if(isNaN(y0)){y0 = 0;}
			
			c.drawImage(this, x0, y0,w0,h0);
			//this.drawImage(webCanvas, x0, y0,w0,h0);
			this.copy(c);
			c.context2d.globalAlpha = 1;
			c.cmdContext2d("restore");
			return this;
		}
		,"copy":function(webCanvas,x0,y0,w0,h0){
			var r = this.copyWithoutOpacity(webCanvas,x0,y0,w0,h0);
			this.setOpacity(webCanvas.opacity);
			return r;
		}
		,"copyWithoutOpacity":function(webCanvas,x0,y0,w0,h0){
			this.clear();
			this.saveContext2d();
			this.configContext2d({"globalAlpha":1}); //강제로 1로 설정.
			var r = this.mergeWithoutOpacity(webCanvas,x0,y0,w0,h0);
			this.restoreContext2d();
			return true;
		}
		,"copyImageData":function(webCanvas,x0,y0,w0,h0){
			if(isNaN(w0) && isNaN(h0) ){
				if(isNaN(x0)){x0 = 0;}
				if(isNaN(y0)){y0 = 0;}
				//this.cmdContext2d("putImageData",webCanvas.getImageData(0,0),x0,y0);
				this.cmdContext2d("putImageData",webCanvas.cmdContext2d("getImageData",0,0),x0,y0);
				//console.log("x");
			}
			return true;
		}
		//--- 선 그리기
		,"line":function(x0,y0,x1,y1){
			this.cmdContext2d("beginPath");
			this.cmdContext2d("moveTo",x0,y0);
			this.cmdContext2d("lineTo",x1,y1);
			this.cmdContext2d("stroke");
			this.cmdContext2d("closePath");
			/*
			this.cmdContext2d("beginPath");
			this.cmdContext2d("moveTo",x0,y0);
			this.cmdContext2d("lineTo",x1,y1);
			this.cmdContext2d("stroke");
			this.cmdContext2d("closePath");
			*/
			return true;
		}
		//--- 연결된 다중 선 그리기
		//-- pos  = [[x,y],[x,y]];
		,"lines":function(pos){
			if(!pos instanceof Array){
				this.setError( this.constructor+".lines() : 배열이 아닙니다.");
				return false;
			}
			if(pos.length == 0 ){
				//this.setError( this.constructor+".lines() : 배열 너무 짧습니다.");
				return false;
			}
			this.cmdContext2d("beginPath");
			this.cmdContext2d("moveTo",pos[0][0],pos[0][1]);
			for(var i = 0,m=pos.length;i<m;i++){
				this.cmdContext2d("lineTo",pos[i][0],pos[i][1]);
			}
			this.cmdContext2d("stroke");
			this.cmdContext2d("closePath");
			return true;
		}
		//--- 곡선그리기
		,"curve":function(x0,y0,x1,y1,x3,y3,x4,y4){
			this.cmdContext2d("beginPath");
			this.cmdContext2d("moveTo",x0,y0);
			if(isNaN(x4)){ //quadraticCurveTo를 사용
				this.cmdContext2d("quadraticCurveTo",x1,y1,x3,y3);
			}else{ //bezierCurveTo 를 사용
				this.cmdContext2d("bezierCurveTo",x1,y1,x3,y3,x4,y4);
			}
			this.cmdContext2d("stroke");
			this.cmdContext2d("closePath");
			return true;
		}
		//--- 잘라내기
		,"crop":function(x0,y0,width,height){
			var imagedata = this.cmdContext2d("getImageData",x0,y0,width,height);
			this.clearResize(width,height);
			this.cmdContext2d("putImageData",imagedata, 0, 0);
			return true;
		}
		//--- 사각형그리기
		,"rect":function(x0,y0,width,height){
			this.cmdContext2d("beginPath");
			this.cmdContext2d("rect",x0,y0,width,height);
			if(!this.context2d.disableFill){
				this.cmdContext2d("fill");
			}
			if(!this.context2d.disableStroke){
				this.cmdContext2d("stroke");
			}
			this.cmdContext2d("closePath");
			return true;
		}
		//--- 원 그리기
		,"circle":function(x0,y0,xr,yr,x1,y1){
			this.cmdContext2d("beginPath");
			if(isNaN(yr)){ //일반적인 정원
				this.cmdContext2d("arc",x0, y0, xr, 0, Math.PI*2,null);
			}else{ //타원
				this.cmdContext2d("moveTo",x0,y0);
				this.cmdContext2d("bezierCurveTo",x0+xr, y0+yr, x1+xr, y1+yr, x1, y1);
				this.cmdContext2d("bezierCurveTo",x1-xr, y1-yr, x0-xr, y0-yr,  x0, y0);
			}
			if(!this.context2d.disableFill){
				this.cmdContext2d("fill");
			}
			if(!this.context2d.disableStroke){
				this.cmdContext2d("stroke");
			}
			this.cmdContext2d("closePath");
			return true;
		}
		//--- 그림 이동
		,"move":function(x0,y0){
			var imagedata = this.cmdContext2d("getImageData",0,0,this.width,this.height);
			this.clear();
			this.cmdContext2d("putImageData",imagedata, x0, y0);
			return true;
		}
		//--- toDataURL
		//,"toDataURL":function(type,encoderOptions)// 캔버스에서 기본으로 지원됨
		//--- 텍스트, 문자열 들
		,"text":function(text,x0,y0){
			text = new String(text);
			var fontSize = parseFloat((this.context2d.font.match(/\d+px/))[0]);
			var lineHeight = this.context2d.lineHeight; //lineHeight는 이후 설정할 수 있도록 하자.
			var texts = text.split(/\n/);
			for(var i=0,m=texts.length;i<m;i++){
				if(!this.context2d.disableFill){
					this.cmdContext2d("fillText",texts[i].trim(), x0, y0+(fontSize*lineHeight*i));
				}
				if(!this.context2d.disableStroke){
					this.cmdContext2d("strokeText",texts[i].trim(), x0, y0+(fontSize*lineHeight*i));
				}
			}
			return true;
		}
		//--- 문자열 길이 알아내기 (다중 문장 처리가능)
		,"measureText":function(text){
			var maxWidth = -1;
			var lineHeight = this.context2d.lineHeight; //lineHeight는 이후 설정할 수 있도록 하자.
			var fontSize = this.context2d.fontSize;
			
			var texts = text.split(/\n/);
			
			var maxHeight = parseFloat(fontSize)*parseFloat(lineHeight)*texts.length;
			
			for(var i=0,m=texts.length;i<m;i++){
				maxWidth = Math.max(maxWidth,this.cmdContext2d("measureText",texts[i]).width);
			}
			var minWidth = maxWidth;
			for(var i=0,m=texts.length;i<m;i++){
				minWidth = Math.min(maxWidth,this.cmdContext2d("measureText",texts[i]).width);
			}
			
			return {"width":maxWidth,"maxWidth":maxWidth,"minWidth":minWidth,"height":maxHeight,"maxHeight":maxHeight};
		}
		//--- 이미지 넣기
		//x0,y0,w0,h0 넣을 때 이미지, 
		// x1,y1,w1,h1 넣는 이미지에 대한 crop및 resize
		//풀 아규멘트일 경우 x0과 x1의 위치가 바뀌지만 헷갈리므로 여거서 처리
		,"drawImage":function(img,x0,y0,w0,h0,x1,y1,w1,h1){
			if(img){
				if(img.nodeName == "IMG" && img.naturalWidth > 0){
					
				}else if(img.nodeName == "CANVAS" && img.width > 0){
					
				}else{
					this.setError("이미지 로드에 문제가 있습니다.");
					return false;
				}
			}else{
				this.setError("이미지 객체가 없습니다.");
				return false;
			}
			if(isNaN(w0)){
				this.cmdContext2d("drawImage",img,x0,y0);
			}else if(isNaN(x1)){
				this.cmdContext2d("drawImage",img,x0,y0,w0,h0);
			}else if(!(isNaN(h1))){
				this.cmdContext2d("drawImage",img,x1,y1,w1,h1,x0,y0,w0,h0); //될 수 있으면 사용하지 말라, 어떻게 바뀔지 모르겠다.
			}else{
				this.setError( "WebCanvas.drawImage() : check for arguments");
				return false;
			}
			return true;
		}
		//--- WebCanvas를 복제한다. 그림 내용이 같다.
		,"clone":function(){
			var c = WebCanvas(this.width,this.height);
			c.setLabel(this.label);
			c.setOpacity(this.opacity);
			//c.cmdContext2d("putImageData",this.getImageData(),0,0);
			c.cmdContext2d("putImageData",this.cmdContext2d("getImageData"),0,0);
			return c;
		}
		//--- 히스토리,undo용 데이터
		,"getDataForHistory":function(){
			return {"width":this.width,"height":this.height,"opacity":this.opacity,"label":this.label,"imageData":this.cmdContext2d("getImageData"),"mtime":this.mtime};
		}
		,"putDataForHistory":function(data){
			this.resize(data.width,data.height);
			this.setLabel(data.label);
			this.setOpacity(data.opacity!=undefined?data.opacity:1);
			//this.putImageData(data.imageData);
			this.cmdContext2d("putImageData",data.imageData,0,0);
			this.mtime = data.mtime; //수정시간을 덮어 씌움.(과거에있던 데이터니깐)
			//console.log(this.label,"수정시간 덮음",this.mtime);
			return true;
		}
		//--- 파일용 데이터
		,"toWcDataObject":function(type,quality){
			return {"width":this.width,"height":this.height,"opacity":this.opacity,"label":this.label,"dataURL":this.toDataURL(type,quality)};
		}
		,"putWcDataObject":function(wcdo,onload){
			this.setLabel(wcdo.label);
			this.resize(wcdo.width,wcdo.height);
			this.setOpacity(wcdo.opacity!=undefined?wcdo.opacity:1);
			this.loadToDataURL(wcdo.dataURL,onload)
			return true;
		}
		,"loadToDataURL":function(toDataUrl,callback){
			var img = new Image();
			img.onload = function(wc){
				return function(){
					wc.copy(this);
					if(callback) callback(this,true);
				}
			}(this,callback);
			img.onerror = function(wc){
				return function(){
					wc.setError("잘못된 toDataURL  입니다.");
					if(callback) callback(this,false);
				}
			}(this,callback);
			img.src = toDataUrl;
			return true;
		}
		/*
		,"getImageData":function(x0,y0,w0,h0){
			if(isNaN(x0)){x0 = 0}
			if(isNaN(y0)){y0 = 0}
			if(isNaN(w0)){w0 = this.width}
			if(isNaN(h0)){h0 = this.height}
			return this.cmdContext2d("getImageData",x0,y0,w0,h0);
		}
		,"putImageData":function(imageData,x0,y0,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
			if(isNaN(dirtyY)){
				if(isNaN(x0)) x0 = 0;
				if(isNaN(y0)) y0 = 0;
				return this.cmdContext2d("putImageData",imageData,x0,y0);
			}
			return this.cmdContext2d("putImageData",imageData,x0,y0,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
			
		}
		*/
		//--- 확대 설정
		,"setScale":function(sx,sy){
			this.saveContext2d();
			this.cmdContext2d("scale",sx,sy);
			return;
		}
		,"resetScale":function(){
			this.restoreContext2d();
			return;
		}
		//--- 회전 설정
		//deg:각도,centerX:기준x,centerY:기준y
		,"setRotate":function(deg,centerX,centerY){
			var ang = deg * Math.PI / 180
			this.saveContext2d();
			this.cmdContext2d("translate",centerX,centerY);
			this.cmdContext2d("rotate",ang);
			this.cmdContext2d("translate",-1*centerX,-1*centerY);
			return;
		}
		,"resetRotate":function(){
			this.restoreContext2d();
			return;
		}
		// 각도 변경에 따른 x,y값 알아오기, 회전할 때 x,y의 위치가 바뀌어야한다.
		,"getRotateXY":function(deg,x,y){
			var ang = deg * Math.PI / 180
			return {"x":x*Math.cos(-ang) - y*Math.sin(-ang),"y":y*Math.cos(-ang) + x*Math.sin(-ang)};
		}
		//--- 90도 회전
		,"rotate90To":function(deg){
			var c = this.clone();
			if(deg % 90 == 0){
				this.cmdContext2d("save"); 
				switch(deg){
					case 0 :
						this.clear();
						this.cmdContext2d("rotate",deg * Math.PI / 180);
						this.cmdContext2d("drawImage",c, 0, 0);
						break;
					case 90 :
						this.resize(c.height,c.width);
						this.clear();
						this.cmdContext2d("rotate",deg * Math.PI / 180);
						this.cmdContext2d("drawImage",c, 0, -1*c.height);
						break;
					case 180 :
						this.clear();
						this.cmdContext2d("rotate",deg * Math.PI / 180);
						this.cmdContext2d("drawImage",c, -1*c.width, -1*c.height);
						break;
					case 270 :
					case -90 :
						this.resize(c.height,c.width);
						this.clear();
						this.cmdContext2d("rotate",deg * Math.PI / 180);
						this.cmdContext2d("drawImage",c, -1*c.width, 0);
						break;		
				}
				//반향 되돌리기
				this.cmdContext2d("rotate",-1*deg * Math.PI / 180 );
				this.cmdContext2d("restore"); 
				return true;
			}			
			this.setError( "WebCanvas.rotate90To() : not support degrees : "+deg);
			return false;
			
		}
		//--- 수직,수평 반전 (참고 소스 : http://jsfiddle.net/yong/ZJQX5/)
		,"flip":function(flipH,flipV){
			var c = this.clone();
			var scaleH = flipH ? -1 : 1, // Set horizontal scale to -1 if flip horizontal
			scaleV = flipV ? -1 : 1, // Set verical scale to -1 if flip vertical
			posX = flipH ? this.width * -1 : 0, // Set x position to -100% if flip horizontal 
			posY = flipV ? this.height * -1 : 0; // Set y position to -100% if flip vertical

			this.cmdContext2d("save"); // Save the current state
			this.clear();
			this.cmdContext2d("scale",scaleH, scaleV); // Set scale to flip the image
			this.cmdContext2d("drawImage",c, posX, posY, this.width, this.height); // draw the image
			this.cmdContext2d("restore"); // Restore the last saved state
		}
		//--- 인버트
		,"invert":function(){
			var imageData = this.cmdContext2d('getImageData');
			for(var i=0,m=imageData.data.length;i<m;i+=4){
				imageData.data[i] = 255 - imageData.data[i]
				imageData.data[i+1] = 255 - imageData.data[i+1]
				imageData.data[i+2] = 255 - imageData.data[i+2]
			}
			this.cmdContext2d('putImageData',imageData);
		}
		//--- 색채우기 (모든 색을 바꾼다. 알파값은 바꾸지 않는다)
		,"coverColor":function(colorset){
			var imageData = this.cmdContext2d('getImageData');
			for(var i=0,m=imageData.data.length;i<m;i+=4){
				imageData.data[i] = colorset[0];
				imageData.data[i+1] = colorset[1];
				imageData.data[i+2] = colorset[2];
			}
			this.cmdContext2d('putImageData',imageData);
		}


	} // end : WebCanvas._prototype
})();