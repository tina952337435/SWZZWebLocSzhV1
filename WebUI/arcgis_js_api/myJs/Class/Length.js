/*
    url,查询地图服务地址,
    layerids,图层id数组,
    isRG,是否返回图形信息
    text,查找文本,
*/
define(["dojo/_base/declare",
        "esri/tasks/LengthsParameters", "esri/tasks/GeometryService", "esri/config",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, LengthsParameters, GeometryService, esriConfig, on, lang, Evented) {
            return declare([Evented], {
                _geometryService: null,
                _find: null,
                _polylines: null,
                _lengthParams: null,
                constructor: function (polylines) {
                    this._polylines = polylines;
                    this.init();
                },
                init: function () {
                    this._lengthParams = new LengthsParameters();
                    this._geometryService = esriConfig.defaults.geometryService;
                    this._lengthParams.polylines = this._polylines;
                    this._lengthParams.lengthUnit = GeometryService.UNIT_KILOMETER;
                    this._lengthParams.geodesic = true;
                },
                showResults: function (results) {
                    var lengths = results.lengths;
                    var allLen=0;
                    for (var i = 0; i < lengths.length; i++)
                    {
                        allLen += Number(lengths[i]);
                    }
                    var option = {
                        result: results,
                        total: allLen.toFixed(2)
                    };
                    this._eventhandler(option);
                },
                addEvent: function (a, b) {
                    this._eventhandler = b;
                    this._geometryService.lengths(this._lengthParams, lang.hitch(this, this.showResults)); //需要返回的事件,需要用lang.hitch
                }
            });
        });  