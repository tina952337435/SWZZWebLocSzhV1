/***
    map:地图;
    layer:图层;
    str:坐标字符串(x,y|x1,y1);
    color:颜色;
    size:大小
***/
define(["dojo/_base/declare",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/symbols/CartographicLineSymbol",
        "esri/Graphic",
        "esri/Color",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, Point, Polyline, CartographicLineSymbol, Graphic, Color, on, lang, Evented) {
            return declare([Evented], {
                _map: null,
                _mapPoint: null,
                _layer: null,
                _lineStr: null,
                _color: null,
                _size: null,
                constructor: function (map, layer, str, color, size) {
                    this._map = map;
                    this._layer = layer;
                    this._lineStr = str;
                },
                init: function () {
                    if (this._layer && this._lineStr) {
                        this.drawLine();
                    }
                },
                drawLine: function () {
                    var arr = this._lineStr.split("|");
                    var path = new Array();
                    for (var i = 0; i < arr.length; i++) {
                        var p = arr[i].split(",");
                        var s = [Number(p[0]), Number(p[1])];
                        path.push(s);
                    }
                    var line = new esri.geometry.Polyline({
                        "paths": [path],
                        "spatialReference": { "wkid": 4326 }
                    });
                    var lineSymbol = new CartographicLineSymbol(
                        CartographicLineSymbol.STYLE_SOLID,
                        new Color(this._color), this._size,
                        CartographicLineSymbol.CAP_ROUND,
                        CartographicLineSymbol.JOIN_MITER, this._size);
                    var polyline = new Graphic(line, lineSymbol);
                    this._layer.add(polyline);
                }
            });
        });  