/*
    url,查询地图服务地址,
    layerids,图层id数组,
    isRG,是否返回图形信息
    text,查找文本,
*/
define(["dojo/_base/declare",
        "esri/tasks/GeometryService", "esri/config", 
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, GeometryService, esriConfig, on, lang, Evented) {
            return declare([Evented], {
                _geometryService: null,
                _geometries: null,
                _geometry: null,
                constructor: function (geometries, geometry) {
                    this._geometries = geometries;
                    this._geometry = geometry;
                    this.init();
                },
                init: function () {
                    this._geometryService = esriConfig.defaults.geometryService;
                },
                showResults: function (results) {
                    var option = {
                        result: results,
                        attr: results.length.toString()
                    };
                    this._eventhandler(option);
                },
                addEvent: function (a, b) {
                    this._eventhandler = b;
                    this._geometryService.intersect(this._geometries, this._geometry, lang.hitch(this, this.showResults)); //需要返回的事件,需要用lang.hitch
                }
            });
        });  