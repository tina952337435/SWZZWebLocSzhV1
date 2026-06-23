var map, mapCenter;
var selected;
var youtian = "youtianLayer";
var _x, _y, youtianLayer;

function initMap(lgtd, lttd) {
	require(["esri/config", "esri/tasks/GeometryService"], function(esriConfig, GeometryService) {
		esriConfig.defaults.geometryService = new GeometryService(
			"https://sampleserver6.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
		//esriConfig.defaults.io.alwaysUseProxy = true;
	});
	require([
		"esri/map",
		"esri/layers/ArcGISTiledMapServiceLayer",
		"esri/layers/GraphicsLayer",
		"esri/geometry/Point",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/symbols/PictureMarkerSymbol",
		"esri/InfoTemplate",
		"esri/SpatialReference",
		"esri/graphic",
		"myJs/TDTLayer",
		"myJs/TDTImgLayer",
		"myJs/TDTNoteLayer",
		"dojo/domReady!"
	], function(Map, ArcGISTiledMapServiceLayer, GraphicsLayer, Point, SimpleMarkerSymbol, PictureMarkerSymbol,
		InfoTemplate, SpatialReference, Graphic, TDTLayer,TDTImgLayer,TDTNoteLayer) {
		map = new Map("myMap", {
			logo: false,
			slider: true, //放大缩小按钮
			zoom: 8,
			minZoom: 5,
			maxZoom: 18,
			center: [lgtd, lttd]
		});
		var tdt = new TDTLayer("vec", {
			visible: false
		});
		// var tdtnote = new TDTNoteLayer("vec_img_note", { visible: false });

		map.addLayer(tdt);
		// map.addLayer(tdtnote);

		var url = "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_map/MapServer";
		//添加基础底图
		var basemap = new ArcGISTiledMapServiceLayer(url, {
			id: "wx",
			visible: true
		});

		map.addLayer(basemap, 0);

		youtianLayer = new GraphicsLayer({
			id: youtian
		});
		map.addLayer(youtianLayer);

		var breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/marker.png", 20, 34);
		var point = new Point(lgtd, lttd, new SpatialReference({
			wkid: 4326
		}));
		var graphic = new Graphic(point, breakSymbol, null, null);
		youtianLayer.add(graphic);
 
		youtianLayer.on("mouse-down", function(e) {
			map.disablePan();
			selected = e.graphic;
		})

		youtianLayer.on("mouse-up", function(evt) {
			var lgtd = evt.mapPoint.x;
			var lttd = evt.mapPoint.y;
			window.parent.GetGPS(lgtd, lttd);
			map.enablePan();
			selected = "";
			//此处可以写相关的移动标注之后相应的操作，比如保存数据库等 
		})
		//地图拖动，重新给GraphicsLayer赋值坐标位置
		map.on("mouse-drag", function(e) {
			if (selected) {
				var lon = Math.round(e.mapPoint.getLongitude() * 1000) / 1000; //经度
				var lat = Math.round(e.mapPoint.getLatitude() * 1000) / 1000; //维度
				var pt = new Point(lon, lat, new SpatialReference({
					wkid: 4326
				})) //GPS使用的是WGS84坐标

				selected.setGeometry(pt); //给所要移动的图标从新赋值坐标
			}
		})
	});
}
 
