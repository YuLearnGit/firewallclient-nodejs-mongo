var sendInfo = require('../tools/sendInfo.js');
var configInfo = require('../tools/listenConfigInfo.js');
var mongo = require('../tools/dbOperations-mongo.js');

/**
 * 配置源地址映射规则
 * Author：于仁飞
 * @param {*防火墙对象，无IP模式下不能配置} dev 
 * @param {*网口} ethName 
 * @param {*网口对应设备的IP地址} devIp 
 * @param {*网口IP地址} ethIp 
 * @param {*网口IP对应的掩码}netmask
 * @param {*true为添加,false为删除} addOrDelete 
 */

function configSNATRules(dev, ethName, devIp, ethIp, netmask, addOrDelete) {
    if (dev.getDevIP() == "0.0.0.0")
        return false;
    var configEthBr, configEthIp, SNATRules;
    var rule = "iptables -t nat -A POSTROUTING -s " + devIp + " -o br0 -j SNAT --to-source " + dev.getDevIP();
    var data = {
        "fwMAC": dev.getDevMAC(),
        "devIP": devIp,
        "ethName": ethName,
        "ethIP": ethIp,
        "netmask": netmask,
        "NATIP": dev.getDevIP()
    };
    var collection = "snat"; //数据库集合名称
    if (addOrDelete) {
        configEthBr = "brctl delif br0 " + ethName;
        configEthIp = "ifconfig " + ethName + " " + ethIp + " netmask " + netmask + " up";
        SNATRules = "NAT1" + configEthBr + " && " + configEthIp + " && " + rule;
        mongo.insertData(data, collection);
    }
    if (!addOrDelete) {
        configEthBr = "brctl addif br0 " + ethName;
        configEthIp = "ifconfig " + ethName + " 0.0.0.0 up";
        SNATRules = "NAT0" + configEthIp + " && " + configEthBr + " && " + rule;
        mongo.deleteData(data, collection);
    }

    sendInfo.sendConfigInfo(dev.getDevIP(), SNATRules);
    return configInfo.listenConfigInfo();
}
exports.configSNATRules = configSNATRules;

/**
 * 配置目的地址映射规则
 * Author：于仁飞
 * @param {*防火墙设备对象，无IP模式下不能配置} dev 
 * @param {*原目的IP地址} originIp 
 * @param {*原目的端口，any表示任意端口} originPort 
 * @param {*映射IP地址} mapIp 
 * @param {*映射端口，any表示任意端口} mapPort 
 * @param {*true为添加,false为删除} addOrDelete 
 */
function configDNATRules(dev, originIp, originPort, mapIp, mapPort, addOrDelete) {
    if (dev.getDevIP() == "0.0.0.0")
        return false;
    var preRule, DNATRules;
    if (originPort != "any" & mapPort != "any") {
        preRule = "iptables -t nat -A PREROUTING -d" + " " + originIp + " " + "-p tcp --dport " + originPort +
            " -j DNAT --to-destination " + mapIp + ":" + mapPort;
    }
    if (originPort != "any" & mapPort == "any") {
        preRule = "iptables -t nat -A PREROUTING -d" + " " + originIp + " " + "-p tcp --dport " + originPort +
            " -j DNAT --to-destination " + mapIp;
    }
    if (originPort == "any" & mapPort != "any") {
        preRule = "iptables -t nat -A PREROUTING -d" + " " + originIp + " " + "-p tcp " + " -j DNAT --to-destination " + mapIp + ":" + mapPort;
    }
    if (originPort == "any" & mapPort == "any") {
        preRule = "iptables -t nat -A PREROUTING -d" + " " + originIp + " " + "-p tcp " + " -j DNAT --to-destination " + mapIp;
    }
    var data = {
        "fwMAC": dev.getDevMAC(),
        "dstIP": originIp,
        "dport": originPort,
        "mapIP": mapIp,
        "mapPort": mapPort
    };
    var collection = "dnat"; //数据库集合名称
    if (addOrDelete) {
        DNATRules = "NAT1" + preRule;
        mongo.insertData(data, collection);
    }
    if (!addOrDelete) {
        DNATRules = "NAT0" + preRule;
        mongo.deleteData(data, collection);
    }
    sendInfo.sendConfigInfo(dev.getDevIP(), DNATRules);
    return configInfo.listenConfigInfo();
}
exports.configDNATRules = configDNATRules;