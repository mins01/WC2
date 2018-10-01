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
		 ,"usePointerType":'ALL' //사용할 포인터 타입
		 ,"brushSpacing":1 //브러쉬 간격
		 ,"brushIMG":null //브러쉬용
		 ,"brush4Brush":null
		 ,"tabsContent":null
		 ,"deviceWidth":0
		 ,"eraserIMG":null //지우개용
		 ,"brush4eraser":null
		 ,"uploadURL":"/WG2/up.php"
		 ,"defaultContext2dCfg":{ //상세 설명은 https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D 을 참고
								"fillStyle":  "rgba(0, 0, 0, 0)",
								"font": "10px sans-serif",
								"globalAlpha": 1, // 0~1
								"globalCompositeOperation": "source-over", //source-atop,source-in,source-out,source-over (default),destination-atop,destination-in,destination-out,destination-over,lighter,copy,xor , vendorName-operationName(etc) //https://developer.mozilla.org/samples/canvas-tutorial/6_1_canvas_composite.html
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
								"filter":"none", // 지원 안되는 브라우저가 많다.(크롬 52이상 필요)
								}
		,"useOnbeforeunloadForDocument":true //저장안하고 나갈때 경고 사용여부
		 //--- 초기화
		,"init":function(){
			this.initVar();
			this.initUI();
			this.initEvent();
			this.initColorPalette();
			//this.addWebCanvasWindow(300,300);
			//this.addWcb(300,300);
			//this.cmdWcb("new",300,300);
			this.hideMenuDetail();
			this.setTool("brush");
			//this.hideFilterDetail();
			this.loadSetting();
			this.initAutoWcbLocalStorage();

			// this.setTool("brush");
			// this.syncBrush(document.formToolBrush)
			$("button[data-wc-tool='brush']").trigger("click");
		}
		,"initVar":function(){
			//-- viewport 확대비율
			var _viewportContentScale = 1;
			Object.defineProperty(this, 'viewportContentScale', {
				get:function(){ return _viewportContentScale; },
				set:function(wc2){
						return function(newValue){
							_viewportContentScale = newValue;
							wc2.changeViewport(_viewportContentScale);
					}
				}(this),
				enumerable: true,
				configurable: false
			});

		}
		,"setError":function(error,disableShow){
			this.error = error;
			if(!disableShow) console.log(this.error);
			return this.error;
		}
		//--- UI초기화
		,"initUI":function(){
			//-- 장치 device-width 체크
			var rect = document.body.getBoundingClientRect();
			this.deviceWidth = rect.width; //모바일이라면 사용할겠지
			//-- 탭 초기화
			this.tabs = $( "#tabs" ).tabs({
				"activate": function( event, ui ) {
					if(!ui.newPanel[0] || !ui.newPanel[0].wcb){return;}
					wc2.cmdWcb("active",ui.newPanel[0].wcb); //Tab이 active되면 관련 wcb도 active가 된다.
				}
			});
			this.tabsContent = document.getElementById('tabsContent');
			//-- 브러쉬 초기화
			this.brush4Brush = new wc2Brush();
			//$("#formToolBrushCanvasBox").append(this.brush4Brush.brushWC);
			$("#formToolBrushCanvasBox").append(this.brush4Brush.previewBrushWC);
			this.syncBrush();
			//--- 지우개 초기화
			this.brush4Eraser = new wc2Brush();
			//$("#formToolEraserCanvasBox").append(this.brush4Eraser.brushWC);
			$("#formToolEraserCanvasBox").append(this.brush4Eraser.previewBrushWC);
			this.syncEraser();
			//--- 초기화 이미지 onload 처리
			/*
			t.find("img")[0].onload = function(event){
				document.formToolBrush.brush = this;
				wc2.syncBrush();
				wc2.syncEraser();
			}
			*/
			//--- 패턴 목록
			var t = $("#toolPatternList");
			for(var i=0,m=wc2PatternList.length;i<m;i++){
				if(wc2PatternList[i].indexOf('data')===0){
					var src = wc2PatternList[i];
				}else{
					var src = wc2PatternList.dir+"/"+wc2PatternList[i];
				}
				var str = '<img class="bg-grid" src="'+src+'" >'
				t.append(str);
			}
			t.on( "click", "img", function(event){
				wc2.syncPattern(event.target);
			});
			t.find("img")[0].onload = function(event){
				//imagePattern
				wc2.syncPattern(this);
			}
			//--- 필터 설정 부분
			this.filterPreviewWC = WebCanvas(100,100);
			$(this.filterPreviewWC).addClass("bg-grid");
			var t = $("#filterCanvasBox");
			t.html("").append(this.filterPreviewWC.node);

			//--- 저장 가능 이미지 타입 표시제한
			if(!wc2Helper.isSupportedImageType('image/png')){
				$(".image-type-png").hide().prop('disabled',true);
			}
			if(!wc2Helper.isSupportedImageType('image/jpeg')){
				$(".image-type-jpg").hide().prop('disabled',true);
			}
			// if(!wc2Helper.isSupportedImageType('image/gif')){
			// 	$(".image-type-gif").hide().prop('disabled',true);
			// }
			if(!wc2Helper.isSupportedImageType('image/webp')){
				$(".image-type-webp").hide().prop('disabled',true);
			}

		}
		//--- 이벤트 초기화
		,"initEvent":function(){

			// 붙여넣기 열기 이벤트 처리
			$(document).on("paste",function(event){ wc2.btnFileOpenPreviewImageFromPaste(event.originalEvent);});

			var onDown = function(event) {
				var evt = event.originalEvent?event.originalEvent:event;
				if(event.target.tagname=="select"){
					return true;
				}
				if(event.type.indexOf("pointer")===0){
					if(wc2.usePointerType != 'ALL' && wc2.usePointerType != evt.pointerType){
						console.log('지원되지 않는 입력장치 : '+wc2.usePointerType+"!="+evt.pointerType);
						return true;
					}
					wc2.isTouch = true;
					if(wc2.tool=='crop'){
						return true; //imageAreaSelect 의 pointerEvent 미지원 때문에
					}
				}else if(event.type.indexOf("touch")===0){
					wc2.isTouch = true;
				}else if(wc2.isTouch){ //터치 이벤트 중에 마우스 다운 이벤트 발생시 흘러내린다
					return true;
				}

				document.activeElement.blur(); //텍스트박스등의 포커스를 없앤다.
				event.bubble = false;
				event.stopPropagation();
				if(!wc2.isTouch) evt.preventDefault(); //이벤트 취소시킨다.



				wc2.syncContext2dCfg(); //설정을 적용시킨다.
				// if(!wc2Tool.init(wc2.tool)){
				// 	alert(wc2Tool.error);
				// 	return false;
				// }

				if(!wc2Tool.onDown(wc2.tool,event)){
					wc2.setError( wc2Tool.error);
					return false;
				}
				wc2.eventStep = 1;
				return false;
			}
			var onMove = function(event) {
				var evt = event.originalEvent?event.originalEvent:event;
				//console.log(event.type);
				// $("#dev_text").text(":1"+evtorg.type+":"+evtorg.pointerType);
				if(!wc2Tool.onMove(wc2.tool,evt)){
					//wc2.setError( wc2Tool.error);
					return ; //이벤트를 계속 시킨다.
				}

				evt.bubble = false;
				evt.stopPropagation();
				if(!wc2.isTouch) evt.preventDefault(); //이벤트 취소시킨다.
				// todo : context2D 설정 부분
				return false;
			}
			var onUp =  function(evt) {
				// evt = evt.originalEvent;
				// console.log("onUp",event.type);
				// $("#dev_text").text(":1"+evt.type+":"+evt.pointerType);
				if(wc2.eventStep==0){ return ;} //down이벤트 후에만
				evt.bubble = false;
				evt.stopPropagation();
				if(!wc2.isTouch) evt.preventDefault(); //이벤트 취소시킨다.
				// todo : context2D 설정 부분
				if(!wc2Tool.onUp(wc2.tool,evt)){
					wc2.setError( wc2Tool.error,false);
					return true;
				}
				wc2.eventStep = 0;
				wc2.isTouch = false;
				wc2._syncWcbInfo(); //수정된 내용 레이어 목록에 보여주기
				return false;
			}

			var stopEvent = function(evt){
				var evt = evt.originalEvent?evt.originalEvent:evt;
				evt.stopPropagation();
				if(event.type.indexOf("pointer")===0){
				}else{
					evt.preventDefault();
				}
				return false;
			}

			var eventArea =  document.getElementById('rootArea');
			// var cbfn = function(evt){
			// 	document.title = evt.x
			// }
			//
			// document.addEventListener("pointermove", cbfn,false);
			// document.addEventListener("selectstart", function(){return false;},false);
			// return;
			if(document.onpointerdown !== undefined){
				$(eventArea).on( "pointerdown", ".wcb-frame",onDown );
				$(eventArea).on( "pointermove", onMove );
				$(eventArea).on( "pointerup", onUp );
			}else	if(document.ontouchstart !== undefined){
				$(eventArea).on( "touchstart", ".wcb-frame",onDown );
				$(eventArea).on( "touchmove", onMove );
				$(eventArea).on( "touchend", onUp );
			}else {
				$(eventArea).on( "mousedown", ".wcb-frame",onDown );
				$(eventArea).on( "mousemove", onMove);
				$(eventArea).on( "mouseup", onUp);
			}

			eventArea.addEventListener("scroll", stopEvent, false);
			eventArea.addEventListener("touchmove", function(event){
																							if(wc2.tool=='crop'){
																								return true; //imageAreaSelect 의 pointerEvent 미지원 때문에
																							}
																							 stopEvent(event);
																						 }, false);
			eventArea.addEventListener("mousewheel", stopEvent, false);

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
			$('body').on("selectstart","*:not(input,textarea)", function(event){ return false; });
			$('#contentArea').on("dragstart","*:not(input,textarea)", function(event){ return false; });
			// 입룻랙 제거용
			// $(document).on("touchstart ","input", stopEvent);

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
				wc2.cmdLayer("select",$(this).attr("data-wcb-index"));
			});
			//-- 단축키
			Mousetrap.bind('ctrl+z', function(event) { wc2.cmdWcb("undo"); });
			Mousetrap.bind(['ctrl+shift+z','ctrl+y'], function(event) { wc2.cmdWcb("redo"); });
			//-- 열린 패널창 숨기기용
			Mousetrap.bind('esc', function(event) {
				wc2.hideMenuDetail();
			});
			//-- 메뉴 부분 이벤트 처리용
			$("#topMenu").on("click","a",function(event){
				wc2.closeOnclickNavbar(event);
				if($(event.target).attr("data-wc-menu")){
					wc2.btnShowMenuDetail(event.target);
				}
				return;
			});
			//-- 페이지 이동시 물어보디
			window.onbeforeunload = function(){
			return wc2.onbeforeunloadForDocument();
			}
			//-- 자동 설정 저장 이벤트
			$(document).on("change","form.wc-save-setting",function(event){
				wc2.saveSetting(this,event.type);
				return;
			});


		}
		//--- 히스토리
		,"saveHistory":function(action){
			if(this.activeWcb) this.activeWcb.saveHistory(action);
		}
		,"resaveHistory":function(){
			if(this.activeWcb) this.activeWcb.resaveHistory();
			//console.log("리세이브");
		}
		//--
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
				case "flip":
					this.resaveHistory();
					this.activeWcb.flip(arg1,arg2);
					this.saveHistory("Image."+cmd);
				break;
				case "rotate90To":
					this.resaveHistory();
					this.activeWcb.rotate90To(arg1);
					this.saveHistory("Image."+cmd);
				break;
				case "open":
					if(typeof arg1 =="string"){
						this.newWcbByURL(arg1,function(cmd){
									return function(wcb){
										wcb.saveHistory("Image."+cmd);
										//wc2.cmdWcb("active",wcb);  //setTimeout(function(){ wc2.tabs.tabs({"active":-1})} , 100); // 여기서 한다.
										//console.log("end");
									}
								}(cmd)); //URL에서 읽어온다.
					}else if(arg1.dataType && arg1.dataType=="wcb"){ //wcbdo 을 읽어드렸다.
						var wcb = this.newWcbByWcbdo(arg1,
								function(cmd){
									return function(wcb){
										wcb.saveHistory("Image."+cmd);
									}
								}(cmd)
							);
						sync = false;
					}else if(arg1.wcbdo){ //wcb.json 을 읽어드렸다.
						var wcb = this.newWcbByWcbdo(arg1.wcbdo,
								function(cmd){
									return function(wcb){
										wcb.saveHistory("Image."+cmd);
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
				case "upload":
					this.uploadWcb(arg1,arg2,arg3);
				break;
				case "guideLine":
					this.activeWcb.guideLine(arg1);
				break;
				default:
				this.setError("지원되지 않는 메소드");
				break;
			}
			if(sync){
				this._syncWcbInfo();
			}

		}
		/**
		 * onpaste 이벤트에 file 타입인 경우 dataURL로 변경해서 값을 넣도록 해준다.
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		,"onpasteFromClipboardForInput":function(event,cb_string,cb_file){
			var event_target = event.target;
			// console.log(event);
			this.pasteFromClipboard(event,
				function(str,type,event){
					if(cb_string == null ){
						return;
					}
					cb_string(str,type,event)
				},
				function(dataURL,type,event){
					if(cb_file == null ){
						return;
					}
					// console.log("file",type,dataURL);
					if(type.match('^image/')){ //이미지 형만
						event.stopPropagation();
						event.preventDefault();
						// event_target.value=dataURL;
						cb_file(dataURL,type,event);
					}
				}
			)
		}
		,"blobWcb":function(type,quality,cb){
			var toDataURLType = type;
			switch(type){
				case 'wcblzs':
					toDataURLType = "wcbjson";
					var dataURL = this.activeWcb.toWcbDataJson();
				break;
				case 'gif':
					if(!cb){
						this.setError("blobWcb()에서 gif 적용시 콜백함수가 필수입니다."); return null;
					}
					console.log("blobWcb GIF");
					var c = wc2.activeWcb.mergeAll();
					wc2Helper.convertGif(c,10,function(cb){
						return function(blob){
							var size = blob.size;
							cb(blob);
						};
					}(cb))
					return null;
				break;
				default:
					var dataURL = this.activeWcb.toDataURL(toDataURLType,quality);
				break;
			}

			if(dataURL === false){
				alert(this.activeWcb.error);
				return false;
			}
			if(type == "wcblzs"){ //압축한다.
				var blob = new Blob([ LZString.compressToUint8Array(dataURL)], {type: "application/octet-stream"});
			}else{
				var blob = wc2Helper.dataURL2Blob(dataURL);
			}
			if(cb){
				cb(blob)
			}else{
				return blob;	
			}
			
		}
		,"saveWcb":function(filename,type,quality){
			var cb = function(filename){
				return function(blob){
					return wc2Helper.saveAs( blob,filename);	
				}
			}(filename);
			var blob = this.blobWcb(type,quality,cb);
			// return 
		}
		,"uploadWcb":function(filename,type,quality){
			
			var cb = function(filename,type,quality,thisC){
				return function(blob){
					var formdata = new FormData();
					formdata.append("upf[]", blob, filename);
					$.ajax({
						url: thisC.uploadURL,
						processData: false,
						contentType: false,
						//contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						dataType :"jsonp",
						data: formdata,
						type: 'POST',
						success: function(wcb){return function(result){
							if(!result || !result[0]){
								alert("잘못된 업로드 결과");
								return false;
							}
							var r = result[0];
							if(r['error_msg'] !=''){
								alert("Error :"+r['error_msg']);
								return false;
							}
							wc2.cmdWcb("active",wcb);
							if(r['save_name'] != r['basename']){ //이름이 바껴서 저장된 경우
								var n = r['basename'].replace(/\.[^\.]*$/,''); //확장자 제거
								wc2.cmdWcb("rename",n);
								console.log("rename by upload");
							}
							if(confirm("Success Upload.\nView Image?")){
								//wc2.viewImageURL(r["previewurl"]);
								wc2.viewImageURL(r["downurl"]);
							}
							return true;
						}}(thisC.activeWcb)
					});
				}
			}(filename,type,quality,this)
			this.blobWcb(type,quality,cb);
			return true;
		}
		,"saveLayer":function(){
			var type = 'png'; //png로 고정
			var quality = undefined;
			var filename = this.activeWcb.name+"_"+this.activeWcb.activeWebCanvas.label+".png";


			var dataURL = this.activeWcb.activeWebCanvas.toDataURL(type,quality);
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
			$(wcb.tabTitleA).text(wcb.name);
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
			this.tabsContent.appendChild(wcb.tabFrame);
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
			wcb.setName($.format.date(new Date(),'yyyyMMddHHmmssSSS'));
			return this._addWcb(wcb);
		}
		,"newWcbByURL":function(url,onload){
			var preview = new Image();
			preview.onload = function(onload){
				return function(){
					var wcb = wc2.newWcbByImage(this);
					if(onload) onload(wcb);
				}
			}(onload)
			preview.onerror = function(event){
				wc2.loadAjax(event.target.src,
					function(onload){
						return function( data, textStatus, jqXHR ) {
							//if(jqXHR.getResponseHeader("Content-Type") =='application/json'){
								var json = JSON.parse(data); //json으로 만들어지면 wcbdo 로 처리한다.
								if(json){
									wc2.newWcbByWcbdo(json,onload);
								}
							//}
						}
					}(onload)
				);
				this.onerror = undefined;
			}
			preview.src = url;
		}

		,"newWcbByImage":function(image){
			var wcb = new WebCanvasBundle(100,100);
			if(wcb.openByImage(image)=== false){
				this.setError(wcb.error);
				return false;
			}
			wcb.addWebCanvas(); //빈 레이어 하나 추가
			wcb.setName($.format.date(new Date(),'yyyyMMddHHmmssSSS'));
			return this._addWcb(wcb);
		}
		,"newWcbByWcbdo":function(wcbdo,onload){
			var wcb = new WebCanvasBundle(100,100);
			var callback = function(wcb,onload){
				return function(){
					if(onload) onload(wcb);
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
			$(this.tabsContent).attr("data-wc-tool",tool);
			this.showPropPanel();
			this.syncContext2dCfg(); //설정을 적용시킨다.


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
			btn.blur();
			if(!$(btn).attr("data-wc-tool")){
				this.setError( "wc2.setToolByBtn() : 필수 애트리뷰트가 없습니다.");
				return false;
			}
			var tool = $(btn).attr("data-wc-tool");
			return this.setTool(tool);
		}
		//--- target에 대한 마우스 클릭 위치
		,"getMousePos":function(evt,target ) {
			var rect = target.getBoundingClientRect();
			var scrollTop= Math.max(document.body.scrollTop,document.documentElement.scrollTop);
			var scrollLeft= Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);
			if(evt.originalEvent){
				evt = evt.originalEvent
			}
			var x = evt.clientX;
			var y = evt.clientY;
			if(evt.isPrimary ){
				var x = evt.clientX;
				var y = evt.clientY;
			}else if(evt.touches && evt.touches[0]){
				var touch = evt.touches[0];
				var x = touch.X;
				var y = touch.Y;
			}else{
				var x = evt.x;
				var y = evt.y;
			}
			// else if(evt.originalEvent.touches && evt.originalEvent.touches[0]){
			// 	var touch = evt.originalEvent.touches[0];
			// 	var x = touch.clientX;
			// 	var y = touch.clientY;
			// }
			// console.log(evt.x,evt.clientX)

			return {
			  "x": x - rect.left + scrollTop,
			  "y": y - rect.top + scrollLeft
			};
		}
		,"getOffsetXY":function(evt,target,zoom){ //지금인 이 메소드 쓰지 않는다 추후 생각해보자.
			var xy = this.getMousePos(evt,target);
			// console.log(xy)
			return { "x":xy.x/zoom,"y":xy.y/zoom};
		}
		,"showPropPanel":function(){
			var className = ".wc-tool-"+this.tool;
			$("#propPanel .wc-tool").hide();
			$("#propPanel "+className).show();
			$("#propPanel .wc-tool-ALWAYS").show();
			this.syncPropPanel();
		}
		,"syncPropPanel":function(){ //현재 보이는 것중 onchange 가 있으면 실행시킨다.
			var className = ".wc-tool-"+this.tool;
			$("#propPanel "+className+"[data-shown='onchange']").each(function(){
				this.onchange();
			});
			$("#propPanel .wc-tool-ALWAYS[data-shown='onchange']").each(function(){
				this.onchange();
			});
		}
		,"syncContext2dCfg":function(){
			if(!this.activeWcb){return;}
			var className = "form.wc-tool-"+this.tool;
			this.activeWcb.configContext2d(this.defaultContext2dCfg); //기본값으로 덮어 씌운다.
			var cfg = {}
			var withActiveWebCanvas = false;
			$("#propPanel "+className+" , #propPanel .wc-tool-ALWAYS").each(
				function(){
					var cfg2 = $(this).serializeObject();
					cfg = Object.assign(cfg,cfg2);
					// console.log(this.name,cfg);
					if($(this).attr('data-withActiveWebCanvas')=='1'){
						withActiveWebCanvas = true;
					}
				}
			)
			wc2.activeWcb.configContext2d(cfg,withActiveWebCanvas);

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
				$("#propLayerList").attr("data-wc2-preview",usePreviewImageAtLayerInfo);

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
					li.spanEye =  document.createElement("span");
					li.spanEye.className="eye"
					li.appendChild(li.spanEye);
					li.span =  document.createElement("span");
					li.appendChild(li.span);

					propLayerList.append(li);
				}
				var lis = $("#propLayerList .wc-prop-layer-info");
				lis.hide(); //우선 모두 숨긴다.
				var tmpli_i = 0;
				//var his = wcb.currentHistory();
				for(var i=wcb.webCanvases.length-1,m=0;i>=m;i--){
					var oc = wcb.webCanvases[i];
					var li = lis[tmpli_i];
					$(li).show();
					$(li).attr("data-wcb-active",$(oc).attr("data-wcb-active"))
							.attr("data-wcb-index",$(oc).attr("data-wcb-index"))
							.attr("data-wcb-hide",$(oc).attr("data-wcb-hide"));

					li.title = oc.label;
					//설정을 체크 하고 히스토리를 참고해서 히스토리가 변경된것만 갱신한다.
					if(usePreviewImageAtLayerInfo==1){
						//try{
							li.wc.setLabel(oc.label+"-pre");
							li.wc.clearResize(width,height);
							li.wc.drawImage(oc,0,0,li.wc.width,li.wc.height);
							//li.wc.setOpacity(oc.opacity);
							li.wc.opacity = oc.opacity;
							li.wc.hide = oc.hide;
							li.wc.node.style.marginTop = marginTop+"px";
						//}catch(e){li.wc.node.className="glyphicon glyphicon-sunglasses";}
						//console.log("pre 갱신",li.wc.label);
					}

					$(li.span).text(oc.label)
					tmpli_i++;
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
				document.formPropLayer.layerNotHide.checked = !this.activeWcb.activeWebCanvas.hide;

			}
		}
		,"cmdLayer":function(cmd,arg1,arg2,arg3){
			if(!this.activeWcb){ this.setError( "wc2.cmdLayer() 활성화된 윈도우가 없습니다."); return; }
			if(!this.activeWcb || !this.activeWcb.activeWebCanvas){
				this.setError("활성화 된 레이어가 없음");
				return false;
			}
			var sync = true;
			var history = true;
			var r = null;
			switch(cmd){
				case "clear":history = this.activeWcb.activeWebCanvas.clear();break;
				case "new":
				case "add":
					this.resaveHistory();
					history = this.activeWcb.addWebCanvas();break;
				case "duplicate":
					this.resaveHistory();
					history = this.activeWcb.addDuplicateWebCanvas();break;
				case "mergeDown":
					this.resaveHistory();
					history = this.activeWcb.mergeDown();
				break;
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
				case "hide":this.activeWcb.activeWebCanvas.hide = arg1;break;
				case "toggleHide":this.activeWcb.activeWebCanvas.hide = !this.activeWcb.activeWebCanvas.hide;break;
				case "select":this.resaveHistory();r = this._selectLayer(arg1); history = false; break;
				//case "invert":r = this.activeWcb.activeWebCanvas.invert();break;
				case "save":r = this.saveLayer();break;
				case "rename":this.resaveHistory();r =  this.activeWcb.activeWebCanvas.label = arg1;break;
			}
			if(history){
				this.saveHistory("Layer."+cmd+":"+this.activeWcb.activeWebCanvas.label);
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
				case "initPreview":wc2Tool.initPreview(this.tool);break;
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
			return this._viewImage(wc2.activeWcb.toDataURL());
		}
		//--- 뷰 URL 이미지
		,"viewImageURL":function(url){
			return this._viewImage(url);
		}
		,"_viewImage":function(url){
			var a = document.createElement('a');
			a.className = "wc-viewImage";
			a.onclick=function(){
				return confirm("download image? ("+this.download+")");
			}
			var img = new Image();
			a.download = img.title = wc2.activeWcb.name+".png";
			img.className ="wc-viewImage bg-grid";
			$(a).append(img);
			$(img).bind("load",function(event){
				$("#wc-mdetail-file-view-title").text(this.title)
				$("#wc-mdetail-file-view-info").text(this.naturalWidth+" x "+this.naturalHeight+" (px)")
				$("#wc-mdetail-file-view-image").html(this.parentNode)
				wc2.showMenuDetail("file-view");
			})

			a.href = img.src = url;
		}
		//--- 색상관련
		,"initColorPalette":function(){
			this.strokeStyle = document.getElementById('strokeStyle');
			$(this.strokeStyle).spectrum({
					//color: "rgb(0,0,0)",
					color:this.strokeStyle.value,
					//showAlpha: true,
					showInput: true,
					className: "strokeStyle",
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					containerClassName: 'colorPalette',
					maxSelectionSize: 40,
					preferredFormat: "rgb",
					localStorageKey: "wc2.strokeStyle",
					change: function(color) {
						this.value = color.toRgbString();
						wc2.cmdTool('predraw')
					}
			});
			this.fillStyle = document.getElementById('fillStyle');
			$(this.fillStyle).spectrum({
					//color: "rgb(255,255,255)",
					color:this.fillStyle.value,
					//showAlpha: true,
					showInput: true,
					className: "fillStyle",
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					containerClassName: 'colorPalette',
					maxSelectionSize: 40,
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
				$(this).parents(".sp-container").find(".sp-choose").trigger("click")
			});
			return true;
		}
		,"exchangeColor":function(){
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
			this.syncColor();
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
			$("#menuDetailArea").show().find(".wc-mdetail.show").each(
				function(){
					// $(this).hide();
					$(this).removeClass('show');
				}
			)
			var frms = $("#menuDetailArea").find(".wc-mdetail-"+menu).addClass('show');
			frms.addClass('show')


			if(menu.indexOf("layer-filter")==0){ //필터용 프리뷰
				$(".wc-mdetail-layer-filter-preview").addClass('show');
			}
			if(menu.indexOf("image-guideLine")==0){ //필터용 프리뷰
				document.formMenuDetailGuideLine.width.value = this.activeWcb.guideLine();
			}


			if(this.activeWcb){
				switch(menu){
					case "file-save":frms[0].saveFileName.value = this.activeWcb.name;break;
					case "image-rename":frms[0].renameName.value = this.activeWcb.name;break;
					case "layer-rename":frms[0].renameName.value = this.activeWcb.activeWebCanvas.label;break;
					case "image-adjustSize":
					case "image-resize":frms[0].width.defaultValue = frms[0].width.value = this.activeWcb.width;
												frms[0].height.defaultValue = frms[0].height.value = this.activeWcb.height;
					break;

				}
				if(menu.indexOf("layer-filter-") == 0){
					frms.each(function(){
						this.reset();
						$(this).find("[onchange]").each(function(){
							this.onchange();
						});
						if(this.onchange) this.onchange();
						}
					);
				}
			}

		}
		//-- UI 메뉴용
		,"btnShowMenuDetail":function(menuBtn){
			return this.showMenuDetail($(menuBtn).attr("data-wc-menu"));
		}
		,"loadAjax":function(url,success){
			$.ajax(
				{
					"url": url,
					crossDomain: true,
					dataType: "text",
					"success": success,
					error: function( jqXHR, textStatus, errorThrown ) {
						console.log( jqXHR, textStatus, errorThrown );
					}
				}
			)
		}
		,"viewPreviewImageByWcbdo":function(wcbdo){
			var preview = document.getElementById('formMenuDetailFileOpenPreview');
			preview.wcbdo = wcbdo; //이 값이 false가 아니면 wcbdo로 읽어오게 한다.
			preview.src = wcbdo.preview.dataURL;
		}
		//--
		,"viewPreviewImageByWcbdoByURL":function(url){
			url = this.converURL(url);

			var preview = document.getElementById('formMenuDetailFileOpenPreview');
			preview.wcbdo = null;
			preview.onerror = function(event){
				wc2.loadAjax(event.target.src,
						function( data, textStatus, jqXHR ) {
							//if(jqXHR.getResponseHeader("Content-Type") =='application/json'){
								var json = JSON.parse(data); //json으로 만들어지면 wcbdo 로 처리한다.
								if(json){
									wc2.viewPreviewImageByWcbdo(json);
								}
							//}
						}
				);
				this.onerror = undefined;
			}
			preview.src = url;
		},
		/**
		* 문자열과 DataURL 을 가져와서 콜백 함수를 호출한다.
		* 마지막 item만 체크한다.
		*/
		"pasteFromClipboard":function(event,cb_string,cb_file){
			var items = event.clipboardData.items;
			if(items.length ==0 ){
				return;
			}
			var item = items[items.length-1];
			// for (var i = 0; i < items.length; i += 1) {
				console.log(items);
				if (item.kind == 'string') {
					// This item is the target node
					if(!item.type.match('^text/html')){
						return;
					}
					item.getAsString(function(cb_string,type,from_event){
						return function(str){
							cb_string(str,type,from_event);
						}
					}(cb_string,item.type,event));
				}if ((item.kind == 'file')) {
					// Drag items item is an image file
					var f = item.getAsFile();//file<blob
					var fileReader = new FileReader();
					fileReader.onload = function(cb_file,type,from_event){
						return function(evt){
							cb_file(evt.target.result,type,from_event);
						}
					}(cb_file,item.type,event);
					fileReader.readAsDataURL(f);
				}
			// }
		}
		,"btnFileOpenPreviewImageFromPaste":function(event){
			if($("form.wc-mdetail-file-open").css("display")=="none"){
				return false;
			}
			console.log(event);
			this.pasteFromClipboard(event,
				function(str,type,event){
					event.stopPropagation();
					event.preventDefault();
					console.log("string",type,str);
				},
				function(dataURL,type,event){
					// console.log("file",type,dataURL);
					if(type.match('^image/')){ //이미지 형만
						event.stopPropagation();
						event.preventDefault();
						wc2.btnFileOpenPreviewImage(dataURL,'url')
					}
				}
			)
		}
		,"btnFileOpenPreviewImage":function(el,el_Type){
			var preview = document.getElementById('formMenuDetailFileOpenPreview');
			preview.wcbdo = null;
			if((el_Type=='url' || el_Type=='dataURL') && el.length > 0){
				this.viewPreviewImageByWcbdoByURL(el);
			}if(el.type=="text" && el.value.length > 0){
				this.viewPreviewImageByWcbdoByURL(el.value);
			}else if(el.type=="file"  && el.value.length > 0){
				if(el.value.indexOf("wcbjson")!= -1){ //전용 파일
					wc2Helper.loadInputFile(el , function(){
						return function(result){
							var wcbdo = JSON.parse(result);// wcbDataObject
							wc2.viewPreviewImageByWcbdo(wcbdo)
						}
					}(preview),"readAsText");
				}else if(el.value.indexOf("wcblzs")!= -1){ //전용 파일(압축)
					wc2Helper.loadInputFile(el , function(){
						return function(result){
							var wcbdo = JSON.parse(LZString.decompressFromUint8Array(new Uint8Array(result)));// wcbDataObject
							wc2.viewPreviewImageByWcbdo(wcbdo)
						}
					//}(preview),"readAsBinaryString");
					}(preview),"readAsArrayBuffer");
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
		,"getDataurlForFileSavePreview":function(cb){
			var form = document.formMenuDetailFileSave
			var saveFileType = form.saveFileType.value
			if(saveFileType=='gif'){
				alert("getDataurlForFileSavePreview() : Not Support GIF");
				return null;
			}
			return this._btnFileSavePreview(cb);
		}
		,"_btnFileSavePreview":function(cb){
			var form = document.formMenuDetailFileSave
			if(!wc2.activeWcb){
				this.setError( "wc2.viewImage() : 활성화된 윈도우가 없음");
				return false;
			}

			var saveFileType = form.saveFileType.value
			if(saveFileType=='wcbjson'){
				saveFileType = 'png';
			}

			var saveFileQuality = form.saveFileQuality.value
			
			if(saveFileType=='gif'){
				console.log("preview GIF");
				var c = wc2.activeWcb.mergeAll();
				wc2Helper.convertGif(c,10,function(cb,saveFileType){
					return function(blob){
						var size = blob.size;
						wc2Helper.blobToDataURL(blob,function(dataUrl){
							cb(dataUrl,saveFileType,size)	
						})
						
					};
				}(cb,saveFileType))
				
			}else{
				var dataurl = wc2.activeWcb.toDataURL(saveFileType,saveFileQuality);	
				var t = dataurl.replace(/^data:.*;base64,/,'');
				var size = window.atob(t).length;
				if(!cb){
					return dataurl
				}
				cb(dataurl,saveFileType,size);
			}
			
			return ;
		}
		,"btnFileSavePreview":function(){
			function cb(dataurl,type,size){
				var size = new Intl.NumberFormat().format(size);
				if(!dataurl){
					$("#formMenuDetailFileSave-preview").prop("src",'about:blank')
					$("#formMenuDetailFileSave-preview-size").text('- Byte');
					return false;
				}
				// var t = dataurl.replace(/^data:.*;base64,/,'');
				$("#formMenuDetailFileSave-preview").prop("src",dataurl)
				// var size = new Intl.NumberFormat().format(window.atob(t).length);
				if(type!='wcbjson' && type!='wcblzs' ){
					$("#formMenuDetailFileSave-preview-size").text(size+' Byte');		
				}else{
					$("#formMenuDetailFileSave-preview-size").text('- Byte');		
				}
				
			}
			this._btnFileSavePreview(cb);
		}
		,"btnFileUpload":function(form){
			var saveFileName = form.saveFileName.value
			var saveFileType = form.saveFileType.value
			if(saveFileType.length > 0){
				saveFileName+="."+saveFileType;
			}
			var saveFileQuality = form.saveFileQuality.value
			return this.cmdWcb("upload",saveFileName,saveFileType,saveFileQuality);
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
			//this.changeViewport(this.viewportContentScale); //변수 설정시 자동 처리됨
			this.saveSetting(form,"submit"); //설정 저장
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
		//색 정보 싱크 그리기
		,"syncColor":function(){
			//this.syncBrush();
			this.syncPropPanel();
			this.cmdTool('predraw')

			$(this.strokeStyle).spectrum("set",this.strokeStyle.value);
			$(this.fillStyle).spectrum("set",this.fillStyle.value);
			
			$('.bg-strokeStyle').css("backgroundColor",this.strokeStyle.value);
			$('.bg-fillStyle').css("backgroundColor",this.fillStyle.value);

			this.saveSetting(document.getElementById("formToolColor"),"change");
		}
		//지우개용 브러쉬 정보 싱크 그리기
		,"syncEraser":function(){
			var f = document.formToolEraser;
			var fc = document.formToolColor;
			var width = parseFloat(f.brushWidth.value);
			var globalAlpha = parseFloat(f.brushGlobalAlpha.value);
			var r = width/2;
			var r0p = parseFloat(f.r0p.value);
			var colorStyle = "rgb(255,255,255)";
			//this.brush4Eraser.colorStyle = strokeStyle;
			this.brush4Eraser.spacing  = parseFloat(f.brushSpacing.value);
			this.brush4Eraser.disablePressureDiameter  = $(f).find("input[name='brushDisablePressureDiameter']:checked").val()=="1"?true:false;
			this.brush4Eraser.minimumPressureDiameter  = parseFloat(f.brushMinimumPressureDiameter.value);

			this.brush4Eraser.disablePressureAlpha  = $(f).find("input[name='brushDisablePressureAlpha']:checked").val()=="1"?true:false;
			this.brush4Eraser.minimumPressureAlpha  = parseFloat(f.brushMinimumPressureAlpha.value);

			this.brush4Eraser.circle(r,colorStyle,globalAlpha,r0p,1);
			this.brush4Eraser.previewBrush()
		}
		//브러쉬 정보 싱크 그리기
		,"syncBrush":function(f,fc){
			var f = f||document.formToolBrush;
			var fc = fc||document.formToolColor;
			var width = parseFloat(f.brushWidth.value);
			var r = width/2;
			var r0p = parseFloat(f.r0p.value);
			this.brushSpacing  = parseFloat(f.brushSpacing.value);
			var globalAlpha = parseFloat(f.brushGlobalAlpha.value);
			var strokeStyle = fc.strokeStyle.value;
			var fillStyle = fc.fillStyle.value;
			//var color0 = strokeStyle.replace('rgb','rgba').replace(')',',1)');
			//var color1 = strokeStyle.replace('rgb','rgba').replace(')',',0)');
			//console.log(strokeStyle);
			this.brush4Brush.colorStyle = strokeStyle;
			this.brush4Brush.spacing  = parseFloat(f.brushSpacing.value);
			this.brush4Brush.disablePressureDiameter  = $(f).find("input[name='brushDisablePressureDiameter']:checked").val()=="1"?true:false;
			this.brush4Brush.minimumPressureDiameter  = parseFloat(f.brushMinimumPressureDiameter.value);

			this.brush4Brush.disablePressureAlpha  = $(f).find("input[name='brushDisablePressureAlpha']:checked").val()=="1"?true:false;
			this.brush4Brush.minimumPressureAlpha  = parseFloat(f.brushMinimumPressureAlpha.value);

			//this.brush4Brush.image(f.brush,width,width,strokeStyle,globalAlpha)
			this.brush4Brush.circle(r,strokeStyle,globalAlpha,r0p,1);
			//this.brush4Brush.circle(r,strokeStyle,1,r0p,1);
			this.brush4Brush.previewBrush()


			//this.brushIMG.src = this.brush4Brush.toDataURL();
			return true;
		}
		//패턴 정보 싱크 그리기
		,"syncPattern":function(img){
			$("#toolPatternList img").each(
				function(idx,el){
					$(el).removeClass("active");
				}
			)
			$(img).addClass("active");
			$("#imagePattern").prop("src",img.src);
			return true;
		}

		,"changeViewport":function(scale){
			if(scale==""){
				var content="";
			}else{
				//var content="width="+width+", initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
				var content="width=device-width, initial-scale="+scale+", maximum-scale="+scale+", user-scalable=no";
			}
			var vp0 = document.getElementById('viewport');
			vp0.setAttribute("content",content);
			var vp1 = document.createElement('meta');
			vp1.setAttribute("content",content);
			var head = document.getElementsByTagName('head');
			head[0].appendChild(vp1);
			return true;
		}
		,"closeOnclickNavbar":function(event){
			var ta = event.target;
			if(ta.tagName=='A'){
				if(!!ta.onclick|| $(ta).attr("href").length>4||$(ta).attr("data-wc-menu")){
					wc2.closeNavbar();
				}
			}

		}
		,"closeNavbar":function(isOpen){
			if(!isOpen){
				$("#top-navbar.in").removeClass("in").attr("aria-expanded","false");
			}else{
				$("#top-navbar").addClass("in").attr("aria-expanded","true");
			}
		}
		//입력된 URL의 QueryString을 기준으로 자동 처리한다.
		,"initByQueryString":function(qstr){
			qstr = qstr.replace(/^\?/,'');
			var arr = qstr.split('&');
			var cmds = [];
			for(var i=0,m=arr.length;i<m;i++){
				var t = arr[i].split('=');
				var cmd = t[0]
				var arg1 = decodeURIComponent(t[1]);
				if(cmd=="open"){
					this.cmdWcb("open",arg1);
				}else{
					console.log("지원되지 않는 명령어");
				}

			}
		}
		//WC2CB(콜백함수모음객체)로 동작에 대해서 제어한다.
		,"initByWC2CB":function(WC2CB){
			if(WC2CB.getImage){
				this.cmdWcb("open",WC2CB.getImage());
			}
			if(WC2CB.btnFileSaveCallback){
				$("#btnFileSaveCallback").removeClass("hide")
				this.btnFileSaveCallback = function(win,wc2){
					return function(){
						this.useOnbeforeunloadForDocument = false;
						var r = WC2CB.btnFileSaveCallback(win,wc2);
						this.useOnbeforeunloadForDocument = true;
						return r;
					}

				}(window,this)
			}

		}
		//콜백용 저장 버튼 동작용.
		,"btnFileSaveCallback":function(win,wc2){

		}
		,"_cmdFilter":function(wc,cmd){
			if(wc2Filter[cmd]==undefined){
				this.setError("필터 "+cmd+"가 없습니다.");
			}

			var imageData = wc.cmdContext2d('getImageData');
			var cmd = arguments[1];
			var args = [];
			args.push(imageData);
			for(var i=2,m=arguments.length;i<m;i++){
				args.push(arguments[i]);
			}
			// if(cmd=='applyPalette_cb'){//callback 처리한다.  //우선 콜백으로 하는건 사용안한다.
			// 	args[3]=function(imageData){
			// 		wc.cmdContext2d('putImageData',imageData);
			// 	}
			// 	wc2Filter[cmd].apply(wc2Filter,args)
			//
			// }else{
			// 	wc.cmdContext2d('putImageData',wc2Filter[cmd].apply(wc2Filter,args));
			// }
			wc.cmdContext2d('putImageData',wc2Filter[cmd].apply(wc2Filter,args));

		}
		,"cmdFilter":function(cmd,arg1,arg2,arg3){
			if(!this.activeWcb){ this.setError( "wc2.cmdLayer() 활성화된 윈도우가 없습니다."); return; }
			if(!this.activeWcb || !this.activeWcb.activeWebCanvas){
				this.setError("활성화 된 레이어가 없음");
				return false;
			}
			var sync = true;
			var history = true;
			var r = null;

			this._cmdFilter(this.activeWcb.activeWebCanvas,cmd,arg1,arg2,arg3);

			if(history){
				this.saveHistory("Layer."+cmd);
			}
			this.cmdTool("reset");
			if(sync){
				this._syncWcbInfo();
			}
		}
		,"cmdPreviewFilter":function(cmd,arg1,arg2,arg3){
			if(!this.activeWcb){ this.setError( "wc2.cmdLayer() 활성화된 윈도우가 없습니다."); return; }
			if(!this.activeWcb || !this.activeWcb.activeWebCanvas){
				this.setError("활성화 된 레이어가 없음");
				return false;
			}
			var w = 200;
			var h = 200/this.activeWcb.width*this.activeWcb.height;
			this.filterPreviewWC.resize(w,h);
			this.filterPreviewWC.copy(this.activeWcb.activeWebCanvas,0,0,w,h);
			if(cmd=="reset") return;
			if(this.cmdPreviewFilter.tm){
				clearTimeout(this.cmdPreviewFilter.tm)
			}


			this.cmdPreviewFilter.tm = setTimeout(function(thisC){
				return function(){
				thisC._cmdFilter(thisC.filterPreviewWC,cmd,arg1,arg2,arg3);
				}
			}(this),0)
		}
		,"saveWcbLocalStorage":function(){
			if(this.wcbs.length==0){
				this.setError("No Wcbs"); return false;
			}
			if(!confirm("임시 저장 하시겠습니까?")) return false;
			var tempWcbs = {};
			tempWcbs.mtime = (new Date).getTime();
			tempWcbs.data = [];

			for(var i=0,m=this.wcbs.length;i<m;i++){
				tempWcbs.data.push(this.wcbs[i].toWcbDataObject());
			}
			var t = JSON.stringify(tempWcbs);
			if(t.length>1024*1024*3){
				if(!confirm("Too Large Data. (bigger then 3MB)\nContinue?")){
					return false;
				}
			}
			localStorage.setItem("wc2.tempWcbs", t);
			alert("Save In Temporary OK");
			return true;
		}
		,"openWcbLocalStorage":function(){
			var tempWcbs = localStorage.getItem("wc2.tempWcbs");
			if(tempWcbs == null){
				this.setError("No TempWcbs"); return false;
			}
			var tempWcbs = JSON.parse(tempWcbs);
			if(!confirm("Open? "+tempWcbs.data.length+" Document.\nSaved Date : "+new Date(tempWcbs.mtime).toLocaleString())){
				return false;
			}
			for(var i=0,m=tempWcbs.data.length;i<m;i++){
				this.cmdWcb("open",tempWcbs.data[i]);
			}
			return true;
		}
		,"initAutoWcbLocalStorage":function(){
			if(this.tmAutoWcbLocalStorage){
				clearInterval(this.tmAutoWcbLocalStorage);
			}
			this.failCountAutoWcbLocalStorage = 0; //
			this.tmAutoWcbLocalStorage = setInterval(function(){
				wc2.actionAutoWcbLocalStorage();
			},60*1000);
			console.log("자동저장 : 인터벌 동작 시작");
		}
		/**
		 * 자동저장용 인터벌
		 * @return {[type]} [description]
		 */
		,"actionAutoWcbLocalStorage":function(){
			//5회 초과 실패시 동작중이라도 강제로 자동 저장을 시도한다. (약 5분 이후 강제 저장되도록)
			if((this.failCountAutoWcbLocalStorage > 5 || wc2Tool.isDown === 0) && this.wcbs.length > 0){

				console.log("자동저장 : 시작");
				this.saveAutoWcbLocalStorage();
				this.failCountAutoWcbLocalStorage = 0; //
			}else{
				this.failCountAutoWcbLocalStorage++;
				console.log("자동저장 : 스킵 : "+this.failCountAutoWcbLocalStorage);
			}
		}
		/**
		 * 자동저장
		 * @return {[type]} [description]
		 */
		,"saveAutoWcbLocalStorage":function(){
			if(this.wcbs.length==0){
				this.setError("No Wcbs"); return false;
			}
			// if(!confirm("임시 저장 하시겠습니까?")) return false;
			var tempWcbs = {};
			tempWcbs.mtime = (new Date).getTime();
			tempWcbs.data = [];

			for(var i=0,m=this.wcbs.length;i<m;i++){
				if(this.wcbs[i].historyLog.length>1){
					tempWcbs.data.push(this.wcbs[i].toWcbDataObject());
				}else{
					console.log('자동저장 : 최초 문서는 자동 저장 안함.')
				}
			}
			var t = JSON.stringify(tempWcbs);
			if(t.length>1024*1024*3){
				// if(!confirm("Too Large Data. (bigger then 3MB)\nContinue?")){
				// 	return false;
				// }
				this.setError("Fail Auto Save : BBBBig Size"); return false;
			}
			localStorage.setItem("wc2.tempAutoWcbs", t);
			// alert("Save In Temporary OK");
			this.setError("Success Auto Save");
			return true;
		}
		/**
		 * 자동저장 내용 불러오기
		 * @return {[type]} [description]
		 */
		,"openAutoWcbLocalStorage":function(){
			var tempWcbs = localStorage.getItem("wc2.tempAutoWcbs");
			if(tempWcbs == null){
				this.setError("No TempWcbs"); return false;
			}
			var tempWcbs = JSON.parse(tempWcbs);
			if(!confirm("Open? "+tempWcbs.data.length+" Document.\nSaved Date : "+new Date(tempWcbs.mtime).toLocaleString())){
				return false;
			}
			for(var i=0,m=tempWcbs.data.length;i<m;i++){
				this.cmdWcb("open",tempWcbs.data[i]);
			}
			return true;
		}
		//-- 종료시 물어보기, 사용흔적이 없으면 안 물어본다.
		,"onbeforeunloadForDocument":function(){
			if(!this.useOnbeforeunloadForDocument){return undefined;}
			var docCnt = this.wcbs.length;
			var useCnt = 0;

			for(var i=0,m=docCnt;i<m;i++){
				if(this.wcbs[i].historyLog.length>1){
					useCnt++;
				}
			}
			if(useCnt>0){
				return "Should you quit?\n==================\ndrawing : "+useCnt+" images\nTotal : "+docCnt+" images";
			}else{
				return undefined;
			}
		}
		//-- 설정 자동 저장
		,"saveSetting":function(f,eventType){
			if(!localStorage){return false;}
			var setting = localStorage.getItem("wc2.setting");
			if(!setting){ setting = "{}";}
			setting = JSON.parse(setting);
			if(!f.id){alert("Required prop id.");return false;}
			setting[f.id] = $(f).serializeObject();
			setting[f.id].eventType = eventType;
			localStorage.setItem("wc2.setting",JSON.stringify(setting));
			//console.log(localStorage.getItem("wc2.setting"));
		}
		//-- 저장된 설정 읽기
		,"loadSetting":function(){
			if(!localStorage){return false;}
			var setting = localStorage.getItem("wc2.setting");
			if(!setting){ setting = "{}";}
			setting = JSON.parse(setting);
			for(var id in setting){
				var f = document.getElementById(id);
				if(!f){continue;}
				console.log(id,setting[id]);
				var eventType = setting[id].eventType
				delete setting[id].eventType;
				for(var x in setting[id]){
					if(f[x]==undefined || setting[id][x]==undefined){continue;}
					f[x].value = setting[id][x];
				}

				if($(f).attr('data-disabled-load')!='1' && eventType && f["on"+eventType] != undefined){ //적용
					f["on"+eventType]();
				}
			}
		}
		//-- 저장된 설정 삭제
		,"clearSavedSetting":function(){
			if(!localStorage){return false;}
			if(!confirm("All saved settings will be initialized. Are you sure you want to initialize?\n(Preferences, Brush, etc... )")){return false;}
			localStorage.setItem("wc2.setting","{}");
			$("form.wc-save-setting").each(function(idx,el){
				el.reset();
				if(el.onchange){ el.onchange(); }
			});
			return true;
		}
		//-- 토글 풀 스크린
		,"toggleFullScreen":function() {
		  if (!document.fullscreenElement &&    // alternative standard method
			  !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
			if (document.documentElement.requestFullscreen) {
			  document.documentElement.requestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
			  document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
			  document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
			  document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		  } else {
			if (document.exitFullscreen) {
			  document.exitFullscreen();
			} else if (document.msExitFullscreen) {
			  document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
			  document.webkitExitFullscreen();
			}
		  }
		}
		//-- 자동화
		,"automation":function(cmd,arg1,arg2){
			switch(cmd){
				case 'resize':
				if(arg1 != null){
					var w = arg1;
					var h = this.activeWcb.height * (arg1/this.activeWcb.width);
				}else{
					var w = this.activeWcb.width * (arg2/this.activeWcb.height);;
					var h = arg2
				}
				this.cmdWcb("resize",w,h)
				break;
			}
		}
		//-- 외부 URL지원용
		,"converURL":function(url){
			if(url.indexOf('data:')===0){ //dataURL
				return url;
			}else if(url.indexOf(document.location.protocol+'//'+document.location.hostname)!=0){ //같은 도메인이 아니면, 프록시 사용
				url = './util/proxy/proxy.php?URL='+encodeURIComponent(url);
			}
			return url;
		}
		,"dev_text":function(text){
			$("#dev_text").text(text);
		}
	};
})();
