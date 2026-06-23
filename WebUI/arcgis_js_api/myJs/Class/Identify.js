/*
    url,查询地图服务地址,
    layerids,图层id数组,
    geo,相交图形筛选结果,
    isRG,是否返回图形信息
*/
define(["dojo/_base/declare",
        "esri/tasks/IdentifyParameters", "esri/tasks/IdentifyTask",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, IdentifyParameters, IdentifyTask, on, lang, Evented) {
            return declare([Evented], {
                _IdentifyTask: null,
                _identify: null,
                _geometry: null,
                _isreturnGeo: true,
                _url: null,
                _layerids: null,
                _result: null,
                _eventhandler: null, //事件
                _extent:null,
                constructor: function (url, layerids, geo, isRG,ext) {
                    this._url = url;
                    this._layerids = layerids;
                    this._geometry = geo;
                    this._isreturnGeo = isRG;
                    this._extent=ext;
                    this.init();
                },
                init: function () {
                    this._IdentifyTask = new IdentifyTask(this._url);

                    this._identify = new IdentifyParameters();
                    this._identify.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                    this._identify.mapExtent = this._extent;
                    this._identify.tolerance=3;
                    if (this._geometry) {
                        this._identify.geometry = this._geometry;
                    }
                    this._identify.returnGeometry = this._isreturnGeo;
                    if (this._layerids) {
                        this._identify.layerIds = this.layerids;
                    }
                },
                showResults: function (results) {
                    var option = {
                        result: results,
                        attr: results.length.toString(),
                        token: this._geometry
                    };
                    this._eventhandler(option);
                },
                addEvent: function (a, b) {
                    this._eventhandler = b;
                    this._IdentifyTask.execute(this._identify, lang.hitch(this, this.showResults)); //需要返回的事件,需要用lang.hitch
                }
            });
        });  