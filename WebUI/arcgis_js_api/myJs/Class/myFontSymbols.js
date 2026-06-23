
define('keepsoft/gis/extlayers/D3AnnoLayer',
[
	'dojo/_base/declare',
	'dojo/_base/lang',
	'd3/d3',
	'dojo/on',
	'esri/Evented',
	'esri/geometry/screenUtils'
],
function(declare, lang, d3js, on, Evented, screenUtils){
	var d = declare([Evented], {
		declaredClass:'keepsoft.gis.extlayers.D3AnnoLayer',
		_eventMap:{

		},
		option:{
			labelFields:[
				'stcd','stnm'
			],
			labelPrifixes:[
				'编码:','名称:'
			],
			labelSuffixes:[
				'',''
			],
			rectRadius:5,
			rectWidth:120,
			rectOffsetX:0,
			rectOffsetY:16,
			rectFillColor:'rgba(20,20,20,0.4)',
			rectStrokeColor:'rgba(255,255,255,1)',
			rectStrokeWidth:2,
			labelHeigth:23,
			labelVerticalAlign:4,
			labelsPaddingTop:2,
			labelsPaddingBottom:2,
			labelsPaddingLeft:2,
			labelsPaddingRight:2,
			fontSize:24,
			fontColor:'rgba(220,20,20,1)',
			labelDx:20
		},
		constructor:function(map, graphicsLayer, opt){
			//1.全局参数
			this.map = map;
			this.graphicsLayer = graphicsLayer;
			//2.合并参数
			lang.mixin(this.option, opt);
			//3.创建svg group
			this.domId = this.graphicsLayer.id+'-d3anno';
			d3js.select('#'+this.map.id+'_gc')
				.append('g')
				.attr({
					'id':this.domId
				});
		},
		init:function(){
			var map = this.map;
			on(map, 'pan', lang.hitch(this, this._pan));
			on(map, 'zoom-start', lang.hitch(this, this._zoomStart));
			on(map, 'zoom-end', lang.hitch(this, this._zoomEnd));
			this._initialize();
		},
		_initialize:function(){
			this._removeAllChildren();
			this._draw();
		},
		_removeAllChildren:function(){
			dojo.empty(this.domId);
		},
		_draw:function(){
			if (!this.option.labelFields){
				return;
			}

			for (var i =0; i < this.graphicsLayer.graphics.length; i++){
				var g = this.graphicsLayer.graphics[i];
				this._drawBgShape(g);
				this._drawText(g);
			}
		},
		_drawBgShape:function(graphic){
			var geometry = graphic.geometry;
			var o = this.option;
			var labelNum = o.labelFields.length;
			var shapeHeight = o.labelsPaddingTop + (o.fontSize+o.labelVerticalAlign)*labelNum + o.labelsPaddingBottom;
			var shapeWidth = o.rectWidth;
			var x = 0, y=0;
			var map = this.map;
			var mapExtent = map.extent;
			var mapWidth = map.width;
			var mapHeight = map.height;
			var xy = screenUtils.toScreenPoint(mapExtent, mapWidth, mapHeight, geometry);
			var _mvr = map.__visibleRect;
			x = xy.x - _mvr.x - shapeWidth/2 + o.rectOffsetX;
			y = xy.y - _mvr.y + o.rectOffsetY;
			/*
			console.log(xy);
			console.log(_mvr);
			console.log(shapeHeight);
			*/
			d3js.select('#'+this.domId)
				.append('rect')
				.attr({
					'x':x,
					'y':y,
					'width':shapeWidth,
					'height':shapeHeight,
					'fill':o.rectFillColor,
					'stroke':o.rectStrokeColor,
					'stroke-width':o.rectStrokeWidth,
					'rx':o.rectRadius,
					'ry':o.rectRadius
				})
		},
		_drawText:function(graphic){
			var geometry = graphic.geometry;
			var o = this.option;
			var labelNum = o.labelFields.length;
			var shapeHeight = o.labelsPaddingTop + (o.fontSize+o.labelVerticalAlign)*labelNum - o.labelAlign + o.labelsPaddingBottom;
			var shapeWidth = o.rectWidth;
			var x = 0, y=0;
			var map = this.map;
			var mapExtent = map.extent;
			var mapWidth = map.width;
			var mapHeight = map.height;
			var xy = screenUtils.toScreenPoint(mapExtent, mapWidth, mapHeight, geometry);
			var _mvr = map.__visibleRect;
			x = xy.x - _mvr.x -shapeWidth/2 + o.rectOffsetX;
			y = xy.y - _mvr.y + o.rectOffsetY;
			var node = d3js.select('#'+this.domId);
			var labelNum = o.labelFields.length;
			for (var i=0; i < labelNum; i++){
				var labelX = x + o.labelsPaddingLeft || 0;
				var labelY = y + o.labelsPaddingTop+o.fontSize+(o.fontSize+o.labelVerticalAlign)*i || 0;
				var fstring = graphic.attributes[o.labelFields[i]] || '';
				var prefix = o.labelPrifixes[i] || '';
				var suffix = o.labelSuffixes[i] || '';
				var text = prefix + fstring + suffix;
				node.append('text')
					.attr({
						'x':labelX,
						'y':labelY,
						'fill':o.fontColor,
						'font-size':o.fontSize,
						'dx':o.labelDx
					})
					.text(text);
			}
				
		},

		_pan:function(e){
			//console.log(e);
			var dx = e.delta.x;
			var dy = e.delta.y;
			var _dx = this.map.__visibleRect.x+dx;
			var _dy = this.map.__visibleRect.y+dy;
			d3.select('#'+this.domId)
				.attr({
					'transform':'matrix(1,0,0,1,'+_dx+','+_dy+')'
				})
		},
		_zoomStart:function(){
			this._removeAllChildren();
		},
		_zoomEnd:function(){
			d3.select('#'+this.domId)
				.attr({
					'transform':'matrix(1,0,0,1,0,0)'
				})
			this._draw();
		}
	});
	return d;
})
