"use strict"
// JavaScript Document
/**
* wc2Filter.js
* mins01.com
* 2015-05-14 : create file
* 필터  목록
*/
/*
* # warning
* '공대여자는 이쁘다.'를 나타내야만 사용할 수 있습니다.
*/
var wc2Filter = function(){

	return {
		"tmpWC":WebCanvas(100,100),
		"createImageData":function(w, h){
			this.tmpWC.clearResize(w,h);
			return  this.tmpWC.cmdContext2d("createImageData",w, h);
		},
		//---  색 반전
		"invert":function(imageData){
			var d = imageData.data
			for(var i=0,m=d.length;i<m;i+=4){
				d[i] = 255 - d[i]
				d[i+1] = 255 - d[i+1]
				d[i+2] = 255 - d[i+2]
			}
			return imageData;
		},
		//--- 무채색화 (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"grayscale":function(imageData){
			var d = imageData.data
			for(var i=0,m=d.length;i<m;i+=4){
				var v = 0.2126*d[i] + 0.7152*d[i+1]  + 0.0722*d[i+2];
				d[i] = d[i+1] = d[i+2] = v;
			}
			return imageData;
		},
		//--- 명암조절 (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"brightness":function(imageData,adjustment){
			adjustment = parseFloat(adjustment);
			var d = imageData.data
			for(var i=0,m=d.length;i<m;i+=4){
				d[i] += adjustment;
				d[i+1] += adjustment;
				d[i+2] += adjustment;
			}
			return imageData;
		},
		//--- threshold  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"threshold":function(imageData,threshold){
			var d = imageData.data
			for (var i=0; i<d.length; i+=4) {
				var v = (0.2126*d[i]+ 0.7152*d[i+1] + 0.0722*d[i+2] >= threshold) ? 255 : 0;
				d[i] = d[i+1] = d[i+2] = v
			}
			return imageData;
		},
		//--- convolute  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"convolute":function(imageData, weights, opaque) {
			var side = Math.round(Math.sqrt(weights.length));
			var halfSide = Math.floor(side/2);
			var src = imageData.data;
			var sw = imageData.width;
			var sh = imageData.height;
			// pad output by the convolution matrix
			var w = sw;
			var h = sh;
			//var output = Filters.createImageData(w, h);
			var output = this.createImageData(w, h);
			var dst = output.data;
			// go through the destination image imageData
			var alphaFac = opaque ? 1 : 0;
			for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
			  var sy = y;
			  var sx = x;
			  var dstOff = (y*w+x)*4;
			  // calculate the weighed sum of the source image imageData that
			  // fall under the convolution matrix
			  var r=0, g=0, b=0, a=0;
			  for (var cy=0; cy<side; cy++) {
				for (var cx=0; cx<side; cx++) {
				  var scy = sy + cy - halfSide;
				  var scx = sx + cx - halfSide;
				  if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
					var srcOff = (scy*sw+scx)*4;
					var wt = weights[cy*side+cx];
					r += src[srcOff] * wt;
					g += src[srcOff+1] * wt;
					b += src[srcOff+2] * wt;
					a += src[srcOff+3] * wt;
				  }
				}
			  }
			  dst[dstOff] = r;
			  dst[dstOff+1] = g;
			  dst[dstOff+2] = b;
			  dst[dstOff+3] = a + alphaFac*(255-a);
			}
			}
			return output;
		},
		//--- convoluteFloat32  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"convoluteFloat32":function(pixels, weights, opaque) {
          var side = Math.round(Math.sqrt(weights.length));
          var halfSide = Math.floor(side/2);

          var src = pixels.data;
          var sw = pixels.width;
          var sh = pixels.height;

          var w = sw;
          var h = sh;
          var output = {
            width: w, height: h, data: new Float32Array(w*h*4)
          };
          var dst = output.data;

          var alphaFac = opaque ? 1 : 0;

          for (var y=0; y<h; y++) {
            for (var x=0; x<w; x++) {
              var sy = y;
              var sx = x;
              var dstOff = (y*w+x)*4;
              var r=0, g=0, b=0, a=0;
              for (var cy=0; cy<side; cy++) {
                for (var cx=0; cx<side; cx++) {
                  var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
                  var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
                  var srcOff = (scy*sw+scx)*4;
                  var wt = weights[cy*side+cx];
                  r += src[srcOff] * wt;
                  g += src[srcOff+1] * wt;
                  b += src[srcOff+2] * wt;
                  a += src[srcOff+3] * wt;
                }
              }
              dst[dstOff] = r;
              dst[dstOff+1] = g;
              dst[dstOff+2] = b;
              dst[dstOff+3] = a + alphaFac*(255-a);
            }
          }
          return output;
        },
		//--- sharpen  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"sharpen":function(imageData){
			return this.convolute(imageData,
				[ 0, -1,  0,
			   -1,  5, -1,
				0, -1,  0])
		},
		//--- blurC  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"blur":function(imageData){
			return this.convolute(imageData,
				[ 1/9, 1/9, 1/9,
				1/9, 1/9, 1/9,
				1/9, 1/9, 1/9])
		},
		//--- sharpen  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"sobel":function(imageData){
			var imageData = this.grayscale(imageData);
			var vertical = this.convoluteFloat32(imageData,
				[-1,-2,-1,
				  0, 0, 0,
				  1, 2, 1]);
			var horizontal = this.convoluteFloat32(imageData,
				[-1,0,1,
				 -2,0,2,
				 -1,0,1]);
			var id = this.createImageData(vertical.width, vertical.height);
			for (var i=0; i<id.data.length; i+=4) {
				var v = Math.abs(vertical.data[i]);
				id.data[i] = v;
				var h = Math.abs(horizontal.data[i]);
				id.data[i+1] = h
				id.data[i+2] = (v+h)/4;
				id.data[i+3] = 255;
		  }
		  return id;
		},
		//--- above  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"above":function(imageData){
			return this.convolute(imageData,
				[ 1, 1, 1,
				1, 0.7, 1,
				1, 1, 1])
		},
		//--- custrom  (http://www.html5rocks.com/en/tutorials/canvas/imagefilters/)
		"custrom":function(imageData,arr){
			return this.convolute(imageData,
				arr)
		},
	}

}()