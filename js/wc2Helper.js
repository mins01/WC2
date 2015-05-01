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
			return wc2Helper.loadFileAndView(event.target,img);
		},
		"loadFileAndView":function(file,img){
			// event.target = input file
			var ta = file;
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
	}
}();