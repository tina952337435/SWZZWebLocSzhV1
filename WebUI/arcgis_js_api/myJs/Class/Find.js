/*
    url,查询地图服务地址,
    layerids,图层id数组,
    isRG,是否返回图形信息
    text,查找文本,
*/
define(["dojo/_base/declare",
        "esri/tasks/FindParameters", "esri/tasks/FindTask",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, FindParameters, FindTask, on, lang, Evented) {
            return declare([Evented], {
                _FindTask: null,
                _find: null,
                _isreturnGeo: true,
                _url: null,
                _layerids: null,
                _result: null,
                _eventhandler: null, //事件
                _extent: null,
                _text: null,
                _searchFields:null,
                constructor: function (url, layerids, isRG, text,fields) {
                    this._url = url;
                    this._layerids = layerids;
                    this._isreturnGeo = isRG;
                    this._text = text;
                    this._searchFields = fields;
                    this.init();
                },
                init: function () {
                    this._FindTask = new FindTask(this._url);

                    this._find = new FindParameters();
                    this._find.searchFields = this._searchFields;
                    this._find.searchText = this._text;
                    this._find.contains = true;
                    this._find.returnGeometry = this._isreturnGeo;
                    if (this._layerids) {
                        this._find.layerIds = this._layerids;
                    }
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
                    this._FindTask.execute(this._find, lang.hitch(this, this.showResults)); //需要返回的事件,需要用lang.hitch
                }
            });
        });  