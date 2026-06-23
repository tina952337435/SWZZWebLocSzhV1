define(["dojo/_base/declare", "esri/layers/ArcGISTiledMapServiceLayer"], function (declare, ArcGISTiledMapServiceLayer) {
    return declare(ArcGISTiledMapServiceLayer, {
        constructor: function (str) {
            this.id = str;
            this.spatialReference = new esri.SpatialReference({ "wkt": "GEOGCS[\"GCS_China_Geodetic_Coordinate_System_2000\",DATUM[\"D_China_2000\",SPHEROID[\"CGCS2000\",6378137.0,298.2572221 01]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433 ],AUTHORITY[\"EPSG\",4490]]" });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(120.575311755542, 31.3405108864624, 120.687444821724,31.4625275604062, this.spatialReference));
            this.token = "kAiTBjERZMWBITLdsXqHR9b6eswMtXgGt2lSI9FCA3q1qs1WyYk9BwJHpZCZSoAbXolbKHwYgOVHHXl0IKeHvS3ZMZkMsQvF5gjr67dmlXX7KK1984gagg%3D%3D";
            this.url = "http://172.16.101.11/xcscms/sipsd/service/TileService/IMG2015CGCS2000/MapServer?token=" + this.token;
            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0,
                "origin": {
                    "x": 120.292,
                    "y": 31.57
                },
                "spatialReference": {
                    "wkt":"GEOGCS[\"GCS_China_Geodetic_Coordinate_System_2000\",DATUM[\"D_China_2000\",SPHEROID[\"CGCS2000\",6378137.0,298.2572221 01]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433 ],AUTHORITY[\"EPSG\",4490]]"
                },
                "lods": [{ "level": 0, "resolution": 0.00118973050291514, "scale": 500000 },
                         { "level": 1, "resolution": 0.000475892201166056, "scale": 200000 },
                         { "level": 2, "resolution": 0.000237946100583028, "scale": 100000 },
                         { "level": 3, "resolution": 0.000118973050291514, "scale": 50000 },
                         { "level": 4, "resolution": 0.0000475892201166056, "scale": 20000 },
                         { "level": 5, "resolution": 0.0000237946100583028, "scale": 10000 },
                         { "level": 6, "resolution": 0.0000118973050291514, "scale": 5000 },
                        { "level": 7, "resolution": 0.00000475892201166056, "scale": 2000 },
                        { "level": 8, "resolution": 0.00000237946100583028, "scale": 1000}]
            });

            //this.loaded = true;
            //this.onLoad(this);
        }
    });
});