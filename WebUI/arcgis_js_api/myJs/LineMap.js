var map, mapCenter;
var selected;
var lineID = "lineLayer";
var lineLayer;

function initMap(lgtd, lttd) {
	require(["esri/config", "esri/tasks/GeometryService"], function(esriConfig, GeometryService) {
		esriConfig.defaults.geometryService = new GeometryService(
			"https://sampleserver6.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
		//esriConfig.defaults.io.alwaysUseProxy = true;
	});
	require([
		"esri/map", "esri/toolbars/draw",
		"esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
		"esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol",
		"esri/graphic", "esri/layers/GraphicsLayer",
		"esri/Class/TDTLayer",
		"esri/layers/ArcGISTiledMapServiceLayer",
		"esri/Color", "dojo/dom", "dojo/on", "dojo/domReady!"
	], function(
		Map, Draw,
		SimpleMarkerSymbol, SimpleLineSymbol,
		PictureFillSymbol, CartographicLineSymbol,
		Graphic, GraphicsLayer, TDTLayer, ArcGISTiledMapServiceLayer,
		Color, dom, on
	) {
		map = new Map("myMap", {
			logo: false,
			slider: true, //放大缩小按钮
			zoom: MapZoom,
			minZoom: 1,
			maxZoom: 15,
			center: [lgtd, lttd]
		});
		map.on("load", initToolbar);
		var tdt = new TDTLayer("vec", {
			visible: false
		});
		map.addLayer(tdt);

		var url = "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_map/MapServer";
		//添加基础底图
		var basemap = new ArcGISTiledMapServiceLayer(url, {
			id: "wx",
			visible: true
		});

		map.addLayer(basemap, 0);
		lineLayer = new GraphicsLayer({
			id: lineID
		});
		map.addLayer(lineLayer);
		if(LineMap!=""&&LineMap!=null&&LineMap!=undefined){
			addLine(LineMap,lineLayer);
		}
		
		
		var markerSymbol = new SimpleMarkerSymbol();
		markerSymbol.setPath(
			"M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z"
		);
		markerSymbol.setColor(new Color("#00FFFF"));

lineLayer.on("mouse-down", function(e) {
			map.disablePan();
			selected = e.graphic;
		})

		lineLayer.on("mouse-up", function(evt) {
			var lgtd = evt.mapPoint.x;
			var lttd = evt.mapPoint.y;
			map.enablePan();
			selected = "";
			//此处可以写相关的移动标注之后相应的操作，比如保存数据库等 
		})
		//地图拖动，重新给GraphicsLayer赋值坐标位置
		lineLayer.on("mouse-drag", function(e) {
			if (selected) { 
				addGraphic(e); 
			}
		})
		
		var lineSymbol = new CartographicLineSymbol(
			CartographicLineSymbol.STYLE_SOLID,
			new Color([255, 0, 0]), 10,
			CartographicLineSymbol.CAP_ROUND,
			CartographicLineSymbol.JOIN_MITER, 5
		);

		var fillSymbol = new PictureFillSymbol(
			"images/mangrove.png",
			new SimpleLineSymbol(
				SimpleLineSymbol.STYLE_SOLID,
				new Color('#000'),
				1
			),
			42,
			42
		);

		function initToolbar() {
			tb = new Draw(map);
			tb.on("draw-complete", addGraphic);
			on(dom.byId("BtnLine"), "click", function(evt) {
				if (evt.target.id === "info") {
					return;
				}
				var tool = "polyline";
				map.disableMapNavigation();
				tb.activate(tool);
			});	
			on(dom.byId("BtnClear"), "click", function(evt) { 
				map.getLayer(lineID).clear();
			});
			 
		}

		function addGraphic(evt) {
			//deactivate the toolbar and clear existing graphics 
			tb.deactivate();
			map.enableMapNavigation();

			// figure out which symbol to use
			var symbol;
			if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
				symbol = markerSymbol;
			} else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
				symbol = lineSymbol;
			} else {
				symbol = fillSymbol;
			}
			var graphic = new Graphic(evt.geometry, symbol);

			lineLayer.add(graphic);
			try{
				var graphicsLine=lineLayer.graphics;
				var strPath="";
				if(graphicsLine.length>0){
					for(graphNum=0;graphNum<graphicsLine.length;graphNum++){
						var pathLine=lineLayer.graphics[graphNum].geometry.paths[0]; 
						if(pathLine.length>0){
							for(num=0;num<pathLine.length;num++){
								if(strPath!=""){
									strPath+=":"+Number(pathLine[num][0]).toFixed(6)+","+Number(pathLine[num][1]).toFixed(6);
								}else{
									strPath+=Number(pathLine[num][0]).toFixed(6)+","+Number(pathLine[num][1]).toFixed(6);
								}
							}
						}  
					}
				} 
				window.parent.GetGPS(strPath);
			}catch(ex){
				console.error(ex)
			}
			
		}
	});

}

function addLine(str, layer) {
    var arr = str.split(":");
    var path = new Array();
    var s;
    var ColorGRP = "#FF0000"; 
    for (var i = 0; i < arr.length; i++) {
		var NumPs = arr[i].split(","); 
        s = [Number(NumPs[0]), Number(NumPs[1])];
        path.push(s);
        if (arr[i].Color != undefined) {
            ColorGRP = arr[i].Color;
        }
    }
    require([
        "esri/geometry/Polyline",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/Color", 
        "esri/layers/GraphicsLayer", "esri/SpatialReference",
        "esri/symbols/CartographicLineSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/PictureMarkerSymbol"
    ], function (Polyline, Extent, Graphic, Color, GraphicsLayer, SpatialReference, CartographicLineSymbol, SimpleLineSymbol, PictureMarkerSymbol) {
        var taihujuXY = [path];
        var line = new Polyline({
            "paths": taihujuXY,
            "spatialReference": { "wkid": 4326 }
        }); 
        var lineSymbol = new SimpleLineSymbol("solid", new dojo.Color(ColorGRP), 5);
        var polyline = new Graphic(line, lineSymbol);
        layer.add(polyline); 
    });
} 
