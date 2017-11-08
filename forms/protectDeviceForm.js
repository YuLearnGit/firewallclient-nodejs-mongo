module.exports = protectDeviceForm;

/**
 * 被保护设备对象
 * function：获取设备IP、MAC及设备类型
 * AUthor：于仁飞
 * @param {*被保护设备的IP地址} devIP 
 * @param {*被保护设备的MAC地址} devMAC 
 */

function protectDeviceForm(devIP, devMAC) {
    this.devMAC = devMAC;
    this.devIP = devIP;

    //返回设备MAC地址
    this.getDevMAC = function () {
        return devMAC;
    };

    //返回设备IP地址
    this.getDevIP = function () {
        return devIP;
    };
    //获取设备类型
    this.getDevType = function () {
        var devType = "";
        var macArray = devMAC.toString().split(":");
        var macQuery = macArray[0] + "-" + macArray[1] + "-" + macArray[2];
        var mongo = require('../tools/dbOperations-mongo.js');
        var data = {
            "_id": 0,
            "Macs": 0
        };
        var matchData = {
            "Macs": macQuery
        };
        devType = mongo.selectData(data, matchData, "macs");
        return devType;

    };
}