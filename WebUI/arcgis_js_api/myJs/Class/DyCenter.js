define(["dojo/_base/declare",
        "esri/geometry/Point",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol", "esri/Color",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, Point, Graphic, GraphicsLayer, PictureMarkerSymbol, SimpleMarkerSymbol, Color, on, lang, Evented) {
            return declare([Evented], {
                _map: null,
                _mapPoint: null,
                _dyLayer: null,
                _time: null,
                constructor: function (map, lgtd, lttd) {
                    this._map = map;
                    var wkid = 102100;
                    //if (Math.abs(Number(lgtd)) < 180) {
                        wkid = 4326;
                    //}
                    this._mapPoint = new Point({ "x": lgtd, "y": lttd, "spatialReference": { "wkid": wkid} });
                    if (map.getLayer("dyLayer")) {
                        this._dyLayer = map.getLayer("dyLayer");
                        //alert("122");
                    }
                    else {
                        this._dyLayer = new GraphicsLayer({ id: "dyLayer" });
                        map.addLayer(this._dyLayer);
                    }
                    this.init();
                },
                init: function () {
                    if (this._map && this._mapPoint) {
                        this._dyCenter();
                    }
                },
                _dyCenter: function () {
                    this._dyLayer.clear();
                    clearTimeout(this._time);

                    var symbol = new PictureMarkerSymbol("arcgis_js_api/myJs/images/dyCenter.gif", 64, 64);
                    var sms = new SimpleMarkerSymbol().setStyle(
                    SimpleMarkerSymbol.STYLE_CIRCLE).setColor(
                    new Color([255, 0, 0, 0.5])).setSize("50");

                    //map.zoom = 12;
                    //var point = new Point({ "x": lgtd, "y": lttd, "spatialReference": { "wkid": 4326} });
                    var graphic = new Graphic(this._mapPoint, symbol, null, null);

                    this._dyLayer.add(graphic);
                    var layer=this._dyLayer;
                    map.centerAt(this._mapPoint);
                    this._time = setTimeout(function clear() {
                        layer.clear();
                    }, 1500); //1000为1秒钟
                }
            });
        });  