// JavaScript Document
/**
* wc2.js
* mins01.com
* 2015-04-25 : create file
* require : jquery,jquery-ui,bootstrap,spectrum(color picker on jquery), class.Webcanvas.js , class.WebCanvasBundle.js
* HTML에서 이곳의 함수를 호출해서 사용하도록 한다.
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

var wc2 = (function(){
	return {
		 "error":""
		 ,"wcws":[] //WebCanvasWindow
		 //--- 초기화
		,"init":function(){
			this.addWebCanvasWindow(300,300);
		}
		//--- 이벤트 초기화
		,"initEvent":function(){
			
		}
		//--- 
		,"addWebCanvasWindow":function(width,height){
			var width = 300;
			var height =  300;
			var wcb = new WebCanvasBundle(width,height,[255,255,255]);
			
			var wcf = $("#defaultWCF").clone().prop("id","").appendTo("#contentArea");
			
			wcf.find(".wcf-body").html("").append(wcb.node);
			
			var wcw = $( wcf ).dialog({"resizable":true,"draggable":false,
				"minWidth":200,"minHeight":200,"width":400,"height":450,
				"position": { my: "center top" , at: "center top", of: "#contentArea" },
				"beforeClose": function( event, ui ) {
					return confirm("close?")}
				}
			).parent();
			wcw.draggable({ "handle": wcw.find("span.ui-dialog-title"),
				"containment": "#contentArea",
				"stop": function( event, ui ) {
					if(ui.position.top<55){
					$(this).css("top","60px")
					
					}
				}
			});
			wcw.wcb = wcb;
			wcw[0].wcb = wcb;
			wcw.bind("mousedown",function(){
				wc2.activeWebCanvasWindow($(this));
				
			});
			wcw.css("top","60px"); //다이알로그창의 제어에 문제가 있어서 강제로 top을 설정.
			//wcw.addClass("wcw-active");
			this.wcws.push(wcw);
			this.activeWebCanvasWindow(wcw);
		}
		,"activeWebCanvasWindow":function(wcw){
			if(wcw.hasClass("wcw-active")){
				return true;
			}
			for(var i=0,m=this.wcws.length;i<m;i++){
				if(this.wcws[i][0] == wcw[0]){
					this.wcws[i].addClass("wcw-active");
				}else{
					this.wcws[i].removeClass("wcw-active");
				}
			}
			return true;
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
		//--- target에 대한 마우스 클릭 위치
		,"getMousePos":function(target, evt) {
			var rect = target.getBoundingClientRect();
			var scrollTop= Math.max(document.body.scrollTop,document.documentElement.scrollTop);
			var scrollLeft= Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);
			return {
			  "x": evt.clientX - rect.left + scrollTop,
			  "y": evt.clientY - rect.top + scrollLeft
			};
		}
	};
})();