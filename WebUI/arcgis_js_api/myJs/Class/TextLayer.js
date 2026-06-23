define(["dojo/_base/declare",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/dom",
        "dojo/dom-style",
        "dojo/dom-construct",
        "esri/domUtils",
        "dojo/domReady!"], function (declare, on, lang, Evented, dom, domStyle, domConstruct, domUtils) {
            return declare([Evented], {
                _map: null,
                _id: null,
                constructor: function (map, id) {
                    this._map = map;
                    this._id = id;
                    this.init();
                },
                init: function () {
                    if (this._map) {
                        var node = domConstruct.toDom("<div id=" + this._id + "></div>");
                        domStyle.set(node, {
                            width: map.width + "px",
                            height: map.height + "px",
                            left: "0px",
                            top: "0px",
                            background:"red",
                            position: "absolute",
                            zIndex: "1"
                        });
                        var ss = this._map.root;
                        ss.appendChild(node);
                    }
                }
            });
        });  