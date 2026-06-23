/***
DrawTool
ARROW	Draws an arrow.
CIRCLE	Draws a circle.
DOWN_ARROW	Draws an arrow that points down.
ELLIPSE	Draws an ellipse.
EXTENT	Draws an extent box.
FREEHAND_POLYGON	Draws a freehand polygon.
FREEHAND_POLYLINE	Draws a freehand polyline.
LEFT_ARROW	Draws an arrow that points left.
LINE	Draws a line.
MULTI_POINT	Draws a Multipoint.
POINT	Draws a point.
POLYGON	Draws a polygon.
POLYLINE	Draws a polyline.
RECTANGLE	Draws a rectangle.
RIGHT_ARROW	Draws an arrow that points right.
TRIANGLE	Draws a triangle.
UP_ARROW
***/
var drawtool, symbol;
function initDrawTool() {
    require(["esri/map",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "dojo/domReady!"
      ], function (Map, Draw, Graphic,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) {
          drawtool = new Draw(map);
          //drawtool.on("draw-end", addToMap);
      });
}
function activateTool(str) {
    if (drawtool == null) {
        initDrawTool();
    }
    require([
        "esri/toolbars/draw","dojo/domReady!"
      ], function (Draw) {
          var tool = str.toUpperCase().replace(/ /g, "_");
          drawtool.activate(Draw[tool]);
          map.hideZoomSlider();
      });
}

function addToMap(evt) {
    require(["esri/map",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol", "esri/Color", "dojo/domReady!"
      ], function (Map, Draw, Graphic,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color) {
          drawtool.deactivate();
          map.showZoomSlider();
          switch (evt.geometry.type) {
              case "point":
              case "multipoint":
                  symbol = new SimpleMarkerSymbol();
                  break;
              case "polyline":
                  symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 3);
                  break;
              default:
                  symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([255, 0, 0]), 2), new Color([0, 0, 0, 0.5]));
                  break;
          }
          var graphic = new Graphic(evt.geometry, symbol);
          map.graphics.add(graphic);
      });
}
/***DrawTool***/

/****EditTool*****/
function initEditTool(editlayer) {
    require([
        "esri/map",
        "esri/toolbars/edit",
        "esri/graphic",

        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",

        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/TextSymbol",
        "esri/Color",
        "dojo/_base/event",
        "dojo/domReady!"
      ], function (
        Map, Edit, Graphic,
        Point, Polyline, Polygon,
        SimpleLineSymbol, SimpleFillSymbol, TextSymbol,Color,
        event) {
          var editToolbar = new Edit(map);
          
          editToolbar.on("graphic-move-start", function (evt) {
              if (evt.graphic.geometry.type == "point") {
                  if (measurelabel) {
                      measurelabel.clear();
                  }
              }
          });
          editToolbar.on("graphic-move-stop", function (evt) {
              if (evt.graphic.geometry.type == "point") {
                  //moveLabel(evt.graphic.geometry);
                  var mp = evt.graphic.geometry;
                  movex = mp.x;
                  movey = mp.y; 
                  changePoint(movex, movey);
              }
          });
          var onlayerMouseOver = editlayer.on("mouse-over", function (evt) {
              //map.isPan = false; 
              activateToolbar(evt.graphic);
              onlayerMouseOver.remove();
          });
          editlayer.on("mouse-down", function (evt) {
              editToolbar.deactivate();
              activateToolbar(evt.graphic);
          });

          map.on("click", function (evt) {
              if (editToolbar) {
                  //editToolbar.deactivate();
              }
          });

          function activateToolbar(graphic) {
              var tool = Edit.MOVE | Edit.EDIT_VERTICES | Edit.SCALE | Edit.ROTATE;

              // enable text editing if a graphic uses a text symbol
              //if (graphic.symbol.declaredClass === "esri.symbol.TextSymbol") {
              //   tool = tool | Edit.EDIT_TEXT;
              //}
              //specify toolbar options   
              
              var options = {
                  allowAddVertices: true,
                  allowDeleteVertices: true,
                  uniformScaling: true
              };
              editToolbar.activate(tool, graphic, options);
          }
      });
}
/****EditTool*****/


