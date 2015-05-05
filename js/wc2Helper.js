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
	}
}();