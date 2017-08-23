"use strict"
// JavaScript Document
/**
* wc2Helper.js
* mins01.com
* 2015-04-27 : create file
* 기타 동작용
*/
/*
* # warning
* '공대여자는 이쁘다.'를 나타내야만 사용할 수 있습니다.
*/
var wc2Helper = function(){
	return {
		/**
		* change 이벤트 발생시 img에 이미지를 보여준다.
		* 비동기 동작
		*/
		"selectFileAndView":function(event,img){
			return wc2Helper.loadInputFileAndView(event.target,img);
		},
		"loadInputFileAndView":function(inputFile,img){
			// event.target = input file
			var ta = inputFile;
			if(ta.files == undefined){ //input file 엘레멘트가 아닌것 같음. 또는 브라우저에서 지원이 안됨.
				return false;
			}
			if(ta.files.length > 0){ //파일 업로드가 있을 경우만
				for(var i=0,m=ta.files.length;i<m;i++){ //다중 셀렉트 가능. (하지만 img가 1개이므로 멀티 동작은 무시)
					var file = ta.files[i];
					if(file.type.indexOf('image')===-1){
						alert("이미지가 아닌 파일이 포함되어있습니다. 다시 선택해주시기 바랍니다.");
						ta.value="";
						return false;
					}
					(function(file,img){
						var fileReader = new FileReader();
						fileReader.onload = function (event) {
							img.src = event.target.result;
						};
						fileReader.readAsDataURL(file);
					})(ta.files[i],img)
				}
			}
		},
		//-- 로컬 파일 처리용, 이후 사용 예정. 수정해야서 써야한다.
		//-- readType : readAsDataURL, readAsText , readAsBinaryString , readAsArrayBuffer
		"loadInputFile":function(file,callback,readType){
			if(!readType) readType = "readAsDataURL";
			// event.target = input file
			var ta = file;
			if(ta.files == undefined){ //input file 엘레멘트가 아닌것 같음. 또는 브라우저에서 지원이 안됨.
				return false;
			}
			if(ta.files.length > 0){ //파일 업로드가 있을 경우만
				for(var i=0,m=ta.files.length;i<m;i++){ //다중 셀렉트 가능. (하지만 img가 1개이므로 멀티 동작은 무시)
					var file = ta.files[i];

					(function(file,callback,readType){
						var fileReader = new FileReader();
						fileReader.onload = function (event) {
							callback(event.target.result);
						};
						if(fileReader[readType]){
							fileReader[readType](file);
						}else{
							console.error("not support readType");
						}
					})(ta.files[i],callback,readType);
				}
			}
		},
		//-- toBlob가 지원되지 않으므로
		//-- 참고 : https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
		"dataURL2Blob":function(dataURL, type) {
			var parts = dataURL.split(",");
			var contentType = parts[0].split(":")[1];
			var bin = atob( parts[1] ),
				len = bin.length,
				arr = new Uint8Array(len);
			for (var i=0; i<len; i++ ) {
				arr[i] = bin.charCodeAt(i);
			}
			return new Blob( [arr], {"type": type?type:contentType}  );
		},
		//-- 바이너리를 blob으로
		"bin2Blob":function(bin, type) {
			var bin = atob( dataURL.split(',')[1] ),
				len = bin.length,
				arr = new Uint8Array(len);
			for (var i=0; i<len; i++ ) {
				arr[i] = bin.charCodeAt(i);
			}
			return new Blob( [arr], {"type": type || 'image/png'}  );
		},
		//-- blob 저장하기 (Dependencies FileSaver )
		"saveAs":function(blob,filename){
			saveAs(blob, filename);
		},
		//-- base64 encode (http://ecmanaut.blogspot.kr/2006/07/encoding-decoding-utf8-in-javascript.html)
		//--- btoa 를 바로 사용하면  한글 지원에 문제가 있어서
		"utf8_to_b64":function(str) {
			return window.btoa(unescape(encodeURIComponent(str)));
		},
		//--- base64 denode (http://ecmanaut.blogspot.kr/2006/07/encoding-decoding-utf8-in-javascript.html)
		//--- btoa 를 바로 사용하면 한글 지원에 문제가 있어서
		"b64_to_utf8":function(str) {
			 return decodeURIComponent(escape(window.atob(str)));
		},
		//-- [r,g,b,a] 를 rgba(r,g,b,a) 문자열로
		"colorset2String":function(colorset){
			switch(colorset.length){
				case 3:return "rgb("+colorset.join(',')+")";break;
				case 4:return "rgba("+colorset.join(',')+")";break;
			}
			return false;
		},
		//-- rgba(r,g,b,a) 문자열을 [r,g,b,a]
		"string2Colorset":function(string){
			var colorset = false;
			if(string.indexOf('#')==0){ //#RRGGBB 형식
				var colorset = [];
				if(string.length == 3){
					var t = string.substr(0,1);colorset.push(parseInt(t+t,16));
					var t = string.substr(1,1);colorset.push(parseInt(t+t,16));
					var t = string.substr(2,1);colorset.push(parseInt(t+t,16));
				}else{
					var t = string.substr(0,2);colorset.push(parseInt(t,16));
					var t = string.substr(2,2);colorset.push(parseInt(t,16));
					var t = string.substr(3,2);colorset.push(parseInt(t,16));
				}
			}else if(string.toLowerCase().indexOf('rgb')==0){
				var colorset = string.replace(/[^\d,]/g,'').split(',');
			}
			return colorset;
		},
		/**
		 * 브라우저의 canvas.toDataURL 지원 이미지 타입 체크
		 * @param  {[type]} type image/png 등
		 * @return {[type]}      [description]
		 */
		"isSupportedImageType":function(mime){
			var c  = document.createElement('canvas');
			if(c.tagName != 'CANVAS'){
				return false;
			}
			c.width = 1;
			c.height = 1;
			var quality = 0.1;
			var du = c.toDataURL(mime,quality);
			return du.indexOf(mime)!=-1;
		},
		/**
		 * input[type="Range"] 에 대해서 동작
		 * @return {[type]} [description]
		 */
		"attachTdRangeValueBox":function(){
			// $(".div-range>input[type='range']").parent().addClass('showRangeValue');


			$(".showRangeValue>input").each(function(idx,el){
				$(el.parentNode).attr("data-val",el.value);
				el._value = el.value;

				var descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
				var inputSetter = descriptor.set;
				descriptor.set = function(val) {
					Object.defineProperty(this, "value", {set:inputSetter});
					this.value = val;
					$(this.parentNode).attr("data-val",val);
					Object.defineProperty(this, "value", descriptor);
				}
				Object.defineProperty(el, "value", descriptor);

				//-- 추가 버튼 붙이기
				el.tm = null;
				var div = document.createElement('div');
				div.className="div-btn-dec";
				var btn = document.createElement('button');
				div.appendChild(btn);
				btn.type="button";
				btn.className="btn-dec glyphicon glyphicon-minus-sign";
				btn.actFn = function(el){
					return function(){
						var step = !el.step?1:parseFloat(el.step);
						el.value = (parseFloat(el.value)-step).toFixed(2);
						$(el).trigger('input');
					}
				}(el);
				$(btn).on("pointerdown mousedown",function(el){
					return function(evt){
						if(el.tm){ clearInterval(el.tm) }
						this.actFn();
						el.tm = setInterval(this.actFn,200)
						return false;
					}
				}(el));
				$(btn).on("pointerup mouseup pointerout mouseout",function(el){
					return function(evt){
						if(el.tm){ clearInterval(el.tm) }
						$(this).trigger('change');
						return false
					}
				}(el))
				// $(btn).text('-')
				$(el.parentNode).prepend(div);
				//-- 추가 버튼 붙이기
				var div = document.createElement('div');
				div.className="div-btn-inc";
				var btn = document.createElement('button');
				div.appendChild(btn);
				btn.type="button";
				btn.className="btn-inc glyphicon glyphicon-plus-sign";
				btn.actFn = function(el){
					return function(){
						var step = !el.step?1:parseFloat(el.step);
						el.value = (parseFloat(el.value)+step).toFixed(2);
						$(el).trigger('input');
					}
				}(el);
				$(btn).on("pointerdown mousedown",function(el){
					return function(evt){
						if(el.tm){ clearInterval(el.tm) }
						this.actFn();
						el.tm = setInterval(this.actFn,200)
						return false;
					}
				}(el));
				$(btn).on("pointerup mouseup pointerout mouseout",function(el){
					return function(evt){
						if(el.tm){ clearInterval(el.tm) }
						$(this).trigger('change');
						return false
					}
				}(el))
				// $(btn).text('-')
				$(el.parentNode).append(div);


			})
			$(document).on("input change",".showRangeValue>input",function(evt){
				$(this.parentNode).attr("data-val",this.value);
			})

		}
	}
}();
