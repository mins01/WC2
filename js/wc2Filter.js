"use strict"
// JavaScript Document
/**
* wc2Filter.js
* mins01.com
* 2015-05-14 : create file
* 필터  목록
* depend : filter.js
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
		"grayscale":function(imageData){
			return Filters.grayscale(imageData);
		},
		"grayscaleAvg":function(imageData){
			return Filters.grayscaleAvg(imageData);
		},
		"luminance":function(imageData){
			return Filters.luminance(imageData);
		},
		"brightness":function(imageData,brightness,contrast){
			return Filters.brightnessContrast(imageData,brightness, contrast);
		},
		"gaussianBlur":function(imageData,diameter){
			return Filters.gaussianBlur(imageData,parseFloat(diameter))
		},
		"threshold":function(imageData,threshold, high, low){
			return Filters.threshold(imageData,parseFloat(threshold),parseFloat(high),parseFloat(low));
		},
		"sobel":function(imageData){
			return Filters.sobel(imageData);
		},
		"laplace":function(imageData){
			return Filters.laplace(imageData);
		},
		"distortSine":function(imageData, amount, yamount){
			return Filters.distortSine(imageData,parseFloat(amount),parseFloat(yamount));
		},
		//--- colorize
		"colorize":function(imageData, r, g, b){
			r = parseFloat(r);
			g = parseFloat(g);
			b = parseFloat(b);
			var d = imageData.data
			for(var i=0,m=d.length;i<m;i+=4){
				d[i] = Math.max(0,Math.min(255,d[i]+r));
				d[i+1] = Math.max(0,Math.min(255,d[i+1]+g));
				d[i+2] = Math.max(0,Math.min(255,d[i+2]+b));
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
		//--- 파레트 제한 적용 : 자체제작, 콜백으로 동작, 속도가 조금더 빠르다.
		"applyPalette_cb":function(imageData,palette,is_optimize,cb){
			if(is_optimize=='1'){
				var opt_palette = colorPalette.getPaletteFromImageDataWithBasePalette(imageData,palette);
				return colorPalette.applyPaletteWithCallback(imageData,opt_palette,cb);
			}else if(is_optimize=='2'){
				var opt_palette = colorPalette.getMedianCutPalette(imageData,colorPalette.getPalette(palette).length);
				return colorPalette.applyPaletteWithCallback(imageData,opt_palette,cb);
			}else{
				return colorPalette.applyPaletteWithCallback(imageData,palette,cb);
			}
		},
		//--- 파레트 제한 적용 : 자체제작
		"applyPalette":function(imageData,palette,is_optimize,cb){
			if(is_optimize=='1'){
				var opt_palette = colorPalette.getPaletteFromImageDataWithBasePalette(imageData,palette);
				return colorPalette.applyPalette(imageData,opt_palette,cb);
			}else if(is_optimize=='2'){
				var opt_palette = colorPalette.getMedianCutPalette(imageData,colorPalette.getPalette(palette).length);
				return colorPalette.applyPalette(imageData,opt_palette,cb);
			}else{
				return colorPalette.applyPalette(imageData,palette,cb);
			}
		},

		//--- 컬러뎁스 제한 : 자체제작
		"applyColorDepth":function(imageData,depthR,depthG,depthB){
			return colorPalette.applyColorDepth(imageData,depthR,depthG,depthB);
		},
		//--- 픽셀레이트 : 자체제작
		"pixelate":function(imageData,pixelSize){
			var canvas = document.createElement('canvas');
			canvas.width = imageData.width;
			canvas.height = imageData.height;
			var canvas2 = document.createElement('canvas');
			var w = imageData.width/pixelSize;
			var h = imageData.height/pixelSize;
			canvas2.width = w;
			canvas2.height = h;			
			var ctx = canvas.getContext('2d');
			var ctx2 = canvas2.getContext('2d');
			ctx.putImageData(imageData, 0, 0);
			ctx2.drawImage(canvas,0,0,w,h);
			ctx.imageSmoothingEnabled = false;
			canvas.width = imageData.width;
			canvas.height = imageData.height;			
			ctx.drawImage(canvas2, 0, 0, w, h, 0, 0, canvas.width, canvas.height)
			ctx.imageSmoothingEnabled = true;
			return ctx.getImageData(0,0,canvas.width, canvas.height);
		}
	}


}()
