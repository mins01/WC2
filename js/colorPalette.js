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
	"applyPalette":function(imageData,i_palette){
		var toImageData = this.createImageDataByImageData(imageData);

		var palette = this.getPalette(i_palette);

		for(var i=0,m=imageData.data.length;i<m;i+=4){
			var c0 = imageData.data[i];
			var c1 = imageData.data[i+1];
			var c2 = imageData.data[i+2];
			var c3 = imageData.data[i+3];
			var closestColor = this.getClosestColor(c0,c1,c2,palette);
			toImageData.data[i] = closestColor[0];
			toImageData.data[i+1] = closestColor[1];
			toImageData.data[i+2] = closestColor[2];
			toImageData.data[i+3] = c3;
		}
		// console.log(imagedata);
		return toImageData;
		//
	},
	// 이미지에서 파레트를 가져온후 색상이 많은 순으로 제한한다.
	"getPaletteFromImageData":function(imageData,limit){
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
		var rPalette = Object.values(fPalette);
		rPalette.sort(function(a,b){return b[3]- a[3]})
		rPalette.forEach(function(el,idx,arr){
			el.splice(3,1);
		})
		if(limit){
			rPalette.splice(limit,rPalette.length-limit);
		}
		return rPalette;
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
