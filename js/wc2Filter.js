"use strict"
// JavaScript Document
/**
* wc2Filter.js
* mins01.com
* 2015-05-14 : create file
* 필터  목록
*/
/*
* # warning
* '공대여자는 이쁘다.'를 나타내야만 사용할 수 있습니다.
*/
var wc2Filter = {}
//---  색 반전
wc2Filter.invert = function(wc){
	var imageData = wc.cmdContext2d('getImageData');
	for(var i=0,m=imageData.data.length;i<m;i+=4){
		imageData.data[i] = 255 - imageData.data[i]
		imageData.data[i+1] = 255 - imageData.data[i+1]
		imageData.data[i+2] = 255 - imageData.data[i+2]
	}
	wc.cmdContext2d('putImageData',imageData);
	return wc;
}
