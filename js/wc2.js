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
											//--- 추가 설정
											"context2d.lineHeight":1.5,//text line-height
											"context2d.eraserMode": "pen", //지우개 모드 (todo)
											"context2d.disableStroke": 0, //stroke 사용금지
											"context2d.disableFill": 0, //fiil 사용금지
											/*
											"globalRotateAngle":0, //회전각도
											"globalTranslateX":0, //회전축 x
											"globalTranslateY":0, //회전축 y
											*/
											}
		 //--- 초기화
		,"init":function(){
			this.initEvent();
			this.addWebCanvasWindow(300,300);
			this.setTool("line");
		}
		,"setError":function(error){
			this.error = error;
			console.log(this.error);
			return this.error;
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
				if(!wc2Tool.onDown(wc2.tool,event)){
					this.setError( wc2Tool.error);
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
				if(!wc2Tool.onMove(wc2.tool,event)){
					this.setError( wc2Tool.error);
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
				if(!wc2Tool.onUp(wc2.tool,event)){
					this.setError( wc2Tool.error);
					return false;
				}
				wc2.eventStep = 0;
				wc2._syncPropLayerList(); //수정된 내용 레이어 목록에 보여주기
				return true;
			});
			
			$(document).on('mousewheel', function(event) {
				if(!wc2Tool.onMouseWheel(wc2.tool,event)){
					//this.setError( wc2Tool.error);
					return; //false라도 잘못된것이 아니므로 흘러내린다.
				}
				wc2.eventStep = 0;
				wc2._syncPropLayerList(); //수정된 내용 레이어 목록에 보여주기
			});
			
			// 드래그 방지용
			$('body').on("selectstart", function(event){ return false; });
			$('#contentArea').on("dragstart", function(event){ return false; });
			// 툴 panel
			$("#toolPanel").on("click",".btn[data-wc-tool]", function(event){ 
				wc2.setToolByBtn(this);
				
			});
			//-- 레이어 쪽
			$("#propLayerList").on("click","li",function(event){
				wc2.selectLayer(this.dataset.wcbIndex)
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
					//"position": { my: "center top" , at: "center top",on:"#contentArea"},
					"show": { effect: "blind", duration: 300 },
					"hide": { effect: "blind", duration: 300 },
					
					"dragStop": function( event, ui ) {
						wc2.reposWebCavasWindow(this.parentNode);
					},
					
					"resizeStop": function( event, ui ) {
						wc2.reposWebCavasWindow(this.parentNode);
					},
					"create": function( event, ui ) {
						wc2.reposWebCavasWindow(this.parentNode);
					},
					"open": function( event, ui ) {
						wc2.reposWebCavasWindow(this.parentNode); 
					},
					"beforeClose": function( event, ui ) {
						return confirm("close?");
					},
					"close": function( event, ui ) {
						wc2.removeWebCanvasWindow(this);
						//$(this).dialog('destroy').remove();
					}
				}
			)
			
			
			
			var wcwp = wcw.parent();
			wcw.wcwp = wcwp;
			
			//*
			wcwp.draggable({ "handle": wcwp.find("span.ui-dialog-title"),
				"containment": "#contentArea",
				"scroll": false,
				"stop": function( event, ui ) {
					wc2.reposWebCavasWindow(this);
				}
			});
			//*/
			
			// wcf-bottom 다시 붙임
			wcwp.find(".wcf-bottom").appendTo(wcwp);
			
			wcwp.on("change",".wcw-zoom",
				function(wcb){
					return function(event){
						wcb.setZoom(this.value);
					}
				}(wcb)
			);
			
			wc2.reposWebCavasWindow(wcwp[0]);
			wcwp.css("height","60px");
			
			wcw.wcb = wcb;
			wcw[0].wcb = wcb;
			wcw.wcb.wcwp = wcwp;
			wcwp.bind("mousedown",function(wcw){
				return function(event){
					wc2.activeWebCanvasWindow(wcw);
				}
			}(wcw));
			wcwp.bind("mouseup",function(wcw){
				return function(event){
					wc2.reposWebCavasWindow(this);
				}
			}(wcw));
			
			//wcw.addClass("wcw-active");
			this.wcws.push(wcw);
			this.activeWebCanvasWindow(wcw);
			this.rename($.format.date(new Date(),'yyyyMMddHHmmss'));
			
		}
		,"reposWebCavasWindow":function(target){
			var bcr0 = $("#contentArea")[0].getBoundingClientRect();
			var bcr1 = target.getBoundingClientRect();

			if(bcr1.left+bcr1.width - bcr0.left < 0){
				target.style.left = bcr0.left+"px";
			}else if(bcr1.left - (bcr0.left+bcr0.width) > 0){
				target.style.left = (bcr0.left+bcr0.width)+"px";
			}
			if(bcr1.top - bcr0.top < 0){
				target.style.top = bcr0.top+"px";
			}else if(bcr1.top - (bcr0.top+bcr0.height) > 0){
				target.style.top = Math.max(bcr0.top,bcr0.top+bcr0.height-20)+"px";
			}
			
			return;
			//wcw.wcb.wcp.
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
				this._syncPropLayerList();
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
			this._syncPropLayerList();
			return true;
		}
		,"rename":function(name){
			if(!this.activeWcw){return false;}
			if(!this.activeWcw.wcb.setName(name)){return false;}
			
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
			if(!wc2Tool.init(this.tool,this.activeWcw.wcb)){
				alert(wc2Tool.error);
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
			var className = ".wc-tool-"+this.tool;
			$("#propPanel .wc-tool").hide();
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
		,"_syncPropLayerList":function(){
			if(!this.activeWcw){ 
				$("#propLayerList").html("").append('<li class="list-group-item">#EMPTY#<li>')
			}else{
				var wcb = this.activeWcw.wcb;
				 $("#propLayerList").html("");
				var limitHeight = 40;
				var c = WebCanvas(Math.round(wcb.width*(limitHeight/wcb.height)),limitHeight);
				for(var i=wcb.webCanvases.length-1,m=0;i>=m;i--){
					c.copy(wcb.webCanvases[i],0,0,c.width,c.height);
					var oc = wcb.webCanvases[i];
					var img = new Image();
					img.src = c.toDataURL();
					var li = document.createElement("li");
					li.className="list-group-item";
					li.dataset.wcbActive = oc.dataset.wcbActive;
					li.dataset.wcbIndex = oc.dataset.wcbIndex;
					li.alt = oc.alt;
					img.alt = oc.alt;
					li.title = oc.alt;
					$(li).append(img);
					$(li).append(document.createTextNode(wcb.webCanvases[i].alt));
					$("#propLayerList").append(li)
					//console.log(wcb.webCanvases[i].alt);
				}
			}
			
		}
		,"cmdLayer":function(cmd){
			if(!this.activeWcw){ this.setError( "wc2.cmdLayer() 활성화된 윈도우가 없습니다."); return; }
			var r = "";
			switch(cmd){
				case "add":r = this.activeWcw.wcb.addWebCanvas();break;
				case "duplicate":r = this.activeWcw.wcb.addDuplicateWebCanvas();break;
				case "mergeDown":r = this.activeWcw.wcb.mergeDown();break;
				case "remove":r = this.activeWcw.wcb.removeWebCanvas();break;
				case "moveUp":r = this.activeWcw.wcb.moveUpWebCanvasByIndex();break;
				case "moveDown":r = this.activeWcw.wcb.moveDownWebCanvasByIndex();break;
			}
			this.cmdTool("reset");
			this._syncPropLayerList();
		}
		,"selectLayer":function(index){
			if(!this.activeWcw){ this.setError( "wc2.addLayer() 활성화된 윈도우가 없습니다."); return; }
			this.activeWcw.wcb.setActiveWebCanvasByIndex(index);
			this.cmdTool("reset");
			this._syncPropLayerList();
		}
		//--- 확대/축소
		,"setZoom":function(zoom){
			if(!this.activeWcw){ this.setError( "wc2.addLayer() 활성화된 윈도우가 없습니다."); return; }
			this.activeWcw.wcb.setZoom(zoom);
		}
		
		//--- tool confirm/reset
		,"cmdTool":function(cmd){
			switch(cmd){
				case "confirm":wc2Tool.confirm(this.tool);wc2._syncPropLayerList();break;
				case "reset":wc2Tool.reset(this.tool);wc2Tool.init(this.tool,this.activeWcw.wcb);break;
				case "predraw":wc2.syncContext2dCfg();wc2Tool.predraw(this.tool,this.activeWcw.wcb);break;
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
			if(!wc2.activeWcw){
				this.setError( "wc2.viewImage() : 활성화된 윈도우가 없음");
				return false;
			}
			var div = document.createElement('div');
			div.className = "wc-viewImage";
			var img = new Image();
			img.title = wc2.activeWcw.wcb.name;
			img.className ="wc-viewImage";
			$(div).append(img);
			$(img).bind("load",function(event){
				$( this ).parent().dialog({"resizable":true,"draggable":true,
					"position": { my: "center top" , at: "center top", of: "#contentArea" },
					"modal":true,
					"title":wc2.activeWcw.wcb.name+" (view)",
					"close": function( event, ui ) {
						$(this).dialog('destroy').remove();
					},
				});
			})
			img.src = wc2.activeWcw.wcb.toDataURL();
		}
	};
})();