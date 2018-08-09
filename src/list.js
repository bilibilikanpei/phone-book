const router = require("express").Router();
const mongodb = require("mongodb");

const get_mime=require("./mime")
// 加载mongo的组件
const db_client = mongodb.MongoClient;

const db_connstr = 'mongodb://127.0.0.1:27017/students';

router.get("/", (req, res) => {
    let param = req.query;

    //连接数据库
    db_client.connect(db_connstr, (err, db) => {
        if (err) {
            console.log("连接数据库失败", err)
        } else {
            let collection = db.collection("linkman");
            let $where = param.keyword ? { name: new RegExp(param.keyword) } : {};
            collection.find($where).sort({ "_id": -1 }).toArray((err, result) => {
                if (!err) {
                    res.writeHead(200, { 'Content-Type': get_mime('json') });
                    res.end(JSON.stringify(result));
                } else {

                }
                db.close();
            });
        }
    });
});



module.exports = router;