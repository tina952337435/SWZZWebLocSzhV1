window.dojoConfig = {
     //用于定义dojo核心示范异步加载,true：异步，false：同步
    async: true,
     //如果为true则立即加载deps数组中所有的依赖JS，如果为false则忽略deps数组
    parseOnLoad: false,
    tlmSiblingOfDojo: false,
    has: {
        'extend-esri': 1
    },
    packages: [{
        name: "myJs",
        location:window.location.pathname.indexOf('swzzWeb')>-1? "/swzzWeb/arcgis_js_api/myJs/Class":"/arcgis_js_api/myJs/Class"
    }]
};