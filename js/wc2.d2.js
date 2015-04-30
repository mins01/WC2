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
		 ,"wcbs":[] //WebCanvasBundle Array
		 ,"activeWcw":null
		 ,"tool":null
		 ,"eventStep":0
		 ,"wcbTmpCnt":0
		 ,"isDown":false //마우스 등이 눌려져있는가?
		 ,"isTouch":false //터치 이벤트로 동작중인가?
		 ,"defaultContext2dCfg":{ //상세 설명은 https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D 을 참고
											"fillStyle":  "rgba(0, 0, 0, 0)",
											"font": "10px sans-serif",
											"globalAlpha": 1, // 0~1
											"globalCompositeOperation": "source-over", //source-atop,source-in,source-out,source-over (default),destination-atop,destination-in,destination-out,destination-over,lighter,copy,xor , vendorName-operationName(etc)
											"imageSmoothingEnabled": true, //이미지 리사이즈시 더 부드럽도록 보여준다.
											"lineCap": "round", // butt, round, square :  : use only "round"
											"lineDashOffset": 0,
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
											//--- 추가 설정
											"eraserMode": "pen", //지우개 모드 (todo)
											"disableStroke": 0, //stroke 사용금지
											"disableFill": 0, //fiil 사용금지
											//--- config font
											"fontSize": 10, //px
											"lineHeight": 1.2, //float number
											"fontStyle": "normal", //normal,italic,oblique
											"fontVariant": "normal", //normal,small-caps
											"fontWeight": "normal", //normal,bold,bolder,lighter,100~900 //폰트가 지원되야함.
											"fontStyleVariantWeight": "", //fontStyle + fontVariant + fontWeight
											"fontFamily": "sans-serif", // font-name
											}
		 //--- 초기화
		,"init":function(){
			this.initUI();
			this.initEvent();
			this.initColorPalette();
			//this.addWebCanvasWindow(300,300);
			//this.addWcb(300,300);
			this.cmdWcb("new",300,300);
			//this.addWcb(300,300);
			this.setTool("pen");
		}
		,"setError":function(error,disableShow){
			this.error = error;
			if(!disableShow) console.log(this.error);
			return this.error;
		}
		//--- UI초기화
		,"initUI":function(){
			this.tabs = $( "#tabs" ).tabs({
				"activate": function( event, ui ) {
					if(!ui.newPanel[0] || !ui.newPanel[0].wcb){return;}
					wc2.setActiveWcb(ui.newPanel[0].wcb)
				}
			});
		}
		//--- 이벤트 초기화
		,"initEvent":function(){
			
			var onDown = function(event) {
				console.log(event.type);
				if(event.type=="touchstart"){
					this.isTouch = true;
				}else if(this.isTouch){ //터치 이벤트 중에 마우스 다운 이벤트 발생시 흘러내린다
					return true;
				}

				event.bubble = false;
				event.stopPropagation();
				event.preventDefault(); //이벤트 취소시킨다.

				wc2.syncContext2dCfg(); //설정을 적용시킨다.
				if(!wc2Tool.init(wc2.tool)){
					alert(wc2Tool.error);
					return false;
				}
				
				if(!wc2Tool.onDown(wc2.tool,event)){
					wc2.setError( wc2Tool.error);
					return false;
				}
				wc2.eventStep = 1;
				return false;
			}
			var onMove = function(event) {
				//console.log(event.type);
				if(!wc2Tool.onMove(wc2.tool,event)){
					//wc2.setError( wc2Tool.error);
					return ; //이벤트를 계속 시킨다.
				}
				event.bubble = false;
				event.stopPropagation();
				event.preventDefault(); //이벤트 취소시킨다.
				// todo : context2D 설정 부분
				return false;
			}
			var onUp =  function(event) {
				//console.log(event.type);
				if(wc2.eventStep==0){ return ;} //down이벤트 후에만
				event.bubble = false;
				event.stopPropagation();
				event.preventDefault(); //이벤트 취소시킨다.
				// todo : context2D 설정 부분
				if(!wc2Tool.onUp(wc2.tool,event)){
					wc2.setError( wc2Tool.error,false);
					return true;
				}
				wc2.eventStep = 0;
				wc2.isTouch = false;
				wc2._syncPropList(); //수정된 내용 레이어 목록에 보여주기
				return false;
			}
			
			//if(document.hasOwnProperty('ontouchstart')){
				console.log("support touch device");
				$(document).on( "touchstart", ".wcb-frame",onDown );
				$(document).on( "touchmove", onMove );
				$(document).on( "touchend", onUp );
			//}
			$(document).on( "mousedown", ".wcb-frame",onDown );
			$(document).on( "mousemove", onMove);
			$(document).on( "mouseup", onUp);
			
			//--- 휠 동작
			$(document).on('mousewheel', ".wcb-frame", function(event) {
				if(!wc2Tool.onMouseWheel(wc2.tool,event)){
					//this.setError( wc2Tool.error);
					return; //false라도 잘못된것이 아니므로 흘러내린다.
				}
				wc2.eventStep = 0;
				wc2._syncPropList(); //수정된 내용 레이어 목록에 보여주기
			});
			
			// 드래그 방지용
			$('body').on("selectstart", function(event){ return false; });
			$('#contentArea').on("dragstart", function(event){ return false; });
			// 툴 panel
			$("#toolPanel").on("click",".btn[data-wc-tool]", function(event){ 
				wc2.setToolByBtn(this);
			});
			// 설정
			$("#propPanel").on("change", function(event){ 
				wc2.syncContext2dCfg(); //설정을 적용시킨다.
			});
			
			//-- 레이어 쪽
			$("#propLayerList").on("click","li",function(event){
				wc2.selectLayer(this.dataset.wcbIndex)
			});
		}
		//--- 히스토리
		,"saveHistory":function(action){
			this.activeWcb.saveHistory(action);
		}
		//--- 
		,"cmdWcb":function(cmd,arg1,arg2,arg3,arg4,arg5){
			if(cmd != "new" && !this.activeWcb){this.setError("활성화된 wcb 객체가 없음.");return false;}
			switch(cmd){
				case "clear":this.activeWcb.clear();this.saveHistory(cmd);break;
				case "new":(this.addWcb(arg1,arg2)).saveHistory(cmd);break;
			}
			this._syncPropList();
		}
		,"addWcb":function(width,height){
			var width = 300;
			var height =  300;
			var wcb = new WebCanvasBundle(width,height,[255,255,255]);
			wcb.tabFrame = document.createElement('div');
			wcb.tabFrame.wcb = wcb;
			wcb.tabFrame.id = "wcb-frame-"+(++this.wcbTmpCnt);
			wcb.wcbFrame = document.createElement('div');
			wcb.wcbFrame.className = "wcb-frame";
			wcb.tabTitleLi = document.createElement('li');
			wcb.tabTitleLi.className = "wcb-title-li"; 
			wcb.tabTitleA = document.createElement('a');
			wcb.tabTitleA.href="#"+wcb.tabFrame.id;
			
			$(wcb.tabTitleLi).append(wcb.tabTitleA);
			$(wcb.tabTitleA).text("xxxxxx");
			//$("#tabsTitle").append(wcb.tabTitleLi);
			$(wcb.tabFrame).append(wcb.wcbFrame);
			$(wcb.wcbFrame).append(wcb.node);
			
			
			
			
			this.wcbs.push(wcb);
			this.setActiveWcb(wcb);
			this.renameWcb($.format.date(new Date(),'yyyyMMddHHmmss'));
			
			$( "#tabsTitle" ).append(wcb.tabTitleLi);
			//this.tabs.append(wcb.wcbFrame);
			$( "#tabsContent" ).append(wcb.tabFrame);
			this.tabs.tabs("refresh");
			this.tabs.tabs({"active":-1});
			this._syncPropList();
			return wcb;
		}
		,"setActiveWcb":function(wcb){
			this.activeWcb = wcb;
			this._syncPropList();
			wc2Tool.init(this.tool);
			return this.activeWcb;
		}
		,"renameWcb":function(name){
			if(!this.activeWcb){return false;}
			if(this.activeWcb.setName(name)){
				$(this.activeWcb.tabTitleA).text(name);
			}
		}
		,"closeWcb":function(wcb){
			if(wcb == undefined){
				wcb= this.activeWcb;
			}
			for(var i=0,m=this.wcbs.length;i<m;i++){
				if(this.wcbs[i] == wcb){
					this.wcbs.splice(i,1);
					$(wcb.tabTitleLi).remove();
					$(wcb.tabFrame).remove();
					break;
				}
			}
			this.setActiveWcb(this.wcbs[0]);
			this.tabs.tabs("refresh");
			this._syncPropList();
		}
		,"closeWebCanvasWindow":function(){
			$( this.activeWcw ).dialog( "close" );
		}
		,"removeWebCanvasWindow":function(wcw){
			if(wcw == undefined){
				wcw = this.activeWcw;
			}
			for(var i=0,m=this.wcws.length;i<m;i++){
				if(this.wcws[i].wcb == wcw.wcb){
					this.wcws.splice(i,1);break;
				}
			}
			$(wcw).dialog('destroy');
			$(wcw).remove();
			this.activeWebCanvasWindow(this.wcws[0]);
		}

		,"activeWebCanvasWindow":function(wcw){
			if(wcw == undefined){
				this.activeWcw = null;
				this._syncPropList();
				return;
			}
			if(wcw.wcwp.hasClass("wcw-active")){
				return true;
			}
			this.activeWcw = wcw;
			for(var i=0,m=this.wcws.length;i<m;i++){
				if(this.wcws[i].wcb == wcw.wcb){
					this.wcws[i].wcwp.addClass("wcw-active");
				}else{
					this.wcws[i].wcwp.removeClass("wcw-active");
				}
			}
			this._syncPropList();
			return true;
		}
		,"rename":function(name){
			if(!this.activeWcb){return false;}
			if(!this.activeWcb.setName(name)){return false;}
			
			this.activeWcw.dialog( "option", "title",name );
		}
		,"setTool":function(tool){
			if(!wc2Tool[tool]){
				this.setError( tool+"라는 툴이 지원되지 않습니다.");
				return false;
			}
			//this.tool = wc2Tool[tool];
			this.tool = tool;
			this.showPropPanel();
			wc2.syncContext2dCfg(); //설정을 적용시킨다.
			if(!wc2Tool.init(this.tool)){
				//alert(wc2Tool.error);
				return false;
			}
			
			return this.tool;
		}
		,"setToolByBtn":function(btn){
			
			if(!btn.dataset || !btn.dataset.wcTool){
				this.setError( "wc2.setToolByBtn() : 필수 애트리뷰트가 없습니다.");
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
			
			var x = evt.clientX;
			var y = evt.clientY;
			if(evt.touches && evt.touches[0]){
				var touch = evt.touches[0];
				var x = touch.X;
				var y = touch.Y;
			}else if(evt.originalEvent.touches && evt.originalEvent.touches[0]){
				var touch = evt.originalEvent.touches[0];
				var x = touch.clientX;
				var y = touch.clientY;
			}
			
			return {
			  "x": x - rect.left + scrollTop,
			  "y": y - rect.top + scrollLeft
			};
		}
		,"getOffsetXY":function(evt,target,zoom){ //지금인 이 메소드 쓰지 않는다 추후 생각해보자.
			var xy = this.getMousePos(evt,target);
			return { "x":xy.x/zoom,"y":xy.y/zoom};
		}
		,"showPropPanel":function(){
			var className = ".wc-tool-"+this.tool;
			$("#propPanel .wc-tool").hide();
			$("#propPanel "+className).show();
		}
		,"syncContext2dCfg":function(){
			if(!this.activeWcb){return;}
			var className = "form.wc-tool-"+this.tool;
			this.activeWcb.configContext2d(this.defaultContext2dCfg); //기본값으로 덮어 씌운다.
			$("#propPanel "+className).each(
				function(){
					var cfg = $(this).serializeObject();
					
					//console.log(this.name);
					//console.log(cfg);
					wc2.activeWcb.configContext2d(cfg);
				}
			)
		}
		//--- 레이어 관련
		//-- 레이어 싱크
		,"_syncPropList":function(){
			if(!this.activeWcb){ 
				$("#propLayerList").html("").append('<li class="list-group-item">#EMPTY#<li>')
				$("#propHistoryList").html("").append('<li class="list-group-item">#EMPTY#<li>')
			}else{
				var wcb = this.activeWcb;
				//--- 레이어 싱크
				var propLayerList = $("#propLayerList").html("");
				var limitHeight = 40;
				var c = WebCanvas(Math.round(wcb.width*(limitHeight/wcb.height)),limitHeight);
				for(var i=wcb.webCanvases.length-1,m=0;i>=m;i--){
					c.copy(wcb.webCanvases[i],0,0,c.width,c.height);
					var oc = wcb.webCanvases[i];
					try{
						var img = new Image();
						img.src = c.toDataURL();
					}catch(e){
						this.setError(e.toString());
						var img = document.createElement('span');
						img.className="glyphicon glyphicon-sunglasses";
						img.title="not support Preview"
						
					}
					var li = document.createElement("li");
					li.className="list-group-item";
					li.dataset.wcbActive = oc.dataset.wcbActive;
					li.dataset.wcbIndex = oc.dataset.wcbIndex;
					li.title = oc.label;
					img.alt = oc.label;
					img.title = oc.label;
					$(li).append(img);
					$(li).append(document.createTextNode(wcb.webCanvases[i].label));
					propLayerList.append(li)
					//console.log(wcb.webCanvases[i].alt);
				}
				//--- 히스토리 싱크
				var propHistoryList = $("#propHistoryList").html("");
				var limitHeight = 40;
				var tTime = (new Date()).getTime();
				for(var i=wcb.historyLog.length-1,m=0;i>=m;i--){
					var li = document.createElement("li");
					li.className="list-group-item";
					if(wcb.historyIdx==i){
						li.className += " active";
					}
					li.title = wcb.historyLog[i].action;

					$(li).append(document.createTextNode(li.title+" ["+((wcb.historyLog[i].time-tTime)/1000).toFixed(2)+" sec]"));
					propHistoryList.append(li)
					//console.log(wcb.webCanvases[i].alt);
				}
			}
			
		}
		,"cmdLayer":function(cmd){
			if(!this.activeWcb){ this.setError( "wc2.cmdLayer() 활성화된 윈도우가 없습니다."); return; }
			var r = null;
			switch(cmd){
				case "clear":r = this.activeWcb.activeWebCanvas.clear();break;
				case "add":r = this.activeWcb.addWebCanvas();break;
				case "duplicate":r = this.activeWcb.addDuplicateWebCanvas();break;
				case "mergeDown":r = this.activeWcb.mergeDown();break;
				case "remove":r = this.activeWcb.removeWebCanvas();break;
				case "moveUp":r = this.activeWcb.moveUpWebCanvasByIndex();break;
				case "moveDown":r = this.activeWcb.moveDownWebCanvasByIndex();break;
			}
			this.cmdTool("reset");
			this._syncPropList();
		}
		,"selectLayer":function(index){
			if(!this.activeWcb){ this.setError( "wc2.addLayer() 활성화된 윈도우가 없습니다."); return; }
			wc2Tool.reset(this.tool);
			this.activeWcb.setActiveWebCanvasByIndex(index);
			wc2Tool.init(this.tool);
			this._syncPropList();
		}
		//--- 확대/축소
		,"setZoom":function(zoom){
			if(!this.activeWcb){ this.setError( "wc2.addLayer() 활성화된 윈도우가 없습니다."); return; }
			this.activeWcb.setZoom(zoom);
		}
		
		//--- tool confirm/reset
		,"cmdTool":function(cmd){
			switch(cmd){
				case "confirm":wc2Tool.confirm(this.tool);wc2._syncPropList();break;
				case "reset":wc2Tool.reset(this.tool);wc2Tool.init(this.tool);break;
				case "predraw":wc2.syncContext2dCfg();wc2Tool.predraw(this.tool,this.activeWcb);break;
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
		//--- 뷰 이미지 
		,"viewImage":function(){
			if(!wc2.activeWcb){
				this.setError( "wc2.viewImage() : 활성화된 윈도우가 없음");
				return false;
			}
			var div = document.createElement('div');
			div.className = "wc-viewImage";
			var img = new Image();
			img.title = wc2.activeWcb.name;
			img.className ="wc-viewImage";
			$(div).append(img);
			$(img).bind("load",function(event){
				$( this ).parent().dialog({"resizable":true,"draggable":true,
					"position": { my: "center top" , at: "center top", of: "#contentArea" },
					"modal":true,
					"title":wc2.activeWcb.name+" (view)",
					"close": function( event, ui ) {
						$(this).dialog('destroy').remove();
					},
				});
			})
			img.src = wc2.activeWcb.toDataURL();
		}
		//--- 색상관련
		,"initColorPalette":function(){
			this.strokeStyle = document.getElementById('strokeStyle');
			$(this.strokeStyle).spectrum({
					//color: "#000",
					//showAlpha: true,
					showInput: true,
					className: "strokeStyle",
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					containerClassName: 'colorPalette',
					maxPaletteSize: 20,
					preferredFormat: "rgb",
					localStorageKey: "wc2.strokeStyle",
					change: function(color) {
						this.value = color.toRgbString();
						wc2.cmdTool('predraw')
					}
			});
			this.fillStyle = document.getElementById('fillStyle');
			$(this.fillStyle).spectrum({
					//color: "#fff",
					//showAlpha: true,
					showInput: true,
					className: "fillStyle",
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					containerClassName: 'colorPalette',
					maxPaletteSize: 20,
					preferredFormat: "hex",
					localStorageKey: "wc2.fillStyle",
					change: function(color) {
						this.value = color.toRgbString();
						wc2.cmdTool('predraw')
					}
			});
			//-- 파레트 더블 클릭으로 색상 선택되도록
			$(".colorPalette").on("dblclick",".sp-sat", function (e) {
				e.stopPropagation();
				e.preventDefault();
				$(this).parents(".sp-container").find(".sp-choose").click();
			});
			return true;
		}
		,"excangeColor":function(){
			var c0 = this.strokeStyle.value;
			var c1 = this.fillStyle.value;
			this.setStrokeColor(c1);
			this.setFillColor(c0);
			return true;
		}
		,"setStrokeColor":function(val){
			$( this.strokeStyle).spectrum("set", val);
			return true;
		}
		,"setFillColor":function(val){
			$( this.fillStyle).spectrum("set", val);
			return true;
		}
		,"setSpuitColorTo":function(ta){
			var c = $("#divSelectedColorSpuit").css("backgroundColor");
			if(ta == "stroke"){
				this.setStrokeColor(c)
			}else{
				this.setFillColor(c)
			}
			return true;
		}
	};
})();