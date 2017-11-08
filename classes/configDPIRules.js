var protectForm = require('../forms/protectDeviceForm.js');
var fwDeviceForm = require('../forms/fwDeviceForm.js');
var sendInfo = require('../tools/sendInfo.js');
var configInfo = require('../tools/listenConfigInfo.js');
var mongo = require('../tools/dbOperations-mongo');

/**
 * 配置ModbusTCP规则
 * Author：于仁飞
 * @param {*设备对象（防火墙或者被保护设备）} dev 
 * @param {*modbus规则对象} modbusTcpForm 
 * @param {*日志标志} logFlag 
 * @param {*true为添加规则，false为删除规则} addOrDelete 
 */

function configModbusTcpRules(dev, modbusTcpForm, logFlag, addOrDelete) {
    var dpiProto = "modbusTcp";
    var flag;
    var dpiRules, dpiLogRule;

    if (modbusTcpForm.getSrcIp() == "any" && modbusTcpForm.getDstIp() == "any") {
        dpiRules = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + "DROP";

        dpiLogRule = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + "LOG" + " " + "--log-prefix " + "\"" + "DROP&modbus&data_illegal " + "\"";
    }
    if (modbusTcpForm.getSrcIp() == "any" && modbusTcpForm.getDstIp() != "any") {
        dpiRules = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-d" + " " + modbusTcpForm.getDstIp() + " " + "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + "DROP";

        dpiLogRule = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-d" + " " + modbusTcpForm.getDstIp() + " " + "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + "LOG" + " " + "--log-prefix " + "\"" + "DROP&modbus&data_illegal " + "\"";
    }

    if (modbusTcpForm.getSrcIp() != "any" && modbusTcpForm.getDstIp() == "any") {
        dpiRules = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-s " + modbusTcpForm.getSrcIp() + " " + "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + "DROP";

        dpiLogRule = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-s " + modbusTcpForm.getSrcIp() + " " + "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + "LOG" + " " + "--log-prefix " + "\"" + "DROP&modbus&data_illegal " + "\"";
    }

    if (modbusTcpForm.getSrcIp() != "any" && modbusTcpForm.getDstIp() != "any") {
        dpiRules = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-s " + modbusTcpForm.getSrcIp() + " " + "-d" + " " + modbusTcpForm.getDstIp() + " " + "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + " DROP";

        dpiLogRule = "iptables" + " -A" + " " + "FORWARD" + " " + "-p tcp" + " " + "--dport" + " " + "502" + " " +
            "-s " + modbusTcpForm.getSrcIp() + " " + "-d" + " " + modbusTcpForm.getDstIp() + " " + "-m" + " " + dpiProto + " " + "--data-addr" + " " + modbusTcpForm.getMinAddr() + ":" + modbusTcpForm.getMaxAddr() + " " + "--modbus-func " +
            modbusTcpForm.getFunc() + " " + "--modbus-data " + modbusTcpForm.getMinData() + ":" + modbusTcpForm.getMaxData() + " -j" + " " + "LOG" + " " + "--log-prefix " + "\"" + "DROP&modbus&data_illegal " + "\"";
    }
    var data = {
        "devIP": dev.getDevIP(),
        "protocol": 'modbusTcp',
        "sourceAddress": modbusTcpForm.getSrcIp(),
        "destination": modbusTcpForm.getDstIp(),
        "coilAddressStart": modbusTcpForm.getMinAddr(),
        "coilAddressEnd": modbusTcpForm.getMaxAddr(),
        "minSpeed": modbusTcpForm.getMinData(),
        "maxSpeed": modbusTcpForm.getMaxData(),
        "functionCode": modbusTcpForm.getFunc(),
        "logFlag": logFlag,
        "method": 'DROP'
    };
    var collection = "modbustcp"; //数据库集合名称
    if (addOrDelete) {
        flag = "DPI1";

        var addModbusTcpRules = flag + dpiLogRule + " && " + dpiRules;
        sendInfo.sendConfigInfo(dev.getDevIP(), addModbusTcpRules);
        mongo.insertData(data, collection);

    } else {
        flag = "DPI0";
        var DeleteModbusTcpRules = flag + dpiLogRule + " && " + dpiRules;
        sendInfo.sendConfigInfo(dev.getDevIP(), DeleteModbusTcpRules);
        mongo.deleteData(data, collection);
    }

    return (configInfo.listenConfigInfo());
}
exports.configModbusTcpRules = configModbusTcpRules;


