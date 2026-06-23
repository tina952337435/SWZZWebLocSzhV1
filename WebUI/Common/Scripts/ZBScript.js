 
function getWaterInfo(resultData) {
    openTL("sqtl");
    var qcCount = 0;
    var zcCount = 0;
    var sureCount = 0;
    var warnCount = 0;
    var t = mini.get("thsq");
    var value1 = getTLObj("cb_waterCB").checked;
    var value2 = getTLObj("cb_waterCJ").checked;
    var value3 = getTLObj("cb_waterZC").checked;
    var value4 = getTLObj("cb_waterQC").checked;
    if (resultData == null)
        return;
    var dt = []; 
    for (var i = 0; i < resultData.length; i++) {
        resultData[i].STATE = 0;
        var bsnm = resultData[i].BSNM;
        var z = Number(resultData[i].UPZ).toFixed(2);
        var wrz = Number(resultData[i].WRZ).toFixed(2);
        var grz = Number(resultData[i].GRZ).toFixed(2);

        if (resultData[i].UPZ == null || resultData[i].UPZ == "") {

            if (value4) {
                qcCount++;
                //dt.push(resultData[i]);
                if (bsnm == "太湖流域") {
                    qcCount++;
                    dt.push(resultData[i]);
                } else {
                    if (t.checked) {
                        qcCount++;
                        dt.push(resultData[i]);
                    }
                }


            }
        }
        else if (z >= grz) {
            //red
            resultData[i].STATE = 2;

            if (value1) {
                sureCount++;
                //dt.push(resultData[i]);
                if (bsnm == "太湖流域") {
                    sureCount++;
                    dt.push(resultData[i]);
                } else {
                    if (t.checked) {
                        sureCount++;
                        dt.push(resultData[i]);
                    }
                }
            }
        } else if (z >= wrz) {
            //FFA500 

            resultData[i].STATE = 1;
            if (value2) {
                warnCount++;
                //dt.push(resultData[i]);
                if (bsnm == "太湖流域") {
                    warnCount++;
                    dt.push(resultData[i]);
                } else {
                    if (t.checked) {
                        warnCount++;
                        dt.push(resultData[i]);
                    }
                }
            }
        }
        else {

            if (value3) {
                zcCount++;
                //dt.push(resultData[i]);
                if (bsnm == "太湖流域") {
                    zcCount++;
                    dt.push(resultData[i]);
                } else {
                    if (t.checked) {
                        zcCount++;
                        dt.push(resultData[i]);
                    }
                }
            }
        }
    }
    console.log(JSON.stringify(dt));

    require(["../../../page/sq/water.js"], function (water) {
        water.addMark(dt);
    });
}