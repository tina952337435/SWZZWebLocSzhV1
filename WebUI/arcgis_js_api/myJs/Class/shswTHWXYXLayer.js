define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.TiledMapServiceLayer, {
        constructor: function (str) {
            this.id = str;
            this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(
			-328515.50593726157,
			-229456.77466613497, 
			103607.2900791639, 
			247837.5478860126, 
			this.spatialReference));

            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0.0,
                "origin": {
                    "x": -9640000.0,
                    "y": 1.0E7
                },
                "spatialReference":{
                    "wkid":'PROJCS["shanghaicity",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["false_easting",-3457147.81],PARAMETER["false_northing",0.0],PARAMETER["central_meridian",121.2751921],PARAMETER["scale_factor",1.0],PARAMETER["latitude_of_origin",0.0],UNIT["Meter",1.0]]',
                },  
				"lods": [
				{ "level": 0, "resolution":1322.9193125052918 , "scale": 5000000 },
				{ "level": 1, "resolution": 529.1677250021168, "scale": 2000000 },
				{ "level": 2, "resolution":264.5838625010584 , "scale":1000000  },
				{ "level": 3, "resolution":132.2919312505292 , "scale":500000  },
				{ "level": 4, "resolution": 52.91677250021167, "scale":200000  },
				{ "level": 5, "resolution": 26.458386250105836, "scale":100000  },
				{ "level": 6, "resolution":13.229193125052918 , "scale": 50000 },
				{ "level": 7, "resolution": 5.291677250021167, "scale":20000  },
				{ "level": 8, "resolution": 2.6458386250105836, "scale": 10000 },
				{ "level": 9, "resolution":1.3229193125052918 , "scale":5000  },
				{ "level": 10, "resolution":0.5291677250021167 , "scale":2000  },
				{ "level": 11, "resolution": 0.26458386250105836, "scale":1000  },
				{ "level": 12, "resolution":0.13229193125052918 , "scale":500  },
            ]
            });

            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {
			console.log(level);
			console.error(row);
			console.warn(col);
			var  layerUrl="http://31.16.1.101/arcgis/rest/services/shsw_THWXYX2021/MapServer/tile/" + level + "/" + row + "/" + col+"?blankTile=false";
            return layerUrl; //"http://t2.tianditu.gov.cn/ter_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ter&tileMatrixSet=c&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col +"&style=default&format=tiles&tk=cdfddb6dd546957382d0ea51a65acf19";
        }
    });
});