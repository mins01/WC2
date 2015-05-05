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
		 ,"activeWcb":null
		 ,"tool":null
		 ,"eventStep":0
		 ,"wcbTmpCnt":0
		 ,"isDown":false //마우스 등이 눌려져있는가?
		 ,"isTouch":false //터치 이벤트로 동작중인가?
		 ,"usePreviewImageAtLayerInfo":0 //미리보기 이미지 사용하는가?
		 ,"brushWC":null //브러쉬용
		 ,"brushSpacing":1 //브러쉬 간격
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
			//this.cmdWcb("new",300,300);
			this.hideMenuDetail();
			this.setTool("brush");
		}
		,"setError":function(error,disableShow){
			this.error = error;
			if(!disableShow) console.log(this.error);
			return this.error;
		}
		//--- UI초기화
		,"initUI":function(){
			//-- 탭 초기화
			this.tabs = $( "#tabs" ).tabs({
				"activate": function( event, ui ) {
					if(!ui.newPanel[0] || !ui.newPanel[0].wcb){return;}
					wc2.cmdWcb("active",ui.newPanel[0].wcb); //Tab이 active되면 관련 wcb도 active가 된다.
				}
			});
			//-- 브러쉬 초기화
			this.brushWC = WebCanvas(100,100);
			$("#formToolBrushCanvasBox").append(this.brushWC.node);
			this.syncBrushCanvas();
		}
		//--- 이벤트 초기화
		,"initEvent":function(){
			
			var onDown = function(event) {
				if(event.target.tagname=="select"){
					return true;
				}
				if(event.type=="touchstart"){
					this.isTouch = true;
				}else if(this.isTouch){ //터치 이벤트 중에 마우스 다운 이벤트 발생시 흘러내린다
					return true;
				}
				document.activeElement.blur(); //텍스트박스등의 포커스를 없앤다.
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
				wc2._syncWcbInfo(); //수정된 내용 레이어 목록에 보여주기
				return false;
			}
			
			$(document).on( "touchstart", ".wcb-frame",onDown );
			$(document).on( "touchmove", onMove );
			$(document).on( "touchend", onUp );
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
				//wc2._syncWcbInfo(); //수정된 내용 레이어 목록에 보여주기
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
				wc2.cmdLayer("select",this.dataset.wcbIndex)
			});
			//-- 단축키
			Mousetrap.bind('ctrl+z', function(event) { wc2.cmdWcb("undo"); });
			Mousetrap.bind(['ctrl+shift+z','ctrl+y'], function(event) { wc2.cmdWcb("redo"); });
			//-- 메뉴 부분 이벤트 처리용
			$("#topMenu").on("click","a[data-wc-menu]",function(event){
				wc2.btnShowMenuDetail(event.target);
				return;
			});
			
			
		}
		//--- 히스토리
		,"saveHistory":function(action){
			this.activeWcb.saveHistory(action);
		}
		,"resaveHistory":function(){
			this.activeWcb.resaveHistory();
		}
		//--- 
		// 한번에 다중 레이어처리의 경우 resaveHistory()로 모든 레이어에대한 히스토리를 남겨야한다.(안그러면 undo때 레이어 내용이 없음)
		,"cmdWcb":function(cmd,arg1,arg2,arg3,arg4,arg5){
			if(cmd != "new" && cmd != "open" && cmd !="active" && !this.activeWcb){this.setError("활성화된 wcb 객체가 없음.");return false;}
			var sync = true;
			//var history = true; 동작별로 히스토리 사용이 들죽 날죽해서 공통처리 안 한다.
			switch(cmd){
				case "active":
					if(this.activeWcb != arg1){
						if(this.activeWcb) this.resaveHistory(); //wcb를 바꾸기전에 히스토리에 내용을 남긴다.
						this.setActiveWcb(arg1);
					}
				break;
				case "clear":
						this.resaveHistory();
						this.activeWcb.clear();
						this.saveHistory("Image."+cmd);
				break;
				case "crop":
						this.resaveHistory();
						this.activeWcb.crop(arg1,arg2,arg3,arg4);
						this.saveHistory("Image."+cmd);
				break;
				case "new":
					var wcb = this.newWcb(arg1,arg2)
					wcb.saveHistory("Image."+cmd);
					//this.cmdWcb("active",wcb);  //setTimeout(function(){ wc2.tabs.tabs({"active":-1})} , 100); // 여기서 한다.
					sync = false;
				break;
				case "open":
					if(arg1.wcbdo){ //wcb.json 을 읽어드렸다.
						var wcb = this.newWcbByWcbdo(arg1.wcbdo,
								function(cmd){
									return function(wcb){
										wcb.saveHistory("Image."+cmd);
										//wc2.cmdWcb("active",wcb);  //setTimeout(function(){ wc2.tabs.tabs({"active":-1})} , 100); // 여기서 한다.
										//console.log("end");
									}
								}(cmd)
							);
						sync = false;
					}else{
						var wcb = this.newWcbByImage(arg1);
						if(wcb){
							wcb.saveHistory("Image."+cmd);
							//this.cmdWcb("active",wcb); //setTimeout(function(){ wc2.tabs.tabs({"active":-1})} , 100); // 여기서 한다.
							sync = false;
						}
					}
				break;
				case "close":
					if(confirm("Close?")){
						this.closeWcb();
					}
				break;
				
				case "rename":
					if(this.activeWcb.setName(arg1)){
						$(this.activeWcb.tabTitleA).text(arg1);
						this.saveHistory("Image."+cmd);
					}
					
				break;
				
				case "resize":
					this.resaveHistory();
					if(this.activeWcb.resize(arg1,arg2)){
						this.saveHistory("Image."+cmd);
					}
				break;
				case "adjustSize":
					this.resaveHistory();
					if(this.activeWcb.adjustSize(arg1,arg2,arg3)){
						this.saveHistory("Image."+cmd);
					}
				break;
				
				//-- 단순호출처리
				case "undo":
				case "redo":
					this.cmdTool("reset");
					if(this.activeWcb[cmd]){
						sync = this.activeWcb[cmd]();
					}
				break;
				case "save":
					this.saveWcb(arg1,arg2,arg3);
				break;
				default:
				this.setError("지원되지 않는 메소드");
				break;
			}
			if(sync){
				this._syncWcbInfo();
			}
			
		}
		,"saveWcb":function(filename,type,quality){
			var dataURL = this.activeWcb.toDataURL(type,quality);
			if(dataURL === false){
				alert(this.activeWcb.error);
				return false;
			}
			return wc2Helper.saveAs(wc2Helper.dataURL2Blob(dataURL),filename);
		}
		,"addWcb":function(width,height){
			var width = 300;
			var height =  300;
			return this.newWcb(width,height);
		}
		,"_addWcb":function(wcb){
			//wcb.addWebCanvas(); //빈 레이어 하나 추가
			wcb.tabFrame  = $("#defaultTabContent").clone()[0];
			wcb.tabFrame.wcb = wcb;
			wcb.tabFrame.id = "wcb-frame-"+(++this.wcbTmpCnt);
			

			wcb.wcbFrame = $(wcb.tabFrame).find('.wcb-frame')[0];
			wcb.wcbMove = $(wcb.tabFrame).find('.wcb-move')[0];
			wcb.wcbBox = $(wcb.tabFrame).find('.wcb-box')[0];
			$(wcb.wcbMove).css("left","0px").css("top","0px")
			
			wcb.tabTitleLi = document.createElement('li');
			wcb.tabTitleLi.className = "wcb-title-li"; 
			wcb.tabTitleA = document.createElement('a');
			wcb.tabTitleA.href="#"+wcb.tabFrame.id;
			
			$(wcb.tabTitleLi).append(wcb.tabTitleA);
			$(wcb.tabTitleA).text("TITLE");
			$(wcb.tabFrame).append(wcb.wcbFrame);
			$(wcb.wcbFrame).append(wcb.wcbMove);
			//$(wcb.wcbMove).append(wcb.node);
			$(wcb.wcbBox).append(wcb.outNode);
			
			$(wcb.tabFrame).on("change",".wcb-zoom",
				function(wcb){
					return function(event){
						wcb.setZoom(this.value);
					}
				}(wcb)
			);
			
			this.wcbs.push(wcb);
			
			$( "#tabsTitle" ).append(wcb.tabTitleLi);
			$( "#tabsContent" ).append(wcb.tabFrame);
			this.tabs.tabs("refresh");
			setTimeout(function(){ wc2.tabs.tabs({"active":-1})} , 100); // IE에서는 제대로 동작 안해서
			
			return wcb;
		}
		,"newWcb":function(width,height){
			if(isNaN(width) || isNaN(height)){
				this.setError("width , height 가 잘못 설정되었습니다.");
				return false;
			}
			var wcb = new WebCanvasBundle(width,height,[255,255,255]);
			wcb.addWebCanvas(); //빈 레이어 하나 추가
			wcb.setName($.format.date(new Date(),'yyyyMMddHHmmssSSS '));
			return this._addWcb(wcb);
		}
		,"newWcbByImage":function(image){
			var wcb = new WebCanvasBundle(100,100);
			if(wcb.openByImage(image)=== false){
				this.setError(wcb.error);
				return false;
			}
			wcb.addWebCanvas(); //빈 레이어 하나 추가
			wcb.setName($.format.date(new Date(),'yyyyMMddHHmmss'));
			return this._addWcb(wcb);
		}
		,"newWcbByWcbdo":function(wcbdo,onload){
			var wcb = new WebCanvasBundle(100,100);
			var callback = function(wcb,onload){
				return function(){
					onload(wcb);
					wc2._addWcb(wcb);
				}
			}(wcb,onload)
			if(wcb.openByWcbDataObj(wcbdo,callback)=== false){
				this.setError(wcb.error);
				return false;
			}
			//wcb.addWebCanvas(); //빈 레이어 하나 추가 이미 레이저가 지원되는 구조이기 때문에 추가 레이어를 생성하지 않는다.
			//wcb.setName($.format.date(new Date(),'yyyyMMddHHmmss')); 이미 이름이 있으므로 안 바꾼다.
			return wcb;
		}
		,"setActiveWcb":function(wcb){
			this.activeWcb = wcb;
			wc2Tool.init(this.tool);
			this.cmdTool("reset");
			return this.activeWcb;
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
			
			this.tabs.tabs("refresh");
			this.cmdWcb("active",this.wcbs[0]);
			setTimeout(function(){ wc2.tabs.tabs({"active":-1})} , 100); // IE에서는 제대로 동작 안해서
			//this._syncWcbInfo();
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
			
			$("button[data-wc-tool]").each(
				function(){
					$(this).removeClass("active")
				}
			)
			$("button[data-wc-tool='"+tool+"']").each(
				function(){
					$(this).addClass("active")
				}
			)
			
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
		//-- 레이어 싱크 (최적화 필요)
		,"_syncWcbInfo":function(){
			if(!this.activeWcb){ 
				$("#propLayerList .wc-prop-layer-empty").show();
				$("#propHistoryList .wc-prop-history-empty").show();
				$("#propLayerList .wc-prop-layer-info").hide();
			}else{
				var usePreviewImageAtLayerInfo = this.getUsePreviewImageAtLayerInfo();
				$("#propLayerList .wc-prop-layer-empty").hide();
				$("#propLayerList")[0].dataset.wc2Preview = usePreviewImageAtLayerInfo;

				var wcb = this.activeWcb;
				//-- 제목 싱크
				$(wcb.tabTitleA).text(wcb.name);
				//--- 레이어 싱크
				//var propLayerList = $("#propLayerList").html("");
				var height = 40;
				var width = Math.round(wcb.width*(height/wcb.height));
				if(width>40){
					height = Math.round(height*(40/width));
					width=40;
				}
				var marginTop = (40-height)/2
				var lis = $("#propLayerList .wc-prop-layer-info");
				var propLayerList = $("#propLayerList");
				for(var i=0,m=wcb.webCanvases.length-lis.length ;i<m;i++){ //모자른 lis를 생성하지
					var li = document.createElement("li");
					li.className="list-group-item wc-prop-layer wc-prop-layer-info";
					li.wc = WebCanvas(width,height);
					li.appendChild(li.wc.node);
					li.span =  document.createElement("span");
					li.appendChild(li.span);
					propLayerList.append(li);
				}
				var lis = $("#propLayerList .wc-prop-layer-info");
				lis.hide(); //우선 모두 숨긴다.
				var tmpli_i = 0;
				var his = wcb.currentHistory();
				for(var i=wcb.webCanvases.length-1,m=0;i>=m;i--){
					var oc = wcb.webCanvases[i];
					var li = lis[tmpli_i];
					$(li).show();
					li.dataset.wcbActive = oc.dataset.wcbActive;
					li.dataset.wcbIndex = oc.dataset.wcbIndex;
					li.title = oc.label;
					//설정을 체크 하고 히스토리를 참고해서 히스토리가 변경된것만 갱신한다.
					if(usePreviewImageAtLayerInfo==1 && his && his.data[i] != null){
						//try{
							li.wc.setLabel(oc.label+"-pre");
							li.wc.clearResize(width,height);
							li.wc.drawImage(oc,0,0,li.wc.width,li.wc.height);
							li.wc.setOpacity(oc.opacity);
							li.wc.node.style.marginTop = marginTop+"px";
						//}catch(e){li.wc.node.className="glyphicon glyphicon-sunglasses";}
						//console.log("pre 갱신",li.wc.label);
					}
					
					$(li.span).text(oc.label)
					tmpli_i++;
				}
				
				/*
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
				*/
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
					var tm = $.format.date(new Date(wcb.historyLog[i].time),'mm:ss');
					$(li).append(document.createTextNode("["+tm+"] "+li.title));
					propHistoryList.append(li)
					//console.log(wcb.webCanvases[i].alt);
				}
				//--- wcb.name
				$(wcb.tabTitleA).text(wcb.name)
			}
			this._syncWcInfo();
		}
		//활성화된 레이어 정보 갱신
		,"_syncWcInfo":function(){
			if(this.activeWcb && this.activeWcb.activeWebCanvas){
				document.formPropLayer.layerOpacity.value = this.activeWcb.activeWebCanvas.opacity;
			}
		}
		,"cmdLayer":function(cmd,arg1,arg2,arg3){
			if(!this.activeWcb){ this.setError( "wc2.cmdLayer() 활성화된 윈도우가 없습니다."); return; }
			var sync = true;
			var history = true;
			var r = null;
			switch(cmd){
				case "clear":history = this.activeWcb.activeWebCanvas.clear();break;
				case "new":
				case "add":history = this.activeWcb.addWebCanvas();break;
				case "duplicate":history = this.activeWcb.addDuplicateWebCanvas();break;
				case "mergeDown":history = this.activeWcb.mergeDown();break;
				case "remove":
					this.resaveHistory();
					history = this.activeWcb.removeWebCanvas();break;
				case "moveUp":
					this.resaveHistory();
					history = this.activeWcb.moveUpWebCanvasByIndex();break;
				case "moveDown":
					this.resaveHistory();
					history = this.activeWcb.moveDownWebCanvasByIndex();break;
				case "opacity":history = this.activeWcb.activeWebCanvas.setOpacity(arg1);break;
				case "select":r = this._selectLayer(arg1); history = false; break;
			}
			if(history){
				this.saveHistory("Layer."+cmd);
			}
			this.cmdTool("reset");
			if(sync){
				this._syncWcbInfo();
			}
		}
		,"_selectLayer":function(index){
			if(!this.activeWcb){ this.setError( "wc2._selectLayer() 활성화된 윈도우가 없습니다."); return; }
			wc2Tool.reset(this.tool);
			this.activeWcb.setActiveWebCanvasByIndex(index);
			wc2Tool.init(this.tool);
			return true;
		}
		//--- 확대/축소
		,"setZoom":function(zoom){
			if(!this.activeWcb){ this.setError( "wc2.setZoom() 활성화된 윈도우가 없습니다."); return; }
			this.activeWcb.setZoom(zoom);
		}
		
		//--- tool confirm/reset
		,"cmdTool":function(cmd){
			switch(cmd){
				case "confirm":wc2Tool.confirm(this.tool);wc2._syncWcbInfo();break;
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
					color: "rgb(0,0,0)",
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
					color: "rgb(255,255,255)",
					//showAlpha: true,
					showInput: true,
					className: "fillStyle",
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					containerClassName: 'colorPalette',
					maxPaletteSize: 20,
					preferredFormat: "rgb",
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
			$( this.strokeStyle).val(val).spectrum("set", val);
			return true;
		}
		,"setFillColor":function(val){
			$( this.fillStyle).val(val).spectrum("set", val);
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
		//--- 메뉴 상세 설정 화면용
		,"hideMenuDetail":function(){
			$("#menuDetailArea").hide()
			return true;
		}
		,"btnHideMenuDetail":function(event,tagName){
			if(event.target.tagName == tagName.toUpperCase()){
				return this.hideMenuDetail();
			}
			return;
		}
		,"showMenuDetail":function(menu){
			$("#menuDetailArea").show().find(".wc-mdetail").each(
				function(){
					$(this).hide();
				}
			)
			var t = $("#menuDetailArea").find(".wc-mdetail-"+menu)
			t.show();
			
			if(this.activeWcb){
				switch(menu){
					case "file-save":t[0].saveFileName.value = this.activeWcb.name;break;
					case "image-rename":t[0].renameName.value = this.activeWcb.name;break;
					case "image-adjustSize":
					case "image-resize":t[0].width.defaultValue = t[0].width.value = this.activeWcb.width;
												t[0].height.defaultValue = t[0].height.value = this.activeWcb.height;
					break;
				}
			}
		}
		//-- UI 메뉴용
		,"btnShowMenuDetail":function(menuBtn){
			return this.showMenuDetail(menuBtn.dataset.wcMenu)
		}
		//--
		,"btnFileOpenPreviewImage":function(el){
			var preview = document.getElementById('formMenuDetailFileOpenPreview');
			preview.wcbdo = null;
			if(el.type=="text" && el.value.length > 0){
				preview.src = el.value;
			}else if(el.type=="file"  && el.value.length > 0){
				if(el.value.indexOf("wcbjson")!= -1){ //전용 파일
					wc2Helper.loadInputFile(el , function(){
						return function(result){
							var wcbdo = JSON.parse(result);// wcbDataObject
							preview.wcbdo = wcbdo; //이 값이 false가 아니면 wcbdo로 읽어오게 한다.
							preview.src = wcbdo.preview.dataURL;
						}
					}(preview),"readAsText");
				}else{
					wc2Helper.loadInputFileAndView(el , preview);
				}
			}
			return false;
		}
		,"btnFileSave":function(form){
			var saveFileName = form.saveFileName.value
			var saveFileType = form.saveFileType.value
			if(saveFileType.length > 0){
				saveFileName+="."+saveFileType;
			}
			var saveFileQuality = form.saveFileQuality.value
			return this.cmdWcb("save",saveFileName,saveFileType,saveFileQuality);
		}
		,"preferencesByForm":function(form){
			var arr = $(form).serializeArray();
			for(var i=0,m=arr.length;i<m;i++){
				var el = arr[i];
				if(this[el.name]!=undefined){
					if(typeof this[el.name] == "number"){
						this[el.name] = parseFloat(el.value);
					}else{
						this[el.name] = el.value;
					}
					
				}
			}
		}
		//미리보기 사용여부를 너비 기준으로 처리한다.
		,"getUsePreviewImageAtLayerInfo":function(){
			if(this.usePreviewImageAtLayerInfo===0){
				var rect = document.body.getBoundingClientRect();
				if(rect.width<768){
					return 2;
				}else{
					return 1;
				}
			}
			return this.usePreviewImageAtLayerInfo;
		}
		//브러쉬 정보 싱크 그리기
		,"syncBrushCanvas":function(){
			var f = document.formToolBrush;
			var fc = document.formColor;
			var width = parseFloat(f.width.value);
			var r0p = parseFloat(f.r0p.value);
			this.brushSpacing  = parseFloat(f.brushSpacing.value);
			var globalAlpha = parseFloat(f.globalAlpha.value);
			var strokeStyle = fc.strokeStyle.value;
			var fillStyle = fc.fillStyle.value;

			
			var color0 = strokeStyle.replace('rgb','rgba').replace(')',',1)');
			var color1 = strokeStyle.replace('rgb','rgba').replace(')',',0)');
			//console.log(strokeStyle,color0);
			var x0 ,y0 ,r0,x1 ,y1, r1;
			x0 = y0 = r1 = x1 = y1  = width/2;
			r0 = Math.min(x0*r0p,x0*0.99);
			//console.log(r1,r0);
			this.brushWC.clearResize(width,width);
			var rg = this.brushWC.cmdContext2d("createRadialGradient",x0,y0,r0,x1,y1,r1);
			rg.addColorStop(0,color0);
			rg.addColorStop(1,color1);
			this.brushWC.configContext2d({"fillStyle":rg,"disableStroke":1,"globalAlpha":globalAlpha})
			this.brushWC.rect(0,0,width,width);
			this.brushWC.configContext2d({"fillStyle":color0,"disableStroke":1,"globalAlpha":globalAlpha})
			this.brushWC.circle(x0,y0,r0);
			
			return true;
		}
	};
})();