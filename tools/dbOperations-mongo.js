var mongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/firewallclient'; //连接MongoDB数据库字符串


/**
 * 数据库插入操作
 * AUthor：于仁飞
 * @param {*内容} data
 * @param {*集合名称} collec 
 */
function insertData(data, collec) {
    mongoClient.connect(DB_CONN_STR, function (err, db) {
        var collection = db.collection(collec);
        if (collec == "firewallInfo")
            collection.drop();
        collection.insert(data, function (err, result) {
            if (err) {
                console.log('error:' + err);
                return;
            } else console.log(result);
            db.close();
        });
    });
}
exports.insertData = insertData;

/**
 * 数据库删除操作
 * AUthor：于仁飞
 * @param {*删除内容} data 
 * @param {*集合名称} collec 
 */
function deleteData(data, collec) {
    mongoClient.connect(DB_CONN_STR, function (err, db) {
        var collection = db.collection(collec);
        collection.remove(data, function (err, result) {
            if (err) {
                console.log('error:' + err);
                return;
            } else console.log(result);
            db.close();
        });
    });
}
exports.deleteData = deleteData;

/**
 * 数据库更新操作
 * AUthor：于仁飞
 * @param {*更新数据} data 
 * @param {*更新查询条件} matchData 
 * @param {*集合} collec 
 */
function updateData(data, matchData, collec) {
    mongoClient.connect(DB_CONN_STR, function (err, db) {
        var collection = db.collection(collec);
        collection.update(matchData, data, function (err, result) {
            if (err) {
                console.log('error: ' + err);
                return;
            } else {
                console.log(result);
                return true;
            }
            db.close();
        });

    });
}
exports.updateData = updateData;

/**
 * 数据库查询操作
 * function:用于查询被保护设备类型
 * AUthor：于仁飞
 * @param {*指定显示的结果} data 
 * @param {*查询匹配条件} matchData 
 * @param {*集合} collec 
 */
function selectData(data, matchData, collec) {
    var devType = "";
    mongoClient.connect(DB_CONN_STR, function (err, db) {
        var collection = db.collection(collec);
        collection.find(matchData, data).toArray(function (err, results) {
            if (err) {
                console.log(err);
                return;
            } else {
                if (results && results.length != 0) {
                    for (var i = 0; i < results.length; i++) {
                        devType = results[i].Manufacturers;
                        console.log("设备类型：%s\t", devType);
                    }
                } else {
                    devType = "受保护设备类型未知!";
                    console.log(devType);
                }
            }
            db.close();
        });
    });
    return devType;
}
exports.selectData = selectData;

/**
 * 删除数据库操作
 */
// function deleteDB() {
//     mongoClient.connect(DB_CONN_STR, function (err, db) {
//         db.dropDatabase();
//     });
// }
// exports.deleteDB = deleteDB;