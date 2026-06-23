var map, gl, cycleMap3;
require(["esri/config", "esri/tasks/GeometryService"], function (esriConfig, GeometryService) {
    esriConfig.defaults.geometryService = new GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
    //esriConfig.defaults.io.alwaysUseProxy = true;
});
require([
        "esri/map",
	    "esri/geometry/Extent",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/WebTiledLayer",
        "esri/layers/GraphicsLayer",
        "esri/graphic",
        "myJs/MapText",
        "esri/geometry/webMercatorUtils",
        "esri/geometry/Point", "esri/SpatialReference",
        "esri/dijit/Measurement", "dojo/dom", "esri/units", "myJs/TDTMercatorLayer",
        "dojo/domReady!"
      ], function (Map, Extent, ArcGISTiledMapServiceLayer, WebTiledLayer, GraphicsLayer, Graphic, MapText, webMercatorUtils, Point, SpatialReference, Measurement, dom, Units, TDTMercatorLayer) {
          var initExtent = new Extent({
              "xmax": 16529233.85602365, //左上角X坐标
              "xmin": 11611498.763986196, //左下角X坐标
              "ymax": 3286721.629156437, //右上角X坐标
              "ymin": 3515338.7775019596, //右下角X坐标
              "spatialReference": { //空间参考
                  "wkid": 102100
              }
          });

          map = new Map("myMap", {
              logo: false,
              slider: true, //放大缩小按钮
              //isDoubleClickZoom:false;
              zoom: 8,
              //        isScrollWheel:false,
              showLabels: true,
              center: [120.27407, 30.71000]
              // center: [120.27407, 31.90197]
          });
          //var tiledMapServiceLayer = new ArcGISTiledMapServiceLayer("http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_L3_L17/MapServer");

          //地形图
          var cycleMap = new WebTiledLayer("http://mt${subDomain}.google.cn/vt/lyrs=t@132,r@248000000&hl=zh-CN&gl=CN&src=app&x=${col}&y=${row}&z=${level}&s=Galileo", {
              "id": "OpenCycleMap0",
              "subDomains": ["0", "1", "2", "3"]
          });
          cycleMap.setVisibility(true);
          //卫星图
          var cycleMap1 = new WebTiledLayer("http://mt${subDomain}.google.cn/vt/lyrs=s@171000000&hl=zh-CN&gl=CN&src=app&x=${col}&y=${row}&z=${level}&s=Galileo", {
              "id": "OpenCycleMap1",
              "subDomains": ["0", "1", "2", "3"]
          });
          cycleMap1.setVisibility(false);
          //电子图
          var cycleMap2 = new WebTiledLayer("http://mt${subDomain}.google.cn/vt/lyrs=m@270000000&hl=zh-CN&gl=CN&src=app&x=${col}&y=${row}&z=${level}&s=Galileo", {
              "id": "OpenCycleMap2",
              "subDomains": ["0", "1", "2", "3"]
          });


          cycleMap2.setVisibility(false);


          cycleMap3 = new TDTMercatorLayer("OpenCycleMap3", "VectorBaseMap");
          cycleMap3.setVisibility(false);

          map.addLayer(cycleMap);
          map.addLayer(cycleMap1);
          map.addLayer(cycleMap2);
          map.addLayer(cycleMap3);


          gl = new GraphicsLayer({ id: "s" });
          map.addLayer(gl);

          map.on("mouse-move", Location);
          function Location(evt) {
              var mp = evt.mapPoint;
              mp = webMercatorUtils.webMercatorToGeographic(mp);
              $("#locationSpan").html(mp.x.toFixed(6) + "," + mp.y.toFixed(6));
          };
      });
      /***设置地图****/
      function setDtLayer(str) {
          for (var i = 0; i < 4; i++) {
              if (str == i.toString()) {
                  map.getLayer("OpenCycleMap" + str).setVisibility(true);
              }
              else {
                  map.getLayer("OpenCycleMap" + i.toString()).setVisibility(false);
              }
          }
      }
      function clearGraphicsLayer() {
          var layers = map.getLayersVisibleAtScale();
          for (var i = 0; i < layers.length; i++) {
              var layer = layers[i];
              if (layer.declaredClass.indexOf("GraphicsLayer")>-1) {
                  layer.clear();
              }
          }
      }
      /*
      地图首页需要引用的JS文件
      */

      function LoadJS(id, fileUrl) {
          var scriptTag = document.getElementById(id);
          var oHead = document.getElementsByTagName('head').item(0);
          var oScript = document.createElement("script");
          if (scriptTag) {
              //alert("has");
          }
          else {
              oScript.id = id;
              oScript.type = "text/javascript";
              oScript.src = fileUrl;
              oHead.appendChild(oScript);
          }
      }


      function openTL(url) {
          if (url != "" && document.getElementById("TLFrame").src != url) {
              var tl = document.getElementById("TLFrame");
              document.getElementById("TLDiv").style.display = "block";
              document.getElementById("TLFrame").contentWindow.ShowTL(url);
          }
          else {
              closeTL();
          }
      }
      function closeTL() {
          document.getElementById("TLDiv").style.display = "none";
      }
      function tlChecked() {
          getTabEl().tlChecked();
      }
      function getTabEl() {
          var tabs = mini.get("mainTabs");
          var frame = tabs.getTabIFrameEl(tabs.getActiveTab());
          var el = frame.contentWindow;
          return el;
      }
      function getTLObj(tag) {
          var el;
          if (document.getElementById("TLFrame")) {
              el = document.getElementById("TLFrame").contentWindow.document.getElementById(tag);
          }
          return el;
      }

      function getTabObj(str) {
          var tabs = mini.get("mainTabs");
          var frame = tabs.getTabIFrameEl(tabs.getActiveTab());
          var el;
          if (frame) {
              el = frame.contentWindow.document.getElementById(str);
          }
          return el;
      }
      function dyCenter(lgtd, lttd) {
          require(["myJs/DyCenter"], function (DyCenter) {
              var dy = new DyCenter(map, lgtd, lttd);
          });
      }
      function CreateLayer(str) {
          var layer;
          if (map.getLayer(str)) {
              layer = map.getLayer(str);
          }
          else {
              layer = map.addLayer(new esri.layers.GraphicsLayer({ id: str }));
          }
          return layer;
      }
      