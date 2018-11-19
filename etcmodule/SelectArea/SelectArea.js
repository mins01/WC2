/**
* SelectArea
* @description : HTML 에서 영역을 선택하는 툴
* @제한 : MIT 라이센스 + "공대여자는 예쁘다"를 나태낼 수 있어야만 사용할 수 있습니다.
* @author : 공대여자
* @site : www.mins01.com
* @date :2018-11-12~
* @github : https://github.com/mins01/ui_SelectArea
*/

// CustomEvent 호환용 (for IE)
(function () {
  
  if ( typeof window.CustomEvent === "function" ) return false;
  
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  
  CustomEvent.prototype = window.Event.prototype;
  
  window.CustomEvent = CustomEvent;
})();

var SelectArea = (function(){
  
  /**
  * toDraggable
  * @param  {html_node} target
  * @param  {function} cb_onpointerdown
  * @param  {function} cb_onpointermove
  * @param  {function} cb_onpointerup
  * @return {function} removeEventListener Function
  */
  var toDraggable = function(target,cb_onpointerdown,cb_onpointermove,cb_onpointerup){
    var data={
      "ing":false,
      "x0":0,
      "y0":0
    }
    var _getXY = function(evt){
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
      return [x,y];
    }
    var _onpointerdown = function(target,data,cb_onpointerdown){
      // var target = evt.target;
      return function(evt){
        data.ing = true;
        var xy = _getXY(evt);
        data.x0 = xy[0];
        data.y0 = xy[1];
        evt.preventDefault();evt.stopPropagation();
        if(cb_onpointerdown){
          cb_onpointerdown(evt,xy[0],xy[1]);
        }
        document.addEventListener('pointermove',_onpointermove);
        document.addEventListener('pointerup',_onpointerup);
        return false;
      }
    }(target,data,cb_onpointerdown)
    var _onpointermove = function(target,data,cb_onpointermove){
      return function(evt){
        if(!data.ing){return;}
        var xy = _getXY(evt);
        var gapX = xy[0]-data.x0;
        var gapY = xy[1]-data.y0;
        data.x0 = xy[0];
        data.y0 = xy[1];
        if(cb_onpointermove){
          cb_onpointermove(evt,gapX,gapY);
        }
        evt.preventDefault();evt.stopPropagation();
        return false;
      }
    }(target,data,cb_onpointermove)
    var _onpointerup = function(target,data,cb_onpointerup){
      return function(evt){
        if(data.ing && cb_onpointerup){
          cb_onpointerup(evt);
        }
        data.ing = false;
        evt.preventDefault();evt.stopPropagation();
        document.removeEventListener('pointermove',_onpointermove);
        document.removeEventListener('pointerup',_onpointerup);
        return false;
      }
    }(target,data,cb_onpointerup)
    var _notouchmove = function(evt){ evt.preventDefault();evt.stopPropagation()	;return false;}
    target.addEventListener('pointerdown',_onpointerdown);
    target.addEventListener('touchmove',_notouchmove);
    return function(){
      target.removeEventListener('pointerdown',_onpointerdown);
      target.removeEventListener('touchmove',_notouchmove);
    }
  }
  /**
  * UI 기본형 생성
  * @param  {html_node} target 기준 대상
  * @return {html_node_with_SelectArea}        UI용 노드
  */
  var _create = function(_p_var){
    var sa = document.createElement('div');
    sa.className="selectArea";
    sa.innerHTML =
    '<div class="selectArea-box">'+
    '<button type="button" class="selectArea-pointer" data-index="0" data-x="0" data-y="0"></button>'+
    '<button type="button" class="selectArea-pointer" data-index="1"></button>'+
    '<button type="button" class="selectArea-pointer" data-index="2"></button>'+
    '<button type="button" class="selectArea-pointer" data-index="3"></button>'+
    '<button type="button" class="selectArea-pointer" data-index="4" data-w="0" data-h="0"></button>'+
    '<button type="button" class="selectArea-pointer" data-index="5"></button>'+
    '<button type="button" class="selectArea-pointer" data-index="6"></button>'+
    '<button type="button" class="selectArea-pointer" data-index="7"></button>'+
    '<div class="selectArea-layout"></div>'+
    '</div>'+
    '<div class="selectArea-bg"></div>';
    sa.box=sa.querySelector('.selectArea-box');
    sa.bg=sa.querySelector('.selectArea-bg');
    sa.box.pointers=sa.querySelectorAll('.selectArea-pointer');
    sa.box.layout=sa.querySelector('.selectArea-layout');
    sa.selectedArea = sa.box.layout;
    
    /** @member {Boolean} outOfRange 대상을 벗어나서 설정 할 수 있는가? */
    sa.outOfRange = false;
    
    _p_var.autoRedraw = true;
    return sa;
  }
  
  /**
  * 기본 메소드 설정용
  * @param  {html_node_with_SelectArea} sa
  */
  function _initMethod(sa,_p_var){
    sa.__get_p_var = function(){
      return _p_var;
    }
    /**
    * 대상 지정 설정/변경
    * @param  {html_node} target
    */
    sa.setTarget = function(target,rangeTarget){
      var sa = this;
      sa.hide();
      sa.target = target;
      sa.target.sa = sa;
      // sa.rangeTarget = sa.target;
      if(!rangeTarget) rangeTarget = target;
      sa.setRangeTarget(rangeTarget);
      var p_bcr = sa.target.getBoundingClientRect();
      
      sa.tx = 0;
      sa.ty = 0;
      sa.tx1 = p_bcr.width;
      sa.ty1 = p_bcr.height;
      sa.rx = 0;
      sa.ry = 0;
      sa.w = p_bcr.width;
      sa.h = p_bcr.height;
      sa.rx1 = sa.rx+sa.w;
      sa.ry1 = sa.ry+sa.h;
      
      sa.tleft = sa.tx;
      sa.ttop = sa.ty;
      sa.tgight = sa.w+sa.tx;
      sa.tbottom = sa.h+sa.ty;
      
      sa.rleft = sa.rx;
      sa.rtop = sa.ry;
      sa.rright = sa.w+sa.rx;
      sa.rbottom = sa.h+sa.ry;
    }
    sa.setRangeTarget = function(rangeTarget){
      this.hide();
      var sa = this;
      if(sa.rangeTarget && sa.rangeTarget.removeToDraggable) sa.rangeTarget.removeToDraggable();
      sa.rangeTarget = rangeTarget;
      var _info = {x0:0,y0:0}
      sa.rangeTarget.removeToDraggable = toDraggable(sa.rangeTarget,function(evt,x,y){
        _p_var.autoRedraw = false;
        var p_bcr = sa.target.getBoundingClientRect();
        sa.show(x-p_bcr.x,y-p_bcr.y,x-p_bcr.x,y-p_bcr.y);
        _info.x0 = x;
        _info.y0 = y;
        console.log(x-p_bcr.x,y-p_bcr.y,x-p_bcr.x,y-p_bcr.y)
      },function(thisC){return function(evt,gapX,gapY){
        thisC.drawFromCoordinateBy(0,0,gapX,gapY)
        thisC.dispatchEvent((new CustomEvent("change", {})));
      }}(sa),
      function(evt,x,y){
        _p_var.autoRedraw = true;
        sa.redraw();
      })
      
      
      
      
    }
    /**
    * show
    * UI 보이기 파라메터 지정 안 할 경우 대상(target)의 시작좌표와 마침좌표 사용한다.
    * @param  {number} x  x좌표
    * @param  {number} y  y좌표
    * @param  {number} x1 x1좌표
    * @param  {number} y1 y1좌표
    */
    sa.show = function(x,y,x1,y1){
      if(!_p_var.enable){return false;}
      document.body.appendChild(this);
      if(x == undefined) x = this.tx;
      if(y == undefined) y = this.ty;
      if(x1 == undefined) x1 = this.tx1;
      if(y1 == undefined) y1 = this.ty1;
      this.drawFromCoordinate(x,y,x1,y1);
      _p_var.show = true;
    }
    /**
    * show
    * UI 보이기 파라메터 지정 안 할 경우 대상(target)의 시작좌표와 크기를 사용한다.
    * @param  {number} x  x좌표
    * @param  {number} y  y좌표
    * @param  {number} w x1좌표
    * @param  {number} h y1좌표
    */
    sa.showWithSize = function(x,y,w,h){
      this.show(x,y,w+x,h+y);
    }
    sa.showFullsize = function(){
      var p_bcr = this.target.getBoundingClientRect();
      
      this.show(0,0,p_bcr.width,p_bcr.height);
    }
    /**
    * UI숨기기
    */
    sa.hide = function(){
      if(this.parentNode) this.parentNode.removeChild(this);
      if(_p_var.show) _p_var.show = false;
    }
    sa.enable = function(){
      _p_var.enable = true;
    }
    sa.disable = function(){
      this.hide();
      _p_var.enable = false;
    }
    /**
    * 파괴하기
    * ... 사용 비추천. 이벤트만 삭제하는 수준으로 끝낸다.
    */
    sa.destroy = function(){
      window.removeEventListener("resize",_window_onresize);
      window.removeEventListener("scroll",_window_onresize);
      this.parentNode.removeChild(this);
      this.show = null;
      delete this.target.sa;
    }
    /**
    * 좌표로 설정
    * @param  {number} x
    * @param  {number} y
    * @param  {number} x1
    * @param  {number} y1
    */
    sa.drawFromCoordinate = function(x,y,x1,y1,fixedSize){
      if(!_p_var.enable){return false;}
      var p_bcr = this.target.getBoundingClientRect();
      var r_bcr = this.rangeTarget.getBoundingClientRect();
      var gapX = p_bcr.x-r_bcr.x;
      var gapY = p_bcr.y-r_bcr.y;
      
      // console.log(x,y,x1,y1,this.w,this.h);
      _drawFromCoordinate(this,x+gapX,y+gapY,x1+gapX,y1+gapY,fixedSize);
      if(_p_var.autoRedraw) this.redraw();
      this.dispatchEvent((new CustomEvent("change", {}) ));
    }
    /**
    * 선택된 영역의 대상에 상대적인 좌표,크기 정보 값 가져오기
    * 페이지에서 보이는 정보를 알고 싶으면 sa.selectedArea.getBoundingClientRect() 를 사용하라.
    * @return {DOMRect}
    */
    sa.getSelectedAreaRect=function(){
      var x = this.tleft;
      var y = this.ttop;
      if(DOMRect){
        return new DOMRect(x,y,this.w,this.h);
      }else{
        
        return {"x":x,"y":y,"width":this.w,"height":this.h,"left":x,"top":y,"right":x+this.w,"bottom":y+this.h};
      }
      
    }
    /**
    * 상대적 좌표이동
    * @param  {number} x
    * @param  {number} y
    */
    sa.moveBy = function(x,y){
      this.moveTo(this.tx+x,this.ty+y);
    }
    sa.moveTo = function(x,y){
      // console.log(x,y)
      this.drawFromCoordinate(x,y,x+this.w,y+this.h,true);
    }
    /**
    * 상대적 크기 변경
    * @param  {number} w
    * @param  {number} h
    */
    sa.sizeBy = function(w,h){
      this.sizeTo(this.w+w,this.h+h);
    }
    /**
    * 절대 크기 변경
    * @param  {number} w
    * @param  {number} h
    */
    sa.sizeTo = function(w,h){
      this.drawFromCoordinate(this.tx,this.ty,this.tx+w,this.ty+h);
    }
    /**
    * 좌표와 크기로 설정
    * @param  {number} x
    * @param  {number} y
    * @param  {number} w
    * @param  {number} h
    */
    sa.moveAndSize = function(x,y,w,h){
      this.drawFromCoordinate(x,y,x+w,y+h);
    }
    /**
    * 상재적 좌표로 설정
    * @param  {number} x
    * @param  {number} y
    * @param  {number} x1
    * @param  {number} y1
    */
    sa.drawFromCoordinateBy = function(x,y,x1,y1){
      if(!x&&!x1&&!y&&!y1){ return; }
      var x_e = this.tx+x;
      var y_e = this.ty+y;
      var x1_e = this.tx1+x1;
      var y1_e = this.ty1+y1;
      var w = x1_e-x_e;
      var h = y1_e-y_e;
      // console.log(x,y,x1,y1,w,h);
      this.drawFromCoordinate(x_e,y_e,x1_e,y1_e);
    }
    /**
    * 화면 다시 그리기
    * onresize 를 위해서 만듬
    */
    sa.redraw = function(){
      if(this.parentNode && _p_var.show){
        _drawFromCoordinate(this,this.rleft,this.rtop,this.rright,this.rbottom);
        this.dispatchEvent((new CustomEvent("redraw", {}) ));
      }
      
    }
  }
  // 대상에 이벤트 초기화
  var _initEvent = function(sa,_p_var){
    /**
    * onresize 이벤트용(protect)
    */
    var _window_onresize = function(sa){
      return function(evt){
        sa.redraw();
        // evt.preventDefault();evt.stopPropagation();
      }
    }(sa)
    /**
    * selectedArea 이동 시작시(protect)
    */
    var _toDraggable_onpointerdown = function(sa){
      return function(evt,x,y){
        _p_var.autoRedraw = false;
      }
    }(sa)
    /**
    * selectedArea 이동 후 좌표값 재계산용(protect)
    */
    var _toDraggable_onpointerup = function(sa){
      return function(evt,x,y){
        _p_var.autoRedraw = true;
        sa.redraw();
      }
    }(sa)
    window.addEventListener("resize",_window_onresize);
    window.addEventListener("scroll",_window_onresize);
    
    sa.box.layout.removeToDraggable = toDraggable(sa.box.layout,_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.moveBy(gapX,gapY);
      thisC.dispatchEvent((new CustomEvent("change", {}) ));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[0].removeToDraggable = toDraggable(sa.box.pointers[0],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(gapX,gapY,0,0)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[1].removeToDraggable = toDraggable(sa.box.pointers[1],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(0,gapY,0,0)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[2].removeToDraggable = toDraggable(sa.box.pointers[2],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(0,gapY,gapX,0)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[3].removeToDraggable = toDraggable(sa.box.pointers[3],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(0,0,gapX,0)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[4].removeToDraggable = toDraggable(sa.box.pointers[4],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(0,0,gapX,gapY)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[5].removeToDraggable = toDraggable(sa.box.pointers[5],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(0,0,0,gapY)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[6].removeToDraggable = toDraggable(sa.box.pointers[6],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(gapX,0,0,gapY)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    sa.box.pointers[7].removeToDraggable = toDraggable(sa.box.pointers[7],_toDraggable_onpointerdown,function(thisC){return function(evt,gapX,gapY){
      thisC.drawFromCoordinateBy(gapX,0,0,0)
      thisC.dispatchEvent((new CustomEvent("change", {})));
    }}(sa),_toDraggable_onpointerup);
    var t = function(sa){
      return function(){
        sa.hide();
      }
    }(sa)
    sa.bg.addEventListener('click',t)
  }
  
  /**
  * 영역의 이동, 차지에 대한 제어 부분
  * @param  {html_node_with_SelectArea} sa
  * @param  {number} x
  * @param  {number} y
  * @param  {number} x1
  * @param  {number} y1
  */
  var _drawFromCoordinate = function(sa,x,y,x1,y1,fixedSize){
    // 여기의 x,y,x1,y1은 rangeTarget 기준이다.
    // console.log(x,y,x1,y1);
    var t ;
    
    var scrollX = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollLeft == 'number' ? t : document.body).scrollLeft;
    var scrollY = (((t = document.documentElement) || (t = document.body.parentNode))  && typeof t.scrollTop == 'number' ? t : document.body).scrollTop
    var p_bcr = sa.target.getBoundingClientRect();
    var r_bcr = sa.rangeTarget.getBoundingClientRect();
    var gapX = p_bcr.x-r_bcr.x;
    var gapY = p_bcr.y-r_bcr.y;
    var x_e = x
    var x1_e = x1
    var y_e = y
    var y1_e = y1
    
    if(!sa.outOfRange){
      var rleft = Math.max(Math.min(x_e,x1_e),0);
      var rtop = Math.max(Math.min(y_e,y1_e),0);
      var rright = Math.min(Math.max(x_e,x1_e),r_bcr.width);
      var rbottom = Math.min(Math.max(y_e,y1_e),r_bcr.height);
      if(fixedSize){
        if(rright>=r_bcr.width){
          rright = r_bcr.width;
          rleft = rright-sa.w;
        }else if(rleft<=0){
          rleft = 0;
          rright = sa.w;
          
        }
        if(rbottom>=r_bcr.height){
          rbottom = r_bcr.height;
          rtop = rbottom-sa.h;
        }else if(rtop<=0 ){
          rtop = 0;
          rbottom = sa.h;
        }
      }
    }else{
      var rleft = Math.min(x_e,x1_e)
      var rtop = Math.min(y_e,y1_e)
      var rright = Math.max(x_e,x1_e)
      var rbottom = Math.max(y_e,y1_e)
    }
    // console.log(x_e,y_e,x1_e,y1_e);
    
    
    var w = rright-rleft;
    var h = rbottom-rtop;
    
    sa.rx = x_e;
    sa.ry = y_e;
    sa.rx1 = x1_e;
    sa.ry1 = y1_e;
    
    sa.tx = sa.rx-gapX;
    sa.ty = sa.ry-gapY;
    sa.tx1 = sa.rx1-gapX;
    sa.ty1 = sa.ry1-gapY;
    
    
    sa.rleft = rleft;
    sa.rtop = rtop;
    sa.rright = rright;
    sa.rbottom = rbottom;
    
    
    sa.tleft = rleft-gapX;
    sa.ttop = rtop-gapY;
    sa.tright = rright-gapX;
    sa.tbottom = rbottom-gapY;
    
    
    sa.w = w;
    sa.h = h;
    // console.log("sa.w",sa.w)
    
    // console.log(sa.tx)
    sa.box.pointers[0].setAttribute('data-x',sa.tleft.toFixed(0));
    sa.box.pointers[0].setAttribute('data-y',sa.ttop.toFixed(0));
    sa.box.pointers[4].setAttribute('data-w',w.toFixed(0));
    sa.box.pointers[4].setAttribute('data-h',h.toFixed(0));
    
    sa.box.style.left = rleft+"px";
    sa.box.style.top = rtop+"px";
    sa.box.style.width = w+"px";
    sa.box.style.height = h+"px";
    sa.style.left = r_bcr.left+scrollX+"px";
    sa.style.top = r_bcr.top+scrollY+"px";
    sa.style.width = r_bcr.width+"px";
    sa.style.height = r_bcr.height+"px";
    sa.bg.style.borderLeftWidth = Math.max(0,Math.min(r_bcr.width,rleft))+"px";
    sa.bg.style.borderTopWidth = Math.max(0,Math.min(r_bcr.height,rtop))+"px";
    sa.bg.style.borderRightWidth = Math.max(0,Math.min(r_bcr.width,(r_bcr.width-rleft-w)))+"px";
    sa.bg.style.borderBottomWidth =  Math.max(0,Math.min(r_bcr.height,(r_bcr.height-rtop-h)))+"px";
  }
  
  return function(target,rangeTarget){
    /**
    * protect 변수 선언
    */
    var _p_var={
      "autoRedraw":true,
      "show":false,
      "enable":true
    }
    
    var sa = _create(_p_var);
    _initMethod(sa,_p_var);
    _initEvent(sa,_p_var)
    sa.setTarget(target,rangeTarget);
    return sa;
  }
})()
