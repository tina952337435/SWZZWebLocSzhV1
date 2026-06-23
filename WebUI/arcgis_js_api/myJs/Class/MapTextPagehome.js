/***********
通用的labelsymbol
参数:map:地图对象,graphic:要素类对象,mappoint:标点位置,visiblelevel:显示的最小层级>visiblelevel显示,text:显示文本,className:标注样式名
***********/
define(["dojo/_base/declare",
    "esri/graphic",
    "esri/geometry/Geometry",
    "esri/geometry/Point",
    "esri/geometry/Extent",
    "dojo/on",
    "dojo/_base/lang",
    "esri/Evented",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "esri/domUtils",
    "esri/geometry/screenUtils",
    "dojo/domReady!"], function (declare, Graphic, Geometry, Point, Extent, on, lang, Evented, dom, domStyle, domConstruct, domUtils, screenUtils) {
        return declare([Evented], {
            _isShow: true,
            _text: null,
            _node: null,
            _map: null,
            _attr: null,
            _mapPoint: null,
            _layer: null,
            _class: null,
            _width: null,
            _height: null,
            _offsetX: null,
            _offsetY: null,
            _offset: 12,
            _eventhandler: null, //事件
            _place: "top",
            _level: 11,
            constructor: function (map, mappoint, attr, text, visiblelevel, place, className, offset) {
                this._map = map;
                this._text = text;
                this._attr = attr;
                this._mapPoint = mappoint;
                this._text = text;
                this._offset = offset;
                if (visiblelevel) {
                    this._level = visiblelevel;
                }
                this.clear();
                this._class = className;
                if (place != "" && place != null) {
                    this._place = place;
                }
                if (!className) {
                    this._class = "TextDiv";
                }
                this._offset = this._class == "TextDiv" ? 12 : offset;
                if (text.toString().indexOf("</") > -1) {
                    //this._node = text;
                    this._node = domConstruct.toDom("<div class='MapTextNew marker" + place + this._class + "'><span>" + text + "</span><div class='TextTri'></div></div>");
                }
                else {
                    text = text.replace(/\n/g, "<br/>");
                    var re = new RegExp("@/", "g");
                    text = text.replace(re, "/");
                    var tempClass = this._class;

                    var STNM = text.split("@")[0];
                    var DATA = text.split("@")[1];
                    var markerContent = "";
                    if (tempClass.indexOf("@") > -1) {
                        if (this._place.lastIndexOf("left") > -1) {
                            markerContent += "<div class='amap-ui-district-cluster-marker marker" + this._place + " MapTextNew none " + tempClass.replace("@", "") + "'>";
                            if (DATA != "" && DATA != undefined && DATA != null) {
                                markerContent += " <div class='amap-ui-district-cluster-marker-body'>" + DATA + "</div>";
                            }
                            markerContent += " <div class='amap-ui-district-cluster-marker-title'>" + STNM + "</div>";
                            markerContent += "</div>";
                        } else {
                            markerContent = "<div class='amap-ui-district-cluster-marker marker" + this._place + " MapTextNew none " + tempClass.replace("@", "") + "'>" +
                                " <div class='amap-ui-district-cluster-marker-title'>" + STNM + "</div>";
                            if (DATA != "" && DATA != undefined && DATA != null) {
                                markerContent += " <div class='amap-ui-district-cluster-marker-body'>" + DATA + "</div>";
                            }
                            markerContent += "</div>";
                        }

                        //this._node = domConstruct.toDom(markerContent);
                    } else {
                        if (this._place.lastIndexOf("left") > -1) {

                            markerContent += "<div class='amap-ui-district-cluster-marker marker" + this._place + " MapTextNew " + tempClass + "'>";
                            if (DATA != "" && DATA != undefined && DATA != null) {
                                markerContent += " <div class='amap-ui-district-cluster-marker-body'>" + DATA + "</div>";
                            }
                            markerContent += " <div class='amap-ui-district-cluster-marker-title'>" + STNM + "</div>";
                            markerContent += "</div>";
                        } else {
                            markerContent = "<div class='amap-ui-district-cluster-marker marker" + this._place + " MapTextNew " + tempClass + "'>" +
                                " <div class='amap-ui-district-cluster-marker-title'>" + STNM + "</div>";
                            if (DATA != "" && DATA != undefined && DATA != null) {
                                markerContent += " <div class='amap-ui-district-cluster-marker-body'>" + DATA + "</div>";
                            }
                            markerContent += "</div>";
                        }


                    }
                    this._node = domConstruct.toDom(markerContent);

                    //if (tempClass.indexOf("@") > -1) {
                    //    this._node = domConstruct.toDom("<div class='MapTextNew none " + place + this._class.replace("@", "") + " '><span>" + text + "</span><div class='TextTri'></div></div>");
                    //} else {
                    //    this._node = domConstruct.toDom("<div class='MapTextNew " + place + this._class + "'><span>" + text + "</span><div class='TextTri'></div></div>");
                    //}
                    //this._node = domConstruct.toDom("<div class='MapTextNew "+this._class+"'><span>" + text + "</span><div class='TextTri'></div></div>");
                }
                this.init();
            },
            init: function () {
                if (this._map && this._mapPoint) {
                    this.drawText();
                    this._onEvent();
                }
            },
            _onEvent: function () {
                on(this._map, "pan", lang.hitch(this, this._panEvent));
                on(this._map, "zoom-start", lang.hitch(this, this._zoomStartEvent));
                on(this._map, "zoom-end", lang.hitch(this, this._zoomEvent));
                //on(this._map, "zoom", lang.hitch(this, this._zoomEvent));
            },
            _panEvent: function (e) {
                this.panchangeText(e);
            },
            _zoomStartEvent: function (e) {
                this._hide();
            },
            _zoomEvent: function (e) {
                this.zoomchangeText(e);
                if (this._map.getLevel() >= this._level) {
                    this._show();
                }
                else {
                    this._hide();
                }
            },
            hide: function () {
                this._isShow = false;
                this._hide();
            },
            _hide: function () {
                domUtils.hide(this._node);
            },
            show: function () {
                this._isShow = true;
                if (this._map.getLevel() >= this._level) {
                    this._show();
                }
            },
            _show: function () {
                if (this._isShow) {
                    domUtils.show(this._node);
                }
            },
            getScreentPoint: function () {
                var screenPoint;
                if (this._mapPoint) {
                    screenPoint = screenUtils.toScreenPoint(this._map.extent,
                        this._map.width,
                        this._map.height,
                        this._mapPoint);
                }
                //screenPoint = this._mapPoint;
                return screenPoint;
            },
            drawText: function () {
                var ss = this._map.root; //this._layer.container;//dom.byId(this._gl.id);
                ss.appendChild(this._node);

                var xy = this.getScreentPoint();
                this._width = this._node.offsetWidth;
                this._height = this._node.offsetHeight;
                this.setOffset();
                try {
                    domStyle.set(this._node, {
                        left: xy.x + this._offsetX + "px",
                        top: xy.y + this._offsetY + "px",
                        position: "absolute",
                        zIndex: "1"
                    });
                } catch (ex) {

                }

                if (this._map.getLevel() < this._level) {
                    this._hide();
                }
            },
            setOffset: function () {
                if (this._place == "top") {
                    this._offsetX = 0 - 20;
                    this._offsetY = 0 - this._height - this._offset-12;
                }
                else if (this._place == "bottom") {
                    this._offsetX = 0 - 20;
                    this._offsetY = this._offset;
                }
                else if (this._place == "left") {
                    if (this._width == undefined) {
                        this._width = 11;
                        this._height = this._offset * 2;
                    }
                    this._offsetX = 0 - this._width - this._offset;
                    this._offsetY = 0 - this._height / 2;
                }
                else if (this._place == "right") {
                    this._offsetX = this._offset;
                    this._offsetY = 0 - this._height / 2;
                }
                else if (this._place == "top_left") {
                    this._offsetX = 0 - this._width - this._offset;
                    this._offsetY = 0 - this._height - this._offset;
                }
                else if (this._place == "top_right") {
                    this._offsetX = this._offset;
                    this._offsetY = 0 - this._height - this._offset;
                }
                else if (this._place == "bottom_left") {
                    this._offsetX = 0 - this._width - this._offset;
                    this._offsetY = this._offset;
                }
                else if (this._place == "bottom_right") {
                    this._offsetX = this._offset;
                    this._offsetY = this._offset;
                }
            },
            panchangeText: function (e) {
                var dx = e.delta.x;
                var dy = e.delta.y;
                var dd = this.getScreentPoint();
                domStyle.set(this._node, {
                    left: dd.x + dx + this._offsetX + "px",
                    top: dd.y + dy + this._offsetY + "px"
                    //left: dd.x + dx - 11 + "px",
                    //top: dd.y + dy - (this._offsetY + 24) + "px",
                });
            },
            zoomchangeText: function (e) {
                var dx = e.anchor.x;
                var dy = e.anchor.y;
                var dd = this.getScreentPoint();
                domStyle.set(this._node, {
                    //left: dd.x - 11 + "px",
                    //top: dd.y - (this._offsetY + 24) + "px",
                    left: dd.x + this._offsetX + "px",
                    top: dd.y + this._offsetY + "px"
                });
            },
            clear: function () {
                domConstruct.destroy(this._node);
            },
            addEvent: function (a, b) {
                this._eventhandler = b;
                on(this._node, a, lang.hitch(this, this.EventHandler));
            },
            EventHandler: function (e) {
                var option = {
                    mapPoint: this._mapPoint,
                    attr: this._attr
                };
                this._eventhandler(option);
            },
            startup: function () { }
        });
    });  