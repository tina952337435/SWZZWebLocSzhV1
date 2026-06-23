define(["dojo/_base/declare", "esri/layers/tiled"], function (declare) {
    return declare(esri.layers.MapImageLayer, {
        constructor: function (str) {
            this.id = str;
            this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(120.54221007432837,30.86325609670976, 122.65897858511498, 32.07202228767154, this.spatialReference));

            this.tileInfo = new esri.layers.TileInfo({
                "height": 4096,
                "width": 4096,
                "count": 1000,
            });
			
            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function () {
			console.error("eeeee");
			var  layerUrl="http://31.16.1.101/arcgis/rest/services/SHHY_HYJCXX_GCS2000/MapServer/export?bbox=120.29796692474864,31.003465856390534,122.1963959308809,31.443175515899114&bboxSR=4490&imageSR=4490&size=1904,441&dpi=96&format=png32&transparent=true&layers=show:2,5,6,7,9,10,11,12,13,14,15,16,17,18,19,21,22&f=image";
            return layerUrl;
		}
    });
});