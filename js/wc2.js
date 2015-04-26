"use strict"
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
		 ,"activeWcw":null
		 ,"tool":null
		 ,"eventStep":0
		 ,"defaultContext2dCfg":{ //상세 설명은 https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D 을 참고
											"fillStyle":  "rgba(0, 0, 0, 0)",
											"font": "10px sans-serif",
											"globalAlpha": 1, // 0~1
											"globalCompositeOperation": "source-over", //source-atop,source-in,source-out,source-over (default),destination-atop,destination-in,destination-out,destination-over,lighter,copy,xor , vendorName-operationName(etc)
											"imageSmoothingEnabled": true, //이미지 리사이즈시 더 부드럽도록 보여준다.
											"lineCap": "round", // butt, round, square :  : use only "round"
											"lineDashOffset": 0,
											"lineHeight": 1.5,
											"lineJoin": "round", //bevel , round , miter :  : use only "round"
											"lineWidth": 1,
											"miterLimit": 10,
											"shadowBlur": 0,
											"shadowColor": "rgba(0, 0, 0, 0)",
											"shadowOffsetX": 0,
											"shadowOffsetY": 0,
											"strokeStyle": "#000000",
											"textAlign": "start", //start,end,left,right,center
											"textBaseline": "top", //top,hanging,middle,alphabetic,ideographic,bottom : use only "top"
											}
		 //--- 초기화
		,"init":function(){
			this.initEvent();
			this.addWebCanvasWindow(300,300);
			this.setTool("line");
		}
		//--- 이벤트 초기화
		,"initEvent":function(){
			$(document).on( "mousedown", ".wcf-body", function(event) {
				event.bubble = false;
				event.stopPropagation();
				event.preventDefault(); //이벤트 취소시킨다.
				if(!wc2Tool.init(wc2.tool,wc2.activeWcw.wcb)){
					alert(wc2Tool.error);
					return false;
				}
				wc2.syncContext2dCfg(); //설정을 적용시킨다.
				// todo : context2D 설정 부분
				if(!wc2Tool.down(wc2.tool,event)){
					this.error = wc2Tool.error;
					return false;
				}
				wc2.eventStep = 1;
				return true;
			});
			$(document).on( "mousemove", function(event) {
				if(wc2.eventStep==0){ return ;} //down이벤트 후에만
				event.bubble = false;
				event.stopPropagation();
				event.preventDefault(); //이벤트 취소시킨다.
				// todo : context2D 설정 부분
				if(!wc2Tool.move(wc2.tool,event)){
					this.error = wc2Tool.error;
					return false;
				}
				return true;
			});
			$(document).on( "mouseup",  function(event) {
				if(wc2.eventStep==0){ return ;} //down이벤트 후에만
				event.bubble = false;
				event.stopPropagation();
				event.preventDefault(); //이벤트 취소시킨다.
				// todo : context2D 설정 부분
				if(!wc2Tool.up(wc2.tool,event)){
					this.error = wc2Tool.error;
					return false;
				}
				wc2.eventStep = 0;
				wc2.syncLayerList(); //수정된 내용 레이어 목록에 보여주기
				return true;
			});
			// 드래그 방지용
			$('body').on("selectstart", function(event){ return false; });
			$('#contentArea').on("dragstart", function(event){ return false; });
			// 툴 panel
			$("#toolPanel").on("click",".btn[data-wc-tool]", function(event){ 
				wc2.setToolByBtn(this);
			});
		}
		//--- 
		,"addWebCanvasWindow":function(width,height){
			var width = 300;
			var height =  300;
			var wcb = new WebCanvasBundle(width,height,[255,255,255]);
			
			var wcf = $("#defaultWCF").clone().prop("id","").appendTo("#contentArea");
			wcf[0].wcb = wcb; //이벤트 처리를 위해서 연결해 놓는다.. 안그러면 어떻게 찾을레?
			wcf.find(".wcf-body").html("").append(wcb.node);
			
			var wcw = $( wcf ).dialog({"resizable":true,"draggable":false,
				"minWidth":200,"minHeight":200,"width":400,"height":450,
				"position": { my: "center top" , at: "center top", of: "#contentArea" },
				"beforeClose": function( event, ui ) {
					return confirm("close?")}
				}
			)
			var wcwp = wcw.parent();
			wcw.wcwp = wcwp;
			wcwp.draggable({ "handle": wcwp.find("span.ui-dialog-title"),
				"containment": "#contentArea",
				"stop": function( event, ui ) {
					if(ui.position.top<55){
					$(this).css("top","60px")
					
					}
				}
			});
			wcw.wcb = wcb;
			wcw[0].wcb = wcb;
			wcwp.bind("mousedown",function(wcw){
				return function(){
					wc2.activeWebCanvasWindow(wcw);
				}
			}(wcw));
			wcwp.css("top","60px"); //다이알로그창의 제어에 문제가 있어서 강제로 top을 설정.
			//wcw.addClass("wcw-active");
			this.wcws.push(wcw);
			this.activeWebCanvasWindow(wcw);
			this.rename($.format.date(new Date(),'yyyyMMddHHmmss'));
			
		}
		,"activeWebCanvasWindow":function(wcw){
			if(wcw.hasClass("wcw-active")){
				return true;
			}
			this.activeWcw = wcw;
			for(var i=0,m=this.wcws.length;i<m;i++){
				if(this.wcws[i][0] == wcw[0]){
					this.wcws[i].wcwp.addClass("wcw-active");
					//this.activeWcb = this.wcws.wcb;
				}else{
					this.wcws[i].wcwp.removeClass("wcw-active");
				}
			}
			this.syncLayerList();
			return true;
		}
		,"rename":function(name){
			if(!this.activeWcw){return false;}
			if(!this.activeWcw.wcb.setName(name)){return false;}
			
			this.activeWcw.dialog( "option", "title",name );
		}
		,"setTool":function(tool){
			if(!wc2Tool[tool]){
				this.error = tool+"라는 툴이 지원되지 않습니다.";
				return false;
			}
			//this.tool = wc2Tool[tool];
			this.tool = tool;
			this.showPropPanel();
			return this.tool;
		}
		,"setToolByBtn":function(btn){
			
			if(!btn.dataset || !btn.dataset.wcTool){
				this.error = "wc2.setToolByBtn() : 필수 애트리뷰트가 없습니다.";
				return false;
			}
			var tool = btn.dataset.wcTool;
			$(btn).parent().parent().find(".btn").each(
				function(){
					$(this).removeClass("active")
				}
			)
			$(btn).addClass("active");
			return this.setTool(tool);
		}
		//--- target에 대한 마우스 클릭 위치
		,"getMousePos":function(evt,target ) {
			var rect = target.getBoundingClientRect();
			var scrollTop= Math.max(document.body.scrollTop,document.documentElement.scrollTop);
			var scrollLeft= Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);
			return {
			  "x": evt.clientX - rect.left + scrollTop,
			  "y": evt.clientY - rect.top + scrollLeft
			};
		}
		,"getOffsetXY":function(evt,target,zoom){ //지금인 이 메소드 쓰지 않는다 추후 생각해보자.
			var xy = this.getMousePos(evt,target);
			return { "x":xy.x/zoom,"y":xy.y/zoom};
		}
		,"showPropPanel":function(){
			var className = "form.wc-tool-"+this.tool;
			$("#propPanel form").hide();
			$("#propPanel "+className).show();
		}
		,"syncContext2dCfg":function(){
			var className = "form.wc-tool-"+this.tool;
			this.activeWcw.wcb.configContext2d(this.defaultContext2dCfg); //기본값으로 덮어 씌운다.
			$("#propPanel "+className).each(
				function(){
					var cfg = $(this).serializeObject();
					
					//console.log(this.name);
					//console.log(cfg);
					wc2.activeWcw.wcb.configContext2d(cfg);
				}
			)
		}
		//--- 레이어 관련
		//-- 레이어 싱크
		,"syncLayerList":function(){
			if(!this.activeWcw){ 
				$("#wcLayerList").html("").append('<li class="list-group-item">#EMPTY#<li>')
			}else{
				var wcb = this.activeWcw.wcb;
				$("#wcLayerList").html("");
				var limitHeight = 40;
				var c = WebCanvas(Math.round(wcb.width*(limitHeight/wcb.height)),limitHeight);
				for(var i=0,m=wcb.webCanvases.length;i<m;i++){
					c.copy(wcb.webCanvases[i],0,0,c.width,c.height);
					var img = new Image();
					img.src = c.toDataURL();
					var li = document.createElement("li");
					li.className="list-group-item";
					$(li).append(img);
					$(li).append(document.createTextNode(wcb.webCanvases[i].alt));
					$("#wcLayerList").append(li)
					//console.log(wcb.webCanvases[i].alt);
				}
			}
			
		}
		//-- 유틸성
		//--- 색상문자열 만들기
		,"colorset2String":function(colorset){
			switch(colorset.length){
				case 3:return "rgb("+colorset.join(',')+")";break;
				case 4:return "rgba("+colorset.join(',')+")";break;
			}
			return false;
		}
	};
})();