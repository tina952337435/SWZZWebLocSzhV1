define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.TiledMapServiceLayer, {
        _layerId: "",
        constructor: function (id, type) {
            this.id = id;
            this.spatialReference = new esri.SpatialReference({ wkid: 3857 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892, this.spatialReference));
            _layerId = id;
            //if (type == "ImageBaseMap")//获取影像地图（底图）
            //{
            //    this._layerId = "img_w";
            //}
            //else if (type == "ImageCNNote")//获取影像地图（中文注记）
            //{
            //    this._layerId = "cia_w";
            //}
            //else if (type == "ImageENNote")//获取影像地图（英文注记）
            //{
            //    this._layerId = "eia_w";
            //}
            //else if (type == "TerrainBaseMap")//获取地形图（底图）
            //{
            //    this._layerId = "ter_w";
            //}
            //else if (type == "TerrainCNNote")//获取地形图（中文注记）
            //{
            //    this._layerId = "cta_w";
            //}
            //else if (type == "TerrainENNote")//获取地形图（英文注记）
            //{
            //    //暂无
            //}
            //else if (type == "VectorBaseMap")//获取矢量图（底图）
            //{
            //    this._layerId = "vec_w";
            //}
            //else if (type == "VectorCNNote")//获取矢量图（中文注记）
            //{
            //    this._layerId = "cva_w";
            //}
            //else if (type == "VectorENNote")//获取矢量图（英文注记）
            //{
            //    this._layerId = "eva_w";
            //}
            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0,
                "origin": {
                    "x": -20037508.3427892 + 260287,
                    "y": 20037508.3427892 - 127804
                },
                "spatialReference": {
                    "wkid": 3857
                },
                "lods": [
              { "level": 1, "resolution": 77664.761018562790697674418604651, "scale": 2.958293554545656E8 },
              { "level": 2, "resolution": 38832.380509281395348837209302326, "scale": 1.479146777272828E8 },
              { "level": 3, "resolution": 19416.190254640697674418604651163, "scale": 7.39573388636414E7 },
              { "level": 4, "resolution": 9708.0951273203488372093023255814, "scale": 3.69786694318207E7 },
              { "level": 5, "resolution": 4854.0475636601744186046511627907, "scale": 1.848933471591035E7 },
              { "level": 6, "resolution": 2427.0237818300872093023255813953, "scale": 9244667.357955175 },
              { "level": 7, "resolution": 1213.5118909150436046511627906977, "scale": 4622333.678977588 },
              { "level": 8, "resolution": 606.75594545752180232558139534884, "scale": 2311166.839488794 },
              { "level": 9, "resolution": 303.37797272876090116279069767442, "scale": 1155583.419744397 },
              { "level": 10, "resolution": 151.68898636438045058139534883721, "scale": 577791.7098721985 },
              { "level": 11, "resolution": 75.844493182190225290697674418605, "scale": 288895.85493609926 },
              { "level": 12, "resolution": 37.922246591095112645348837209302, "scale": 144447.92746804963 },
              { "level": 13, "resolution": 18.961123295547556322674418604651, "scale": 72223.96373402482 },
              { "level": 14, "resolution": 9.4805616477737781613372093023256, "scale": 36111.98186701241 },
              { "level": 15, "resolution": 4.7402808238868890806686046511628, "scale": 18055.990933506204 },
              { "level": 16, "resolution": 2.3701404119434445403343023255814, "scale": 9027.995466753102 },
              { "level": 17, "resolution": 1.1850702059717222701671511627907, "scale": 4513.997733376551 },
              { "level": 18, "resolution": 0.59253510298586113508357558139535, "scale": 2256.998866688275 }
            ]
            });

            this.loaded = true;
            this.onLoad(this);
        },
        getTileUrl: function (level, row, col) {
            //var urlRequest = "http://t0.tianditu.gov.com/DataServer?T=" + this._layerId + "&x=" + col + "&y=" + row + "&l=" + level +"&tk=cdfddb6dd546957382d0ea51a65acf19";
            var urlRequest = "http://t0.tianditu.gov.cn/" + this.id + "/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" + this.id.replace("_w","") +"&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&tk=cdfddb6dd546957382d0ea51a65acf19";
            return urlRequest;

        }
    });
});