/***MeasureTool***/
var measurement=null, measurelabel=null;
function initMeasure(str) {
    require([
        "esri/map",
        "esri/layers/GraphicsLayer",
        "esri/graphic",
        "myJs/MapText", "myJs/InfoText", "esri/units",
        "esri/dijit/Measurement", "dojo/dom",
        "dojo/domReady!"
      ], function (Map, GraphicsLayer, Graphic, MapText, InfoText, Units, Measurement, dom) {
          measurement = new Measurement({
              map: map,
              defaultAreaUnit: Units.SQUARE_KILOMETERS,
              defaultLengthUnit: Units.KILOMETERS
          }, null);
          measurement.startup();
          measurement.setTool(str, true); // "area", "distance" or "location".
          measurement.on("measure-end", MeasureEnd);
          measurement.on("measure-start", MeasureStart);
          function MeasureStart(evt) {
              if (measurelabel) {
                  measurelabel.clear();
              }
          }
          function MeasureEnd(evt) {
              var paths, index, text;
              if (evt.toolName == "distance") {
                  paths = evt.geometry._path;
                  index = evt.geometry.paths[paths].length - 1;
                  text = "距离:";
              }
              if (evt.toolName == "area") {
                  paths = evt.geometry._ring;
                  index = evt.geometry.rings[paths].length - 1;
                  text = "面积:";
              }
              var mappoint = evt.geometry.getPoint(paths, index);
              text += evt.values.toFixed(2) + "  " + evt.unitName;
              text = text.replace("平方千米", "km²").replace("千米", "km");
              measurelabel = new InfoText(map, mappoint, null, text, 0, "bottom-right", true);
              measurelabel.addEvent("click", clearInfoText);
          }
          function clearInfoText() {
              setMeasureTool("clear");
          }
      });
}
function setMeasureTool(str) {
    if (measurement == null) {
        initMeasure(str);
    }
    if (str == "clear") {
        measurement.clearResult();
        if (measurelabel!=null) {
            measurelabel.clear();
            measurelabel = null;
            measurement.setTool("distance", false);
            measurement.setTool("area", false);
        }
    }
    else {
        if (measurelabel!=null) {
            measurelabel.clear();
            measurelabel = null;
        }
        if (measurement != null) {
            measurement.clearResult();
            measurement.setTool(str, true);
        }
    }
}
var movex, movey, addLocateClick;
function addLocate() {
    addLocateClick=map.on("click", addLocation);
}
function addLocation(evt) { 
	gl.clear();
	require(["esri/map",
            "esri/toolbars/draw",
            "esri/graphic",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/PictureMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleFillSymbol", "esri/Color", "dojo/domReady!"
            ], function (Map, Draw, Graphic,
    SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color) {
                var mp = evt.mapPoint;
                movex = mp.x;
                movey = mp.y;
                changePoint(movex,movey);
                var symbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/marker.png", 20, 34);
                symbol.yoffset = 16;
                var graphic = new Graphic(evt.mapPoint, symbol);
                gl.add(graphic);
            });
}
function addMarkLoc(x,y) {
    gl.clear();
    require(["esri/map", "esri/geometry/Point", "esri/SpatialReference",
            "esri/toolbars/draw",
            "esri/graphic",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/PictureMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleFillSymbol", "esri/Color", "dojo/domReady!"
            ], function (Map, Point, SpatialReference, Draw, Graphic,
    SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color) {
                var mp = new Point(x, y, new SpatialReference({ wkid: 4326 }));
                movex = x;
                movey = y;
                changePoint(movex, movey);
                var symbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/marker.png", 20, 34);
                symbol.yoffset = 16;
                var graphic = new Graphic(mp, symbol);
                map.setLevel(15);
                map.centerAt(mp);
                gl.add(graphic);
            });
        }
/*************地图打印***************/
function initPrint(map,type) {
    require([
          "esri/map", "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate",
        ], function (Map, PrintTask, PrintParameters, PrintTemplate) {
            esriConfig.defaults.io.proxyUrl = "http://" + window.location.host.split(":")[0]+":8000/proxy/proxy.ashx";
            var url = GisIp + "/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
            var template = new PrintTemplate();
            template.exportOptions = {
                width: map.width,
                height: map.height,
                dpi: 96
            };
            if (type == "0") {
                template.format = "PNG32";
            }
            else {
                template.format = "PDF";
            }
            var printTask = new PrintTask(url);

            var params = new PrintParameters();
            params.map = map;
            params.template = template;

            printTask.execute(params, printResult);
        });
      function printResult(result) {
          //alert(result.url);
          window.open(result.url);
      }
}
/****************************/
