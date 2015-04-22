// JavaScript Document
/**
* class.WC2.js
*/
/*
globalAlpha 와 opacity의 차이
globalAlpha는 그려지는것의 알파값
opacity는 레이어의 알파값(나중에 합쳐질 때 계산되어 합쳐진다)
*/

var WC2 = {
	 "error":""
	,"colorset2String":function(colorset){
		switch(colorset.length){
			case 3:return "rgb("+colorset.join(',')+")";break;
			case 4:return "rgba("+colorset.join(',')+")";break;
		}
		return false;
	}
	,"getXYSet":function(evt,target,zoom){
		evt = _M.EVENT.getEvent(evt);
		var lb = _M.LAYER.bound(target);
		var X = evt.X;
		var Y = evt.Y;
		/*
		 //압력감지
		var pressure = WC.TABLET.getPressure(); 
		if(pressure===false) pressure = 1;
		*/
		pressure = 1;
		//터치 지원
		if(evt.touches && evt.touches[0]){
			var touch = evt.touches[0];
			var X = touch.X;
			var Y = touch.Y;
		}

		return [Math.floor((X-lb.left)/zoom)
						,Math.floor((Y-lb.top)/zoom)
						,pressure];
	}
	// 레이어의 페이지에서의 위치를 정보(left,top,width,height)
	,"bound":function(el){
		var ret = {}; 
		var bodyElement = document.documentElement.scrollLeft?document.documentElement:document.body;
		if(el.hasOwnProperty('getBoundingClientRect')){  //IE8,FF3 용
				var sl = _M.BODY.scroll();
				var rect = el.getBoundingClientRect(); 
				ret.width = rect.right - rect.left; 
				ret.height = rect.bottom - rect.top; 
				ret.left = rect.left + sl.left
				ret.top = rect.top + sl.top;

		}else if(document.hasOwnProperty('getBoxObjectFor')){ //FF2 
				var box = document.getBoxObjectFor(obj); 
				ret.left = box.x; 
				ret.top = box.y; 
				ret.width = box.width; 
				ret.height = box.height; 
		}else if(document.hasOwnProperty('all') && el.hasOwnProperty('getBoundingClientRect')) {  //IE
				var sl = _M.BODY.scroll();
				var rect = el.getBoundingClientRect(); 
				ret.left = rect.left + sl.left
				ret.top = rect.top + sl.top;
				ret.width = rect.right - rect.left; 
				ret.height = rect.bottom - rect.top; 
		}else{ //OPERA,SAFARI 용(그외는 무시
			var rect = new Object();
			ret.left = el.offsetLeft;
			ret.top = el.offsetTop;
			var parent = el.offsetParent;
			while(parent != bodyElement && parent){
				ret.left += parent.offsetLeft;
				ret.top += parent.offsetTop;
				parent = parent.offsetParent;
			}
			//		ret.top -= bodyElement.scrollTop;
			ret.width = el.offsetWidth;
			ret.height = el.offsetHeight;		
		}
		return ret; 		
	}
}