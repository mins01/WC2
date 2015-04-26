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
		c.alt = "";
		c.class = "WC";
		if(c.tagName != 'CANVAS'){
			c = null;
			//delete c;
			this.setError( "<canvas>를 사용할 수 없는 환경입니다");
			return false;
		}
		for(var x in this._prototype){
			c[x] = this._prototype[x];
		}
		
		c.error = ""; //최후 에러 메세지
		c.width = width;
		c.height = height;
		c.opacity = 1;
		c.context2d = c.getContext('2d');
		//c.context2d.imageSmoothingEnabled = false;//
		//-- 추가 설정 (밖에서 설정 할 수 있게 기본값을 넣어둔다. 여기서 안 정하면 설정이 안된다.)
		c.context2d.lineHeight = 1.5;
		c.context2d.eraserMode = "pen";
		c.context2d.disableStroke = 0; //stroke 사용금지
		c.context2d.disableFill = 0; //strokFiil 사용금지
		
		if(colorset){
			c.configContext2d({"fillStyle":c.colorset2String(colorset)});
			c.context2d.fillRect(0,0,c.width,c.height);
		}
		c.setOpacity(1);
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
		//== 추가 메소드
		//--- 색상 변환용
		,"colorset2String":function(colorset){
			switch(colorset.length){
				case 3:return "rgb("+colorset.join(',')+")";break;
				case 4:return "rgba("+colorset.join(',')+")";break;
			}
			return false;
		}
		,"setAlt":function(alt){
			this.alt=alt;
			return this.alt;
		}
		,"setError":function(error){
			this.error = error;
			console.log(this.error);
			return this.error;
		}
		//-- 리사이즈 (내용유지)
		,"resize":function(width,height){
			var twc = this.clone();
			this.clear();
			var context2dCfg = this.getConfigContext2d()
			this.context2d.save();
			this.width = width; 
			this.height = height;
			this.context2d.drawImage(twc, 0, 0, width, height);
			this.context2d.restore();
			this.configContext2d(context2dCfg); //버그인지 font의 설정값이 초기화되기에 재설정한다.
			return true;
		}
		,"clear":function(){
			//this.width = this.width; //이걸 사요하면 context2d의 설정이 초기화된다.
			this.context2d.clearRect(0,0,this.width,this.height);
			return true;
		}
		,"getConfigContext2d":function(name){
			if(name){ return this.context2d[name]}
			var cfg = {};
			for(var x in this.context2d){
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
		,"configContext2d":function(cfg){
			if(cfg != undefined){
				for(var x in cfg){
					if(this.context2d[x] === undefined){
						continue;
					}else if(typeof this.context2d[x] == "function" || typeof this.context2d[x] == "object"){
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
				
				this.context2d.fillStyle = this.context2d.createPattern(cfg["patternImage"],cfg["patternType"]?cfg["patternType"]:"repeat");
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
			var imagedata = this.context2d.getImageData(0, 0, this.width, this.height);
			var pos = Math.round(this.width*y+x)*4
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
				this.style.opacity = this.opacity;
			}
			return this.opacity;
		}
		// 인자의 webCanvas가 위에 그려진다.
		,"merge":function(webCanvas,x0,y0,w0,h0){
			var globalAlpha = webCanvas.opacity?webCanvas.opacity:1;
			
			this.context2d.save();
			if(globalAlpha!=null){
				this.context2d.globalAlpha = globalAlpha;
			}
			if(isNaN(x0)){x0 = 0;}
			if(isNaN(y0)){y0 = 0;}
			this.drawImage(webCanvas, x0, y0,w0,h0);
			this.context2d.globalAlpha = 1;
			this.context2d.restore();
			return this;
		}
		// 인자의 webCanvas가 아래에 그려진다.
		,"mergeTo":function(webCanvas,x0,y0,w0,h0){
			var globalAlpha = webCanvas.opacity?webCanvas.opacity:1;
			
			var c = webCanvas.clone();
			c.context2d.save();
			if(globalAlpha!=null){
				c.context2d.globalAlpha = globalAlpha;
			}
			if(isNaN(x0)){x0 = 0;}
			if(isNaN(y0)){y0 = 0;}
			
			c.drawImage(this, x0, y0,w0,h0);
			//this.drawImage(webCanvas, x0, y0,w0,h0);
			this.copy(c);
			c.context2d.globalAlpha = 1;
			c.context2d.restore();
			return this;
		}
		,"copy":function(webCanvas,x0,y0,w0,h0){
			this.clear();
			return this.merge(webCanvas,x0,y0,w0,h0);
		}
		//--- 선 그리기
		,"line":function(x0,y0,x1,y1){
			this.context2d.beginPath();
			this.context2d.moveTo(x0,y0);
			this.context2d.lineTo(x1,y1);
			this.context2d.stroke();
			this.context2d.closePath();
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
				this.setError( this.constructor+".lines() : 배열 너무 짧습니다.");
				return false;
			}
			this.context2d.beginPath();
			this.context2d.moveTo(pos[0][0],pos[0][1]);
			for(var i = 0,m=pos.length;i<m;i++){
				this.context2d.lineTo(pos[i][0],pos[i][1]);
			}
			this.context2d.stroke();
			this.context2d.closePath();
			return true;
		}
		//--- 곡선그리기
		,"curve":function(x0,y0,x1,y1,x3,y3,x4,y4){
			this.context2d.beginPath();
			this.context2d.moveTo(x0,y0);
			if(isNaN(x4)){ //quadraticCurveTo를 사용
				this.context2d.quadraticCurveTo(x1,y1,x3,y3);
			}else{ //bezierCurveTo 를 사용
				this.context2d.bezierCurveTo(x1,y1,x3,y3,x4,y4);
			}
			this.context2d.stroke();
			this.context2d.closePath();
			return true;
		}
		//--- 잘라내기
		,"crop":function(x0,y0,width,height){
			var imagedata = this.context2d.getImageData(x0,y0,width,height);
			this.clear();
			this.context2d.putImageData(imagedata, 0, 0);
		}
		//--- 사각형그리기
		,"rect":function(x0,y0,width,height){
			this.context2d.beginPath();
			this.context2d.rect(x0,y0,width,height);
			if(!this.context2d.disableFill){
				this.context2d.fill();
			}
			if(!this.context2d.disableStroke){
				this.context2d.stroke();
			}
			this.context2d.closePath();
		}
		//--- 원 그리기
		,"circle":function(x0,y0,xr,yr,x1,y1){
			this.context2d.beginPath();
			if(isNaN(yr)){ //일반적인 정원
				this.context2d.arc(x0, y0, xr, 0, Math.PI*2,null);
			}else{ //타원
				this.context2d.moveTo(x0,y0);
				this.context2d.bezierCurveTo(x0+xr, y0+yr, x1+xr, y1+yr, x1, y1);
				this.context2d.bezierCurveTo(x1-xr, y1-yr, x0-xr, y0-yr,  x0, y0);
			}
			if(!this.context2d.disableFill){
				this.context2d.fill();
			}
			if(!this.context2d.disableStroke){
				this.context2d.stroke();
			}
			this.context2d.closePath();
			return true;
		}
		//--- 그림 이동
		,"move":function(x0,y0){
			var imagedata = this.context2d.getImageData(0,0,this.width,this.height);
			this.clear();
			this.context2d.putImageData(imagedata, x0, y0);
		}
		//--- toDataURL
		//,"toDataURL":function(type,encoderOptions)// 캔버스에서 기본으로 지원됨
		//--- 텍스트, 문자열 들
		,"text":function(text,x0,y0){
			text = new String(text);
			var fontSize = (this.context2d.font.match(/\d+/))[0];
			var lineHeight = this.context2d.lineHeight; //lineHeight는 이후 설정할 수 있도록 하자.
			var texts = text.split(/[\f\n\r\t\v]/);
			for(var i=0,m=texts.length;i<m;i++){
				this.context2d.fillText(texts[i], x0, y0+(fontSize*lineHeight*i));
				this.context2d.strokeText(texts[i], x0, y0+(fontSize*lineHeight*i));
			}
		}
		//--- 문자열 길이 알아내기 (다중 문장 처리가능)
		,"measureText":function(text){
			var texts = text.split(/[\f\n\r\t\v]/);
			var maxWidth = -1;
			
			for(var i=0,m=texts.length;i<m;i++){
				maxWidth = Math.max(maxWidth,this.context2d.measureText(texts[i]).width);
			}
			var minWidth = maxWidth;
			for(var i=0,m=texts.length;i<m;i++){
				minWidth = Math.min(maxWidth,this.context2d.measureText(texts[i]).width);
			}
			
			return {"width":maxWidth,"maxWidth":maxWidth,"minWidth":minWidth};
		}
		//--- 이미지 넣기
		//x0,y0,w0,h0 넣을 때 이미지, 
		// x1,y1,w1,h1 넣는 이미지에 대한 crop및 resize
		//풀 아규멘트일 경우 x0과 x1의 위치가 바뀌지만 헷갈리므로 여거서 처리
		,"drawImage":function(img,x0,y0,w0,h0,x1,y1,w1,h1){
			if(isNaN(w0)){
				this.context2d.drawImage(img,x0,y0);
			}else if(isNaN(x1)){
				this.context2d.drawImage(img,x0,y0,w0,h0);
			}else if(!(isNaN(h1))){
				this.context2d.drawImage(img,x1,y1,w1,h1,x0,y0,w0,h0); //될 수 있으면 사용하지 말라, 어떻게 바뀔지 모르겠다.
			}else{
				this.setError( "WebCanvas.drawImage() : check for arguments");
				return false;
			}
			return true;
		}
		//--- WebCanvas를 복제한다. 그림 내용이 같다.
		,"clone":function(){
			var c = WebCanvas(this.width,this.height);
			c.context2d.putImageData(this.context2d.getImageData(0, 0, this.width,this.height),0,0);
			return c;
		}
		//--- 90도 회전
		,"rotate90To":function(deg){
			var c = this.clone();
			if(deg % 90 == 0){
				this.context2d.save(); 
				switch(deg){
					case 0 :
						this.clear();
						this.context2d.rotate(deg * Math.PI / 180);
						this.context2d.drawImage(c, 0, 0);
						break;
					case 90 :
						this.resize(c.height,c.width);
						this.clear();
						this.context2d.rotate(deg * Math.PI / 180);
						this.context2d.drawImage(c, 0, -1*c.height);
						break;
					case 180 :
						this.clear();
						this.context2d.rotate(deg * Math.PI / 180);
						this.context2d.drawImage(c, -1*c.width, -1*c.height);
						break;
					case 270 :
					case -90 :
						this.resize(c.height,c.width);
						this.clear();
						this.context2d.rotate(deg * Math.PI / 180);
						this.context2d.drawImage(c, -1*c.width, 0);
						break;		
				}
				//반향 되돌리기
				this.context2d.rotate(-1*deg * Math.PI / 180 );
				this.context2d.restore(); 
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

			this.context2d.save(); // Save the current state
			this.clear();
			this.context2d.scale(scaleH, scaleV); // Set scale to flip the image
			this.context2d.drawImage(c, posX, posY, this.width, this.height); // draw the image
			this.context2d.restore(); // Restore the last saved state

		}
	} // end : WebCanvas._prototype
})();