/**
 * 用于配置OPC规则
 * Author：于仁飞
 * @param {*防火墙或被保护设备对象} dev 
 * @param {*OPC规则对象} OPCRulesForm 
 * @param {*记录日志} logFlag 
 * @param {*true为添加日志，false为删除日志} addOrDelete 
 */
function configOPCRules(dev, OPCRulesForm, logFlag, addOrDelete) {
    var flag, dpiRules, dpiLogRule;

    if (OPCRulesForm.getSrcIp() == "any" && OPCRulesForm.getDstIp() == "any") {
        dpiRules = "iptables -A FORWARD -p tcp --dport 135 -m state --state ESTABLISHED -j NFQUEUE --queue-num 1";
        dpiLogRule = "iptables -A FORWARD -p tcp --dport 135 -m state --state ESTABLISHED -j LOG --log-prefix " + "\"" + "ACCEPT&OPC&ESTABLISHED " + "\"";
    }
    if (OPCRulesForm.getSrcIp() != "any" && OPCRulesForm.getDstIp() == "any") {
        dpiRules = "iptables -A FORWARD -p tcp -s " + OPCRulesForm.getSrcIp() + " --dport 135 -m state --state ESTABLISHED -j NFQUEUE --queue-num 1";
        dpiLogRule = "iptables -A FORWARD -p tcp -s " + OPCRulesForm.getSrcIp() + " --dport 135 -m state --state ESTABLISHED -j LOG --log-prefix " + "\"" + "ACCEPT&OPC&ESTABLISHED " + "\"";
    }
    if (OPCRulesForm.getSrcIp() == "any" && OPCRulesForm.getDstIp() != "any") {
        dpiRules = "iptables -A FORWARD -p tcp -d " + OPCRulesForm.getDstIp() + " --dport 135 -m state --state ESTABLISHED -j NFQUEUE --queue-num 1";
        dpiLogRule = "iptables -A FORWARD -p tcp -d " + OPCRulesForm.getDstIp() + " --dport 135 -m state --state ESTABLISHED -j LOG --log-prefix " + "\"" + "ACCEPT&OPC&ESTABLISHED " + "\"";
    }
    if (OPCRulesForm.getSrcIp() != "any" && OPCRulesForm.getDstIp() != "any") {
        dpiRules = "iptables -A FORWARD -p tcp -s " + OPCRulesForm.getSrcIp() + " -d " + OPCRulesForm.getDstIp() + " --dport 135 -m state --state ESTABLISHED -j NFQUEUE --queue-num 1";
        dpiLogRule = "iptables -A FORWARD -p tcp -s " + OPCRulesForm.getSrcIp() + " -d " + OPCRulesForm.getDstIp() + " --dport 135 -m state --state ESTABLISHED -j LOG --log-prefix " + "\"" + "ACCEPT&OPC&ESTABLISHED " + "\"";
    }
    var data = {
        "devIP": dev.getDevIP(),
        "dstIP": OPCRulesForm.getDstIp(),
        "srcIP": OPCRulesForm.getSrcIp(),
        "logFlag": logFlag,
        "method": 'DROP'
    };
    var collection = "opc"; //数据库集合名称
    if (addOrDelete) {
        flag = "DPI1";
        var addOPCRules = flag + dpiLogRule + " && " + dpiRules;
        sendInfo.sendConfigInfo(dev.getDevIP(), addOPCRules);
        mongo.insertData(data, collection);
    } else {
        flag = "DPI0";
        var deleteOPCRules = flag + dpiLogRule + " && " + dpiRules;
        sendInfo.sendConfigInfo(dev.getDevIP(), deleteOPCRules);
        mongo.deleteData(data, collection);
    }
    return (configInfo.listenConfigInfo());
}
exports.configOPCRules = configOPCRules;


/**
 * 用于配置DNP3规则
 * Author：于仁飞
 * @param {*防火墙或被保护设备对象} dev 
 * @param {*DNP3规则对象} OPCRulesForm 
 * @param {*记录日志} logFlag 
 * @param {*true为添加日志，false为删除日志} addOrDelete 
 */
