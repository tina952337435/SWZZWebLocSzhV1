define(["dojo/_base/declare",
        "esri/geometry/Point",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/domReady!"], function (declare, Point, on, lang,Evented) {
            return declare([Evented], {
                _map:null,
                _mapPoint: null,
                constructor: function (map) {
                    
                },
                init: function () {
                    if (this._map && this._mapPoint ) {
                    }
                }
            });
        });  