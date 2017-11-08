var sendInfo = require('../tools/sendInfo.js');
var mongo = require('../tools/dbOperations-mongo.js');
var configInfo = require('../tools/listenConfigInfo.js');

/**
 * 配置连接数控制规则
 * @param {*被保护设备IP地址string} devIp 
 * @param {*连接数string} conlimit 
 * @param {*源IP地址string(any表示任意)} srcIp 
 * @param {*目的IP地址string} dstIp 
 * @param {*源端口string} sport 
 * @param {*目的端口string} dport 
 * @param {*true为添加，false为删除bool} addOrDelete 
 */

function configCNCRules(devIp, conlimit, srcIp, dstIp, sport, dport, addOrDelete) {
    if (devIp == "0.0.0.0")
        return false;
    var rule, CNCRules, sqlRule;
    if (srcIp != "any") {
        rule = "iptables -A FORWARD -p tcp --syn -s " + srcIp + " --sport " + sport + " -d " + dstIp + " --dport " + dport +
            " -m connlimit --connlimit-above " + conlimit;
    }
    if (srcIp == "any") {
        rule = "iptables -A FORWARD -p tcp --syn --sport " + sport + " -d " + dstIp + " --dport " + dport +
            " -m connlimit --connlimit-above " + conlimit;
    }

    var CNCLogRule = rule + " -j LOG";
    var data = {
        "devIP": devIp,
        "connlimit": conlimit,
        "srcIP": srcIp,
        "dstIP": dstIp,
        "sport": sport,
        "dport": dport
    };
    var collection = "cnc"; //数据库集合名称
    if (addOrDelete) {
        CNCRules = "CNC1" + CNCLogRule + " && " + rule;
        mongo.insertData(data, collection);
        sendInfo.sendConfigInfo(devIp, CNCRules);
        return (configInfo.listenConfigInfo());
    }
    if (!addOrDelete) {
        CNCRules = "CNC0" + CNCLogRule + " && " + rule;
        mongo.deleteData(data, collection);
        sendInfo.sendConfigInfo(devIp, CNCRules);
        return (configInfo.listenConfigInfo());
    }
}
exports.configCNCRules = configCNCRules;