var protectForm = require('../forms/protectDeviceForm.js');
var fwDeviceForm = require('../forms/fwDeviceForm.js');
var sendInfo = require('../tools/sendInfo.js');
var dbOperations = require('../tools/dbOperations.js');
var configInfo = require('../tools/listenConfigInfo.js');
var mongo = require('../tools/dbOperations-mongo.js');

/**
 * 配置应用协议控制规则
 * @param {*被保护设备IP地址} devIp 
 * @param {*协议名称string} protocol 
 * @param {*true为允许,false为禁止} protocolStatus 
 */

function configAPCRules(devIp, protocol, protocolStatus) {
    var collection = "apc"; //数据库集合名称
    var protocolPort = new Map([
        ["ftp", "21"],
        ["http", "80"],
        ["telnet", "23"],
        ["smtp", "25"],
        ["pop3", "110"],
        ["ssh", "22"]
    ]);
    if (devIp == "0.0.0.0")
        return false;
    var port = protocolPort.get(protocol);
    var rule1 = "iptables -A INPUT -p tcp --dport " + port + " -j ACCEPT && " +
        "iptables -A OUTPUT -p tcp --dport " + port + " -j ACCEPT && " +
        "iptables -A FORWARD -p tcp --sport " + port + " -j ACCEPT && " +
        "iptables -A FORWARD -p tcp --dport " + port + " -j ACCEPT";

    var rule2 = "iptables -A INPUT -p tcp --dport " + port + " -j DROP && " +
        "iptables -A OUTPUT -p tcp --dport " + port + " -j DROP && " +
        "iptables -A FORWARD -p tcp --sport " + port + " -j DROP && " +
        "iptables -A FORWARD -p tcp --dport " + port + " -j DROP";
    var APCRules, data;
    var matchData = {
        'protocol': protocol
    };
    if (protocolStatus) {
        APCRules = "APC2" + rule1 + "#" + protocol;
        data = {
            $set: {
                'status': 'allow'
            }
        };
        mongo.updateData(data, matchData, collection);
    } else {
        APCRules = "APC2" + rule2 + "#" + protocol;
        data = {
            $set: {
                'status': 'forbid'
            }
        };
        mongo.updateData(data, matchData, collection);
    }
    sendInfo.sendConfigInfo(devIp, APCRules);
    return (configInfo.listenConfigInfo());
}
exports.configAPCRules = configAPCRules;