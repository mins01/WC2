/**
 * InputRangeBox
 * input range에 up/down 버튼을 만들어준다. 현재 값을 보여준다.
 * "공대여자는 이쁘다"를 표시기해야 쓸 수 있습니다.
 */
(function () {
  if ( typeof window.CustomEvent === "function" ) return false; //If not IE

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

var InputRangeBox={
	"onload":function(){
		var els = document.querySelectorAll('.inputRangeBox')
		for(var i=0,m=els.length;i<m;i++){
			InputRangeBox.init(els[i])	
		}
	},
	"init":function(el){
		var IRB = el;
		if(IRB.rib_on){
			return false;
		}
		
		IRB.input = IRB.querySelector('input');
		if(!IRB.input){
			console.error("not exists input in IRB ");
			return false;
		}
		
		var btn_m = IRB.querySelector(".btn-m")?IRB.querySelector(".btn-m"):document.createElement('button');
		btn_m.className = "btn-m";
    btn_m.type="button";
		
		var btn_p = IRB.querySelector(".btn-p")?IRB.querySelector(".btn-p"):document.createElement('button');
		btn_p.className = "btn-p";
    btn_p.type="button";
		// IRB.innerHTML = '';
		IRB.appendChild(btn_m)
		IRB.appendChild(IRB.input)
		IRB.appendChild(btn_p)
		//-- 기본값 처리
		if(!IRB.input.step){
			IRB.input.step = 1;
		}
		// 노드간에 연결
		btn_m.input = IRB.input;
		IRB.btn_m = btn_m;
		btn_p.input = IRB.input;
		IRB.btn_p = btn_p;
		IRB.input.IRB = IRB;
		//-- .value 변경에 따른 후처리
		IRB.input._value = IRB.input.value;
		var descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
		var inputSetter = descriptor.set;
		descriptor.set = function(val) {
			Object.defineProperty(this, "value", {set:inputSetter});
			this.value = val;
      var toFixed = this.IRB.getAttribute('data-toFixed');
			toFixed = (toFixed==null)?0:parseInt(toFixed);
			this.IRB.setAttribute("data-value",parseFloat(this.value).toFixed(toFixed));
			this.setAttribute("value",val);
			Object.defineProperty(this, "value", descriptor);
		}
		Object.defineProperty(IRB.input, "value", descriptor);
    var oninput = function(evt){
      // console.log(evt.type)
			var toFixed = this.IRB.getAttribute('data-toFixed');
			toFixed = (toFixed==null)?0:parseInt(toFixed);
			this.IRB.setAttribute("data-value",parseFloat(this.value).toFixed(toFixed));
		}
		IRB.input.addEventListener('input',oninput)
    IRB.input.addEventListener('change',oninput)
		//-- 버튼 이벤트
		IRB.btn_m.actFn = function(el){
			return function(){
				try{el.stepDown();}catch(e){console.log(e)}
				var input_event = new CustomEvent('input',{bubbles: true, cancelable: true, detail: {}});
				el.dispatchEvent(input_event);
			}
		}(IRB.input)
		IRB.btn_p.actFn = function(el){
			return function(){
				try{el.stepUp();}catch(e){console.log(e)}
				var input_event = new CustomEvent('input',{bubbles: true, cancelable: true, detail: {}});
				el.dispatchEvent(input_event);
			}
		}(IRB.input)
		var evtFn = function(el){
			return function(evt){
				if(el.tm){clearInterval(el.tm) }
				this.actFn();
				el.tm = setInterval(this.actFn,100)
				return false;
			}
		}(el)
		var clearFn = function(el){
			return function(evt){
				if(el.tm){ clearInterval(el.tm) }
				var input_event = new CustomEvent('input',{bubbles: true, cancelable: true, detail: {}});
				this.dispatchEvent(input_event);
        input_event = new CustomEvent('change',{bubbles: true, cancelable: true, detail: {}});
				el.dispatchEvent(input_event);
				return false
			}
		}(el)
		IRB.btn_m.addEventListener('keypress',function(evt){
			if(evt.keyCode==32){
        this.actFn();
        clearFn();
      }	
		});
		IRB.btn_p.addEventListener('keypress',function(evt){
      if(evt.keyCode==32){
        this.actFn();
        clearFn();
      }	
		});
		// IRB.btn_p.addEventListener('click',IRB.btn_p.actFn);
		if(PointerEvent){
			
			IRB.btn_m.addEventListener('pointerdown',evtFn);
			IRB.btn_m.addEventListener('pointerup',clearFn);
			IRB.btn_m.addEventListener('pointerout',clearFn);
			IRB.btn_p.addEventListener('pointerdown',evtFn);	
			IRB.btn_p.addEventListener('pointerup',clearFn);
			IRB.btn_p.addEventListener('pointerout',clearFn);
		}else{
			IRB.btn_m.addEventListener('mousedown',evtFn);
			IRB.btn_m.addEventListener('mouseup',clearFn);				
			IRB.btn_m.addEventListener('mouseout',clearFn);	
			IRB.btn_p.addEventListener('mousedown',evtFn);
			IRB.btn_p.addEventListener('mouseup',clearFn);				
			IRB.btn_p.addEventListener('mouseout',clearFn);	
		}
		
		
		//--값 초기화
		var toFixed = IRB.getAttribute('data-toFixed');
		toFixed = (toFixed==null)?0:parseInt(toFixed);
    // console.log(IRB.input.name,parseFloat(IRB.input.value).toFixed(toFixed))
		IRB.setAttribute("data-value",parseFloat(IRB.input.value).toFixed(toFixed));
		//-- 완료 표시
		IRB.rib_on = true;
		IRB.setAttribute("rib_on","1");
		
	}
}