function configDNP3Rules(dev, DNP3Form, logFlag, addOrDelete) {
    var dpiRules0, dpiRules1, dpiLogRule, flag;
    if (DNP3Form.getSrcIp() == "any" && DNP3Form.getDstIp() == "any") {
        dpiRules0 = "iptables -A FORWARD -p tcp " + " --dport 20000 -m state --state NEW -j DROP";
        dpiRules1 = "iptables -A FORWARD -p tcp " + " --dport 20000 -m state --state ESTABLISHED -j DROP";
        dpiLogRule = "iptables -A FORWARD -p tcp " + " --dport 20000 -m state --state new -j LOG --log-prefix " + "\"" + "DROP&DNP3&illegal " + "\"";
    }
    if (DNP3Form.getSrcIp() != "any" && DNP3Form.getDstIp() == "any") {
        dpiRules0 = "iptables -A FORWARD -p tcp -s " + DNP3Form.getSrcIp() + " --dport 20000 -m state --state NEW -j DROP";
        dpiRules1 = "iptables -A FORWARD -p tcp -s " + DNP3Form.getSrcIp() + " --dport 20000 -m state --state ESTABLISHED -j DROP";
        dpiLogRule = "iptables -A FORWARD -p tcp -s " + DNP3Form.getSrcIp() + " --dport 20000 -m state --state new -j LOG --log-prefix " + "\"" + "DROP&DNP3&illegal " + "\"";
    }
    if (DNP3Form.getSrcIp() == "any" && DNP3Form.getDstIp() != "any") {
        dpiRules0 = "iptables -A FORWARD -p tcp" + " -d " + DNP3Form.getDstIp() + " --dport 20000 -m state --state NEW -j DROP";
        dpiRules1 = "iptables -A FORWARD -p tcp" + " -d " + DNP3Form.getDstIp() + " --dport 20000 -m state --state ESTABLISHED -j DROP";
        dpiLogRule = "iptables -A FORWARD -p tcp" + " -d " + DNP3Form.getDstIp() + " --dport 20000 -m state --state new -j LOG --log-prefix " + "\"" + "DROP&DNP3&illegal " + "\"";
    }
    if (DNP3Form.getSrcIp() != "any" && DNP3Form.getDstIp() != "any") {
        dpiRules0 = "iptables -A FORWARD -p tcp -s " + DNP3Form.getSrcIp() + " -d " + DNP3Form.getDstIp() + " --dport 20000 -m state --state NEW -j DROP";
        dpiRules1 = "iptables -A FORWARD -p tcp -s " + DNP3Form.getSrcIp() + " -d " + DNP3Form.getDstIp() + " --dport 20000 -m state --state ESTABLISHED -j DROP";
        dpiLogRule = "iptables -A FORWARD -p tcp -s " + DNP3Form.getSrcIp() + " -d " + DNP3Form.getDstIp() + " --dport 20000 -m state --state new -j LOG --log-prefix " + "\"" + "DROP&DNP3&illegal " + "\"";
    }
    var data = {
        "devIP": dev.getDevIP(),
        "dstIP": DNP3Form.getDstIp(),
        "srcIP": DNP3Form.getSrcIp(),
        "logFlag": logFlag,
        "method": 'DROP'
    };
    var collection = "dnp3"; //数据库集合名称
    if (addOrDelete) {
        flag = "DPI1";
        var addDNP3Rules = flag + dpiLogRule + " && " + dpiRules0 + " && " + dpiRules1;
        sendInfo.sendConfigInfo(dev.getDevIP(), addDNP3Rules);
        mongo.insertData(data, collection);
    } else {
        flag = "DPI0";
        var deleteDNP3Rules = flag + dpiLogRule + " && " + dpiRules0 + " && " + dpiRules1;
        sendInfo.sendConfigInfo(dev.getDevIP(), deleteDNP3Rules);
        mongo.deleteData(data, collection);
    }
    return (configInfo.listenConfigInfo());
}
exports.configDNP3Rules = configDNP3Rules;

/**
 * 清除配置的所有规则(暂未使用)
 * @param {*防火墙或者被保护设备对象} dev 
 */
function clearAllRules(dev) {
    var clearRule = "iptables -F && iptables -t NAT -F && iptables-restore</etc/iptables.up.rules";
    sendInfo.sendConfigInfo(dev.getDevIP(), clearRule);
}
exports.clearAllRules = clearAllRules;