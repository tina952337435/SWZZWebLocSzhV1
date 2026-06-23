/*
    url,查询地图服务地址,
    where,查询where条件,
    geo,相交图形筛选结果,
    isRG,是否返回图形信息
*/
define(["dojo/_base/declare",
        "esri/tasks/query", "esri/tasks/QueryTask",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, Query, QueryTask, on, lang, Evented) {
            return declare([Evented], {
                _queryTask: null,
                _query: null,
                _geometry: null,
                _isreturnGeo: true,
                _url: null,
                _where: null,
                _result: null,
                _eventhandler: null, //事件
                constructor: function (url, where, geo, isRG) {
                    this._url = url;
                    this._where = where;
                    this._geometry = geo;
                    this._isreturnGeo = isRG;
                    this.init();
                },
                init: function () {
                    this._queryTask = new QueryTask(this._url);
                    this._query = new Query();
                    if (this._geometry) {
                        this._query.geometry = this._geometry;
                        this._query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                    }
                    this._query.returnGeometry = this._isreturnGeo;
                    this._query.outFields = ["*"];
                    this._query.where = this._where;
                },
                showResults: function (results) {
                    var option = {
                        result: results,
                        attr: results.features.length.toString()
                    };
                    this._eventhandler(option);
                },
                addEvent: function (a, b) {
                    this._eventhandler = b;
                    this._queryTask.execute(this._query, lang.hitch(this, this.showResults)); //需要返回的事件,需要用lang.hitch
                },
                result: function () {
                    return this._result;
                }
            });
        });  