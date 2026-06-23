define(["dojo/dom", "dojo/dom-style",
        "myJs/MapText", "dojo/dom-construct", "dojo/domReady!"
      ], function (dom, domStyle, MapText, domConstruct) {
          return dojo.declare("Testt", null, {
              constructor: function (a) {
                  alert(a.toString());
              }
          });
      });