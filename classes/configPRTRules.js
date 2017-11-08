var sendInfo = require('../tools/sendInfo.js');
var configInfo = require('../tools/listenConfigInfo.js');
var mongo = require('../tools/dbOperations-mongo.js');

//策略路由规则配置
/**
 * 配置默认路由
 * Author:于仁飞
 * @param {*设备IP地址} devIp 
 * @param {*路由数据包通过的网关} gateway 
 * @param {*true为添加,false为删除} addOrDelete 
 */
function configDefaultRoute(devIp, gateway, addOrDelete) {
    if (devIp == "0.0.0.0")
        return false;
    var defaultRoute;
    var collection = "prt"; //数据库集合名称
    var data = {
        "devIP": devIp,
        "gateway": gateway,
        "routeType": "Default"
    };
    if (addOrDelete) {
        defaultRoute = "PRT1route add default gw " + gateway;
        mongo.insertData(data, collection);
    }
    if (!addOrDelete) {
        defaultRoute = "PRT0route del default gw " + gateway;
        mongo.deleteData(data, collection);
    }
    sendInfo.sendConfigInfo(devIp, defaultRoute);
    return configInfo.listenConfigInfo();
}
exports.configDefaultRoute = configDefaultRoute;

/**
 * 配置到主机的路由
 * Author:于仁飞
 * @param {*设备IP地址} devIp 
 * @param {*目的地址的主机IP地址} host 
 * @param {*路由数据包通过的网关} gateway 
 * @param {*true为添加,false为删除} addOrDelete 
 */
function configHostRoute(devIp, host, gateway, addOrDelete) {
    if (devIp == "0.0.0.0")
        return false;
    var hostRoute;
    var collection = "prt"; //数据库名称
    var data = {
        "devIP": devIp,
        "host": host,
        "gateway": gateway,
        "routeType": "Host"
    };
    if (addOrDelete) {
        hostRoute = "PRT1route add -host " + host + " gw " + gateway;
        mongo.insertData(data, collection);
    }
    if (!addOrDelete) {
        hostRoute = "PRT0route del -host " + host + " gw " + gateway;
        mongo.deleteData(data, collection);
    }
    sendInfo.sendConfigInfo(devIp, hostRoute);
    return configInfo.listenConfigInfo();
}
exports.configHostRoute = configHostRoute;

/**
 * 配置到网络的路由
 * Author:于仁飞
 * @param {*设备IP地址} devIp 
 * @param {*目的网路地址} net 
 * @param {*目的地址的网络掩码} netmask 
 * @param {*路由数据包通过的网关} gateway 
 * @param {*true为添加,false为删除} addOrDelete 
 */

function configNetRoute(devIp, net, netmask, gateway, addOrDelete) {
    if (devIp == "0.0.0.0")
        return false;
    var netRoute;
    var collection = "prt"; //数据库名称
    var data = {
        "devIP": devIp,
        "net": net,
        "netmask": netmask,
        "gateway": gateway,
        "routeType": "net"
    };
    if (addOrDelete) {
        netRoute = "PRT1route add -net " + net + " netmask " + netmask + " gw " + gateway;
        mongo.insertData(data, collection);
    }
    if (!addOrDelete) {
        netRoute = "PRT0route del -net " + net + " netmask " + netmask + " gw " + gateway;
        mongo.deleteData(data, collection);
    }
    sendInfo.sendConfigInfo(devIp, netRoute);
    return configInfo.listenConfigInfo();
}
exports.configNetRoute = configNetRoute;