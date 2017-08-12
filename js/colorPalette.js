/**
 * 파레트 조작용
 * depend regquant
 * @type {Object}
 */
var colorPalette = {
	//색상세트들
	"palettes":{},
	"getPalette":function(paletteName){
		var palette = (typeof paletteName == "string")?this.palettes[paletteName]:paletteName;
		if(!palette || !palette[0]){
			throw new Error("not supported palette '"+paletteName.toString()+"'");
		}
		return palette
	},
	//-- 가장 가까운색 찾기
	"getClosestColor":function(r,g,b,palette){
		var closestSet = null;
		var total=0,total2=0;
		for(var i=0,m=palette.length;i<m;i++){
				total2=Math.abs(r-palette[i][0]) + Math.abs(g-palette[i][1]) +Math.abs(b-palette[i][2]);
			if(i==0){
				closestSet = palette[i];
				total = total2;
			}else{

				if(total>total2){
					closestSet = palette[i];
					total = total2;
				}
			}
			if(total==0){break;}
		}
		return closestSet;
	},
	"createImageData":function(w, h) {
		if(!this.tmpCanvas){
			this.tmpCanvas = document.createElement('canvas');
			this.tmpCtx = this.tmpCanvas.getContext('2d');
		}
    return this.tmpCtx.createImageData(w, h);
  },
	"createImageDataByImageData":function(imageData) {
		if(!this.tmpCanvas){
			this.tmpCanvas = document.createElement('canvas');
			this.tmpCtx = this.tmpCanvas.getContext('2d');
		}
    return this.tmpCtx.createImageData(imageData);
  },
	"applyPaletteWithCallback":function(imageData,i_palette,callback){
		let toImageData = this.createImageDataByImageData(imageData);

		let palette = this.getPalette(i_palette);
		let tmp_palette = new Array(16777216);
		let key = 0,closestColor;

		let fns = [];
		for(var i=0,m=imageData.data.length;i<m;i+=10000){
			fns.push(function(i,m,thisC){return function(){
				for(;i<m;i+=4){
					var c0 = imageData.data[i];
					var c1 = imageData.data[i+1];
					var c2 = imageData.data[i+2];
					var c3 = imageData.data[i+3];
					key = c0*65535+c1*256+c2;

					if(tmp_palette[key]){
						closestColor = tmp_palette[key];
					}else{
						tmp_palette[key] = closestColor = thisC.getClosestColor(c0,c1,c2,palette);
					}

					toImageData.data[i] = closestColor[0];
					toImageData.data[i+1] = closestColor[1];
					toImageData.data[i+2] = closestColor[2];
					toImageData.data[i+3] = c3;
				}
			}}(i,i+10000-1,this))
		}
		console.log(fns);
		let on_cnt = 0,cnt = fns.length;
		let called_callback = 0;
		let tm_fn = function(){
			setTimeout(function(){
				if(fns.length==0 && cnt==0){

					return;
				}
				let fn = fns.pop();
				on_cnt++;
				if(on_cnt<2){
					tm_fn()
				}
				if(fn) fn();
				on_cnt--;
				cnt--;
				if(cnt==0) {
					callback(toImageData)
				}
				if(on_cnt<2){
					tm_fn()
				}
			})
		}
		tm_fn()
		tm_fn();

		return toImageData;
		//
	},
	/**
	 * depth 기준으로 색을 단편화 시킴.
	 * @param  {[type]} imageData [description]
	 * @param  {[type]} depth     2,3,4,5,6,7,8~~
	 * @return {[type]}           [description]
	 */
	"applyColorDepth":function(imageData,depthR,depthG,depthB){
		depthR = parseInt(depthR);
		depthG = parseInt(depthG);
		depthB = parseInt(depthB);
		let mnumR = Math.ceil(256/depthR);
		let mnumG = Math.ceil(256/depthG);
		let mnumB = Math.ceil(256/depthB);
		let toImageData = this.createImageDataByImageData(imageData);

		for(var i=0,m=imageData.data.length;i<m;i+=4){
			let c0 = imageData.data[i];
			let c1 = imageData.data[i+1];
			let c2 = imageData.data[i+2];
			let c3 = imageData.data[i+3];

			toImageData.data[i] = Math.ceil(c0/mnumR)*mnumR;
			toImageData.data[i+1] = Math.ceil(c1/mnumG)*mnumG;
			toImageData.data[i+2] = Math.ceil(c2/mnumB)*mnumB;
			toImageData.data[i+3] = c3;
		}
		// console.log(imagedata);
		return toImageData;
		//
	},
	"applyPalette":function(imageData,i_palette){
		var toImageData = this.createImageDataByImageData(imageData);

		let palette = this.getPalette(i_palette);
		let tmp_palette = new Array(16777216);
		let key = 0,closestColor;

		for(var i=0,m=imageData.data.length;i<m;i+=4){
			var c0 = imageData.data[i];
			var c1 = imageData.data[i+1];
			var c2 = imageData.data[i+2];
			var c3 = imageData.data[i+3];
			key = c0*65535+c1*256+c2;

			if(tmp_palette[key]){
				closestColor = tmp_palette[key];
			}else{
				tmp_palette[key] = closestColor = this.getClosestColor(c0,c1,c2,palette);
			}

			toImageData.data[i] = closestColor[0];
			toImageData.data[i+1] = closestColor[1];
			toImageData.data[i+2] = closestColor[2];
			toImageData.data[i+3] = c3;
		}
		// console.log(imagedata);
		return toImageData;
		//
	},
	"getMedianCutPalette":function(imageData,colors){
		let opts = {
		    colors: colors,             // desired palette size
		    method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
		    boxSize: [64,64],        // subregion dims (if method = 2)
		    boxPxls: 2,              // min-population threshold (if method = 2)
		    initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
		    minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
		    dithKern: null,          // dithering kernel name, see available kernels in docs below
		    dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
		    dithSerp: false,         // enable serpentine pattern dithering
		    palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
		    reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
		    useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
		    cacheFreq: 10,           // min color occurance count needed to qualify for caching
		    colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
		};
		let q = new RgbQuant(opts);
		q.sample(imageData);
		return q.palette(true,true);
	},
	// @deprecated 이미지에서 파레트를 가져온후 색상이 많은 순으로 제한한다.   대신 getMedianCutPalette 이걸 써라.
	"getPaletteFromImageData":function(imageData,limit){
		return this.getMedianCutPalette(imageData,limit);
	},
	// 이미지에서 파레트를 가져온후 다른 파레트를 기반으로 제한한다.
	"getPaletteFromImageDataWithBasePalette":function(imageData,bPalette){
		var palette = this.getPalette(bPalette);

		var fPalette = {};
		for(var i=0,m=imageData.data.length;i<m;i+=4){
			var c0 = imageData.data[i];
			var c1 = imageData.data[i+1];
			var c2 = imageData.data[i+2];
			// var c3 = imageData.data[i+3];
			if(!fPalette[c0+","+c1+","+c2]){
				fPalette[c0+","+c1+","+c2]=[c0,c1,c2,0];
			}
			fPalette[c0+","+c1+","+c2][3]++;
		}
		var tPalette = {}
		for(var x in fPalette){
			var c0 = fPalette[x][0];
			var c1 = fPalette[x][1];
			var c2 = fPalette[x][2];
			// var c3 = fPalette[x][3]; //cnt
			var closestColor = this.getClosestColor(c0,c1,c2,palette);
			var c_name = closestColor[0]+","+closestColor[1]+","+closestColor[2];
			if(!tPalette[c_name]){
				tPalette[c_name]=fPalette[x];
			}else if(tPalette[c_name][3] < fPalette[x][3] ){
				tPalette[c_name]=fPalette[x];
			}
		}
		var rPalette=[]
		for(var x in tPalette){
			rPalette.push(tPalette[x].slice(0,3));
		}
		return rPalette;
	}


}
