/**
 * map 类的定义
 */
define(["dojo/_base/declare",
		'esri/map',
		"esri/SpatialReference",
		"esri/Color",
		"esri/graphic",
		"esri/geometry/Geometry",
		"esri/geometry/Point",
		"esri/geometry/Polygon",
		"esri/geometry/Extent",
		"esri/layers/GraphicsLayer",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/PictureMarkerSymbol",
		"myJs/Maptext",
		"myJs/ToolTip",
		"dojo/on",
		"dojo/_base/lang",
		"esri/Evented"
	],
	function(declare, Map, SpatialReference, Color, Graphic, Geometry, Point, Polygon, Extent, GraphicsLayer, ArcGISDynamicMapServiceLayer,
		SimpleFillSymbol, PictureMarkerSymbol, MapText, MapTip, on, lang, Evented) {
		return declare([Evented], {
			_map: null,
			_config: {
				serviceUrl: 'http://112.21.188.188:8032/json/reply/',
				tileDTURL: 'http://112.21.188.187:6080/arcgis/rest/services/jkq_hl/MapServer',
				tileLWURL: 'http://112.21.188.187:6080/arcgis/rest/services/jkq_lw/MapServer',
				tileWXWQURL: 'http://112.25.70.13:6080/arcgis/rest/services/2015zhiban/MapServer', //区域
				tileHDURL: 'http://112.21.188.187:6080/arcgis/rest/services/jkq_hd/MapServer',
				tileWQURL: 'http://112.21.188.187:6080/arcgis/rest/services/jkq_wq/MapServer',
				tilePQURL: 'http://112.21.188.187:6080/arcgis/rest/services/jkq_sgnq/MapServer',
				graphicURL: 'http://112.21.188.187:6080/arcgis/rest/services/jkq_sgnq/MapServer/identify?geometry=120.1036%2C31.7460&geometryType=esriGeometryPoint&sr=4214&layers=2&tolerance=100000&mapExtent=-180%2C-90%2C180%2C90&imageDisplay=400%2C300%2C98&returnGeometry=true&returnZ=false&returnM=false&f=json'
			},
			_extent: null,
			_vectors: null,
			_tooltip: {
				graphic: null,
				element: null
			},
			_mapTexts: [],
			_xzfqLayer: null,
			_tiledLayers: null,
			/**
			 * 加载地图
			 */
			constructor: function(id, opts, callback) {
				var sr = new SpatialReference(4214);
				var lods = [{
						"level": 0,
						"resolution": 0.3515625,
						"scale": 147748796.52937502
					},
					{
						"level": 1,
						"resolution": 0.17578125,
						"scale": 73874398.264687508
					},
					{
						"level": 2,
						"resolution": 0.087890625,
						"scale": 36937199.132343754
					},
					{
						"level": 3,
						"resolution": 0.0439453125,
						"scale": 18468599.566171877
					},
					{
						"level": 4,
						"resolution": 0.02197265625,
						"scale": 9234299.7830859385
					},
					{
						"level": 5,
						"resolution": 0.010986328125,
						"scale": 4617149.8915429693
					},
					{
						"level": 6,
						"resolution": 0.0054931640625,
						"scale": 2308574.9457714846
					},
					{
						"level": 7,
						"resolution": 0.00274658203125,
						"scale": 1154287.4728857423
					},
					{
						"level": 8,
						"resolution": 0.001373291015625,
						"scale": 577143.73644287116
					},
					{
						"level": 9,
						"resolution": 0.0006866455078125,
						"scale": 288571.86822143558
					},
					{
						"level": 10,
						"resolution": 0.00034332275390625,
						"scale": 144285.93411071779
					},
					{
						"level": 11,
						"resolution": 0.000171661376953125,
						"scale": 72142.967055358895
					},
					{
						"level": 12,
						"resolution": 8.58306884765625e-005,
						"scale": 36071.483527679447
					},
					{
						"level": 13,
						"resolution": 4.291534423828125e-005,
						"scale": 18035.741763839724
					},
					{
						"level": 14,
						"resolution": 2.1457672119140625e-005,
						"scale": 9017.8708819198619
					},
					{
						"level": 15,
						"resolution": 1.0728836059570313e-005,
						"scale": 4508.9354409599309
					},
					{
						"level": 16,
						"resolution": 5.3644180297851563e-006,
						"scale": 2254.4677204799655
					}
				];
				var extent = new Extent({
					xmin: opts.extent.xmin,
					ymin: opts.extent.ymin,
					xmax: opts.extent.xmax,
					ymax: opts.extent.ymax,
					spatialReference: new SpatialReference(opts.extent.sr)
				});
				var map = new Map(id, {
					lods: lods,
					maxZoom: 16,
					minZoom: 5,
					zoom: 8,
					logo: false,
					slider: false,
					extent: extent
				});
				// 设置地图坐标系类型
				map.spatialReference = sr;
				this._map = map;
				this._extent = extent;
				// 加载完成事件
				if(map.loaded) {
					callback();
				} else {
					dojo.connect(map, "onLoad", callback);
				}
			},
			/**
			 * 设置地图中心点和缩放层级
			 * @param c
			 * @param z
			 */
			/**
			 * 设置地图中心点
			 * @param c
			 */
			setCenter: function(c) {
				var point = new Point(c.x, c.y, new SpatialReference(c.sr));
				this._map.centerAt(point);
			},
			/**
			 * 获取地图缩放等级
			 */
			getZoom: function() {
				return this._map.getZoom();
			},
			/**
			 * 重置地图当前extent
			 */
			resetMap: function() {
				this._map.setExtent(this._extent);
			},
			/**
			 * 加载瓦片图层
			 */
			loadTiledLayers: function(filter, callback) {
				// 底图
				var tileBASELayer = new ArcGISDynamicMapServiceLayer(this._config.tileDTURL,{
					visible: false
				});
				// 路网
				var tileLWLayer = new ArcGISDynamicMapServiceLayer(this._config.tileLWURL, {
					visible: false
				});
				// 河道
				var tileHDLayer = new ArcGISDynamicMapServiceLayer(this._config.tileHDURL, {
					visible: false
				});
				// 无锡区域
				var tileWXWQLayer = new ArcGISDynamicMapServiceLayer(this._config.tileWXWQURL);
				// 圩区
				var tileWQLayer = new ArcGISDynamicMapServiceLayer(this._config.tileWQURL, {
					visible: false
				});
				// 片区
				var tilePQLayer = new ArcGISDynamicMapServiceLayer(this._config.tilePQURL, {
					visible: false
				});
				// 图层过滤器
				if(filter) {
					var layerDefinitions = [filter];
					//tileLWLayer.setLayerDefinitions(layerDefinitions);
					//tileHDLayer.setLayerDefinitions(layerDefinitions);
					//tileWQLayer.setLayerDefinitions(layerDefinitions);
					//tilePQLayer.setLayerDefinitions(layerDefinitions);
					tileWXWQLayer.setLayerDefinitions(layerDefinitions);
				}
				this._tiledLayers = [tileLWLayer, tileHDLayer, tileWQLayer, tilePQLayer,tileWXWQLayer];
				this._map.addLayer(tileBASELayer);
				this._map.addLayer(tilePQLayer);
				this._map.addLayer(tileWQLayer);
				this._map.addLayer(tileHDLayer);
				this._map.addLayer(tileLWLayer);
				this._map.addLayer(tileWXWQLayer);
				 
				// 回调
				if(callback && typeof(callback) === 'function') {
					callback();
				}
			},
			setTiledLayerVisible: function(i, visible) { 
				var layer = this._tiledLayers[i];
				layer.setVisibility(visible);
			},
			/**
			 * 获取瓦片图层显示状态
			 */
			getTiledLayerVisible: function(i) {
				return this._tiledLayers[i].visible;
			},
			/**
			 * 添加行政分区矢量图层
			 * @param items
			 */
			loadWQLayer: function(items) {
				items.forEach(function(item) {
					var geometry = new Polygon(item.geometry);
					var attributes = item.attributes;
					var symbol = new SimpleFillSymbol('solid', null, new Color([255, 255, 255, 0]));
					var graphic = new Graphic(geometry, symbol, attributes);
					this._vectors[0].add(graphic);
				}, this);
			},
			/**
			 * 获取圩区面坐标
			 */
			getWQGraphic: function() {
				return this._vectors[0].graphics;
			},
			/**
			 * 加载矢量图层
			 */
			loadVectorLayers: function() {
				var graphicLayer = new GraphicsLayer({
					opacity: 0
				});
				var xzqhLayer = new GraphicsLayer();
				var vectorLayer = new GraphicsLayer();
				this._map.addLayer(graphicLayer);
				this._map.addLayer(xzqhLayer);
				this._map.addLayer(vectorLayer);
				this._vectors = [graphicLayer, xzqhLayer, vectorLayer];
			},
			/**
			 * 加载几个行政区划图标
			 */
			loadXZQHGraphic: function(type) {
				var fs = [{
					point: [120.108140, 31.765233],
					name: '横山桥镇',
					type: 'xzqh',
					desc: '58.23平方公里，19个行政村，4个社区',
					czrk: 9.89,
					gdp: 160.58,
					qygs: 2600,
					qycz: 356.26,
					zyss: 37,
					fhbz: 100,
					fhnl: 69
				}, {
					point: [120.024369, 31.742573],
					name: '丁堰街道',
					type: 'xzqh',
					desc: '10.14平方公里，4个行政村，1个社区',
					czrk: 2.48,
					gdp: 48.75,
					qygs: 1020,
					qycz: 135.91,
					zyss: 17,
					fhbz: 100,
					fhnl: 39
				}, {
					point: [120.056084, 31.721888],
					name: '戚墅堰街道',
					type: 'xzqh',
					desc: '4.77平方公里，3个行政村，1个社区',
					czrk: 4.37,
					gdp: 9.73,
					qygs: 930,
					qycz: 102.96,
					zyss: 15,
					fhbz: 100,
					fhnl: 30
				}, {
					point: [120.095566, 31.699915],
					name: '横林镇',
					type: 'xzqh',
					desc: '46.7平方公里，15个行政村，6个社区',
					czrk: 10.26,
					gdp: 155.03,
					qygs: 2500,
					qycz: 277.49,
					zyss: 35,
					fhbz: 100,
					fhnl: 74
				}, {
					point: [120.028789, 31.702233],
					name: '遥观镇',
					type: 'xzqh',
					desc: '44.7平方公里，15个行政村，7个社区',
					czrk: 4.67,
					gdp: 163.34,
					qygs: 2200,
					qycz: 397.97,
					zyss: 32,
					fhbz: 100,
					fhnl: 63
				}, {
					point: [120.038870, 31.763177],
					name: '潞城街道',
					type: 'xzqh',
					desc: '16.77平方公里，5个行政村，1个社区',
					czrk: 3.75,
					gdp: 64.66,
					qygs: 1800,
					qycz: 149.94,
					zyss: 19,
					fhbz: 100,
					fhnl: 46
				}];
				var symbol = new PictureMarkerSymbol({
					url: 'images/xzqh/xz.png',
					width: 14,
					height: 14
				});
				var wqGraphic = this.getWQGraphic();
				var sr = new SpatialReference(4214);
				fs.forEach(function(f) {
					var geometry = new Point(f.point[0], f.point[1], sr);
					if(wqGraphic.length === 1) {
						if(!wqGraphic[0].geometry.contains(geometry)) {
							return;
						}
					}
					if(type) {
						if(f.name !== type) {
							return;
						}
					}
					var attribute = {
						name: f.name,
						type: f.type,
						desc: f.desc,
						czrk: f.czrk + '万人',
						gdp: f.gdp + '亿元',
						qygs: f.qygs + '家',
						qycz: f.qycz + '亿元',
						zyss: f.zyss + '个',
						fhbz: f.fhbz + '年一遇',
						fhnl: f.fhnl + '台泵'
					};
					var graphic = new Graphic(geometry, symbol, attribute);
					this._vectors[1].add(graphic);
					var text = attribute.name;
					new MapText(this._map, geometry, null, text, 1, "bottom", "xzqhText", 8);
				}, this);
			},
			/**
			 * 往矢量图层中添加 graphic
			 * @param graphic_opts
			 */
			addGraphicsToVector: function(graphic_opts) {
				// 在片区中过滤
				var wqGraphic = this.getWQGraphic();
				graphic_opts.forEach(function(graphic_opt) {
					var g = graphic_opt.geometry;
					var geometry = new Point(g.x, g.y, new SpatialReference(g.sr));
					if(wqGraphic.length === 1) {
						if(!wqGraphic[0].geometry.contains(geometry)) {
							return;
						}
					}
					var s = graphic_opt.symbol;
					var symbol = new PictureMarkerSymbol({
						url: s.url,
						width: s.width,
						height: s.height
					});
					var graphic = new Graphic(geometry, symbol, graphic_opt.attributes);
					this._vectors[2].add(graphic);
					var text = graphic_opt.text;
					var mapText = new MapText(this._map, geometry, null, text.text, text.zoom, "bottom", text.class, 6);
					this._mapTexts.push(mapText);
				}, this);
			},
			/**
			 * 清除矢量图层中的graphics
			 */
			clearGraphicsFromVector: function() {
				this._vectors[2].clear();
			},
			/**
			 * 清除地图中的mapText控件
			 */
			clearMapTextFromMap: function() {
				this._mapTexts.forEach(function(mt) {
					mt.clear();
				});
				this._mapTexts = [];
			},
			/**
			 * 注册地图事件
			 */
			onEvent: function(type, callback) {
				this._map.on(type, callback);
			},
			/**
			 * 显示具体面板信息
			 * @param graphic
			 */
			showInfo: function(graphic) {
				if(graphic === this._tooltip.graphic) {
					return;
				}
				var attributes = graphic.attributes;
				if(this._tooltip.element) {
					this._tooltip.element.clear();
				}
				this._tooltip.graphic = graphic;
				var pixel = this._map.toScreen(graphic.geometry);
				var type = attributes.type;
				var keys, names, title = attributes.name;
				if(type === 'xzqh') {
					keys = 'desc,czrk,gdp,qygs,qycz,zyss,fhbz,fhnl';
					names = '总面积,常住人口,GDP产值,企业个数,企业产值,重要设施,防洪标准,防洪能力';
				} else if(type === 'water') {
					keys = 'value,super,wrz,grz';
					names = '水位,超警水位,警戒水位,保证水位';
				} else if(type === 'rain') {
					keys = 'value';
					names = '降雨量';
				} else if(type === 'work') {
					keys = 'value,voltage,sum,height';
					names = '流量,电压,开启孔数,开启高度';
				} else if(type === 'broad') {
					keys = 'text,water,rain,work';
					names = '预警,水位,雨量,流量';
				} else if(type === 'weather') {
					keys = 'ssqw,zdqw,zgqw,ssjy,jy,fl,fx';
					names = '实时气温,最低气温,最高气温,实时降雨量,预报降雨量,风力,风向';
				} else if(type === 'schedule') {
					keys = 'kz,kb,qq';
					names = '开闸,开泵,流量';
				}
				this._tooltip.element = new MapTip(this._map, graphic, pixel, title, keys, names);
			},
			/**
			 * 隐藏具体面板信息
			 */
			hideInfo: function() {
				if(this._tooltip.element) {
					this._tooltip.element.clear();
				}
				this._tooltip.graphic = null;
				this._tooltip.element = null;
			}
		});
	});