define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.TiledMapServiceLayer, {
        constructor: function (str) {
            this.id = str;
            this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(106.19840661411284,22.72534254352711, 132.3724776782459, 39.41964096043237, this.spatialReference));

            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0.0,
                "origin": {
                    "x": -180,
                    "y": 90
                },
                "spatialReference": {
                    "wkid": 4490
                },
                "lods": [
				{ "level": 0, "resolution": 0.703125, "scale":2.958287637958547E8  },
				{ "level": 1, "resolution": 0.3515625 , "scale": 1.4791438189792734E8 },
               { "level": 2, "resolution": 0.17578125, "scale": 7.395719094896367E7},
               { "level": 3, "resolution": 0.087890625, "scale":  3.6978595474481836E7},
              { "level": 4, "resolution": 0.0439453125, "scale": 1.8489297737240918E7 },
              { "level": 5, "resolution":0.02197265625 , "scale": 9244648.868620459 },
              { "level": 6, "resolution":0.010986328125 , "scale":4622324.4343102295  },
              { "level": 7, "resolution": 0.0054931640625, "scale": 2311162.2171551147 },
              { "level": 8, "resolution": 0.00274658203125, "scale":1155581.1085775574 },
              { "level": 9, "resolution": 0.001373291015625, "scale": 577790.5542887787 },
              { "level": 10, "resolution":6.866455078125E-4 , "scale":  288895.27714438934 },
              { "level": 11, "resolution": 3.4332275390625E-4, "scale":  144447.63857219467 },
              { "level": 12, "resolution": 1.71661376953125E-4, "scale":72223.81928609734 },
              { "level": 13, "resolution": 8.58306884765625E-5, "scale": 36111.90964304867},
              { "level": 14, "resolution":4.291534423828125E-5, "scale": 18055.954821524334 },
              { "level": 15, "resolution": 2.1457672119140625E-5, "scale":9027.977410762167  },
              { "level": 16, "resolution":1.0728836059570312E-5, "scale":4513.9887053810835  },
              { "level": 17, "resolution":5.364418029785156E-6 , "scale": 2256.9943526905417 },
              { "level": 18, "resolution":2.682209014892578E-6 , "scale": 1128.4971763452709 },
              { "level": 19, "resolution": 1.341104507446289E-6, "scale": 564.2485881726354 }
            ]
            });

            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {
			var  layerUrl="http://31.16.1.101/arcgis/rest/services/shsw_JCDXT2020_2000/MapServer/tile/" + level + "/" + row + "/" + col+"?blankTile=false";
            return layerUrl; //"http://t2.tianditu.gov.cn/ter_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ter&tileMatrixSet=c&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col +"&style=default&format=tiles&tk=cdfddb6dd546957382d0ea51a65acf19";
        }
    });
});