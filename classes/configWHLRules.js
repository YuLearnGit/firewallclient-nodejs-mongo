var sendInfo = require('../tools/sendInfo.js');
var configInfo = require('../tools/listenConfigInfo.js');
var whlForm = require('../forms/whiteListForm.js');
var mongo = require('../tools/dbOperations-mongo.js');

/**
 * 白名单规则配置
 * Author：于仁飞
 * @param {*设备IP地址} devIp 
 * @param {*白名单对象} whlForm 
 * @param {*true为添加,false为删除} addOrDelete 
 */
function configWHLRules(devIp, whlForm, addOrDelete) {
    if (devIp == "0.0.0.0")
        return false;
    var WHLRules, rule, logRule;
    var collection = "whl"; //数据库名称
    var data = {
        "devIP": devIp,
        "dstIP": whlForm.getDstIp(),
        "srcIP": whlForm.getSrcIp(),
        "dport": whlForm.getDstPort(),
        "sport": whlForm.getSrcPort()
    };
    if (addOrDelete) {
        rule = "iptables -A FORWARD -p tcp -s " + whlForm.getSrcIp() + " --sport " + whlForm.getSrcPort() + " -d " +
            whlForm.getDstIp() + " --dport " + whlForm.getDstPort() + " -j ACCEPT";
        logRule = "WHL1iptables -A FORWARD -p tcp -s " + whlForm.getSrcIp() + " --sport " + whlForm.getSrcPort() + " -d " +
            whlForm.getDstIp() + " --dport " + whlForm.getDstPort() + " -j LOG";
        mongo.insertData(data, collection);
    }
    if (!addOrDelete) {
        rule = "iptables -A FORWARD -p tcp -s " + whlForm.getSrcIp() + " --sport " + whlForm.getSrcPort() + " -d " +
            whlForm.getDstIp() + " --dport " + whlForm.getDstPort() + " -j ACCEPT";
        logRule = "WHL0iptables -A FORWARD -p tcp -s " + whlForm.getSrcIp() + " --sport " + whlForm.getSrcPort() + " -d " +
            whlForm.getDstIp() + " --dport " + whlForm.getDstPort() + " -j LOG";
        mongo.deleteData(data, collection);
    }
    WHLRules = logRule + " && " + rule;
    sendInfo.sendConfigInfo(devIp, WHLRules);
    return configInfo.listenConfigInfo();
}
exports.configWHLRules = configWHLRules;