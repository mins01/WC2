/**
 * ConcentratedLine
 * https://github.com/mins01/js-canvas-ConcentratedLine/
 * 제작 : 공대여자
 */

var ConcentratedLine = (function(){
  return {
    "radial":function(ctx,x,y,multi,r,strokeStyle){
      // var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(x, y);
      if(strokeStyle){
        ctx.strokeStyle = strokeStyle;
      }
      // ctx.translate(x, y);

      var deg = (360/multi);
      for(var i=0,m=multi;i<m;i++){
        // var deg = (360/multi)*(i+1);
        // console.log(deg);
        ctx.rotate(deg*Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(r,0);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.restore();
    },
    "createRadialGradient":function(ctx,addColorStops){
      var grd = ctx.createRadialGradient(0,0,0,0,0,360);
      for(var i=0,m=addColorStops.length;i<m;i++){
        grd.addColorStop(addColorStops[i][0],addColorStops[i][1]);
      }
      return grd;
    }
  }
})()
