/**
 * ConcentratedLine
 * https://github.com/mins01/js-canvas-ConcentratedLine/
 * 제작 : 공대여자
 */

var ConcentratedLine = (function(){
  return {
    "radial":function(ctx,x,y,multi,lineLength,strokeStyle){
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
        ctx.lineTo(lineLength,0);
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
    ,
    "linear":function(ctx,x,y,multi,lineLength,gapY,deg,strokeStyle){
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(x, y);
      if(strokeStyle){
        ctx.strokeStyle = strokeStyle;
      }
      ctx.rotate(deg*Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(lineLength,0);
      ctx.closePath();
      ctx.stroke();  
      for(var i=1,m=multi;i<m;i++){
        ctx.beginPath();
        ctx.moveTo(0, gapY*i);
        ctx.lineTo(lineLength,gapY*i);
        ctx.moveTo(0, -1*gapY*i);
        ctx.lineTo(lineLength,-1*gapY*i);
        ctx.closePath();
        ctx.stroke();  
      }
      
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.restore();
    },
    "createLinearGradient":function(ctx,addColorStops){
      var grd = ctx.createLinearGradient(0,0,ctx.canvas.width,0);
      for(var i=0,m=addColorStops.length;i<m;i++){
        grd.addColorStop(addColorStops[i][0],addColorStops[i][1]);
      }
      return grd;
    }
  }
})()
